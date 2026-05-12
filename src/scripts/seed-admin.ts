import { Role } from "@domain/users/types/user-role.type";
import dataSource from "@infra/database/typeorm/configs/migration.config";
import { UserSchema } from "@infra/database/typeorm/schemas/user.schema";
import { randomBytes, scryptSync } from "crypto";
import { config } from "dotenv";

config();

type SeedArgs = {
  name: string;
  email: string;
  password: string;
  passwordGenerated: boolean;
};

function generateStrongPassword(): string {
  return randomBytes(24).toString("base64url");
}

function parseArgs(argv: string[]): SeedArgs {
  const map = new Map<string, string>();

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      continue;
    }

    map.set(key, value);
    i += 1;
  }

  const name = (
    process.env.ADMIN_NAME ??
    map.get("name") ??
    "Master Admin"
  ).trim();
  const email = (process.env.ADMIN_EMAIL ?? map.get("email") ?? "")
    .trim()
    .toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  const cliPassword = map.get("password")?.trim();
  const password = envPassword || cliPassword || generateStrongPassword();
  const passwordGenerated = !envPassword && !cliPassword;

  if (!email) {
    throw new Error(
      "Informe o email do admin via ADMIN_EMAIL no .env ou --email na linha de comando",
    );
  }

  return {
    name,
    email,
    password,
    passwordGenerated,
  };
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function run() {
  const input = parseArgs(process.argv.slice(2));

  await dataSource.initialize();
  const usersRepository = dataSource.getRepository(UserSchema);

  const existingUser = await usersRepository.findOne({
    where: { email: input.email },
  });

  if (existingUser) {
    console.log(`Usuário já existe para o email: ${input.email}`);
    return;
  }

  const user = usersRepository.create({
    name: input.name,
    email: input.email,
    password: hashPassword(input.password),
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    cdCliente: undefined,
  });

  await usersRepository.save(user);
  console.log(`Usuário admin criado com sucesso: ${user.email}`);
  if (input.passwordGenerated) {
    console.log(`Senha gerada automaticamente: ${input.password}`);
    console.log(
      "Defina ADMIN_PASSWORD no .env para controlar a senha em próximos ambientes.",
    );
  }
}

void run()
  .catch((error) => {
    console.error("Erro ao criar usuário admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

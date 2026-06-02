import { Role } from "@domain/users/enums/user-role.enum";
import dataSource from "@infra/database/typeorm/configs/migration.config";
import { UserSchema } from "@infra/database/typeorm/schemas/user.schema";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";

config();

type SeedArgs = {
  name: string;
  email: string;
  password: string;
  funcao?: string;
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
    process.env.USER_NAME ??
    map.get("name") ??
    "Usuario Padrao"
  ).trim();
  const email = (process.env.USER_EMAIL ?? map.get("email") ?? "")
    .trim()
    .toLowerCase();
  const envPassword = process.env.USER_PASSWORD?.trim();
  const cliPassword = map.get("password")?.trim();
  const password = envPassword || cliPassword || generateStrongPassword();
  const funcao = (process.env.USER_FUNCAO ?? map.get("funcao"))?.trim();
  const passwordGenerated = !envPassword && !cliPassword;

  if (!email) {
    throw new Error(
      "Informe o email do usuario via USER_EMAIL no .env ou --email na linha de comando",
    );
  }

  return {
    name,
    email,
    password,
    funcao,
    passwordGenerated,
  };
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function run() {
  const input = parseArgs(process.argv.slice(2));

  await dataSource.initialize();
  const usersRepository = dataSource.getRepository(UserSchema);

  const existingUser = await usersRepository.findOne({
    where: { email: input.email },
  });

  if (existingUser) {
    console.log(`Usuario ja existe para o email: ${input.email}`);
    return;
  }

  const user = usersRepository.create({
    name: input.name,
    email: input.email,
    password: hashPassword(input.password),
    role: Role.CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date(),
    funcao: input.funcao,
  });

  await usersRepository.save(user);
  console.log(`Usuario criado com sucesso: ${user.email}`);
  if (input.passwordGenerated) {
    console.log(`Senha gerada automaticamente: ${input.password}`);
    console.log(
      "Defina USER_PASSWORD no .env para controlar a senha em proximos ambientes.",
    );
  }
}

void run()
  .catch((error) => {
    console.error("Erro ao criar usuario:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

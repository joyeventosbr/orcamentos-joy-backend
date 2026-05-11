import { DataSource } from "typeorm";
import { IntegrationSchema } from "../schemas/integration.schema";
import { config } from "dotenv";
import { UserSchema } from "../schemas/user.schema";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [IntegrationSchema, UserSchema],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  extra: {
    connectionLimit: 20,
  },
  migrationsTableName: "tb_migrations",
  logging: true,
  synchronize: false,
});

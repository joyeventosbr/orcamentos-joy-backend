import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV017BudgetHonorarium1779000000000
  implements MigrationInterface
{
  name = "MigrationV017BudgetHonorarium1779000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "honorarium_percentage" double precision NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "honorarium_minimum_fee" double precision NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "honorarium_minimum_fee",
      DROP COLUMN IF EXISTS "honorarium_percentage"
    `);
  }
}

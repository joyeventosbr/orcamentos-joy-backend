import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV016BudgetProjectedValue1778990000000
  implements MigrationInterface
{
  name = "MigrationV016BudgetProjectedValue1778990000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "projected_value" double precision NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "projected_value"
    `);
  }
}

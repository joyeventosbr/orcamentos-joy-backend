import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV013BudgetLineNfReceived1778960000000
  implements MigrationInterface
{
  name = "MigrationV013BudgetLineNfReceived1778960000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ADD COLUMN IF NOT EXISTS "nf_received" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      DROP COLUMN IF EXISTS "nf_received"
    `);
  }
}

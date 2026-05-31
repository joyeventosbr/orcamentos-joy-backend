import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV006BudgetStatus1778890000000 implements MigrationInterface {
  name = "MigrationV006BudgetStatus1778890000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "status" smallint NOT NULL DEFAULT 1
    `);

    await queryRunner.query(`
      UPDATE "tb_budgets"
      SET "status" = 1
      WHERE "status" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "status"
    `);
  }
}

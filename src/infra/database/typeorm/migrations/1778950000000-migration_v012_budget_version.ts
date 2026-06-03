import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV012BudgetVersion1778950000000
  implements MigrationInterface
{
  name = "MigrationV012BudgetVersion1778950000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "version" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ALTER COLUMN "version" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "version"
    `);
  }
}

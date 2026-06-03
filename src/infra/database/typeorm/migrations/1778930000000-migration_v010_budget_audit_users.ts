import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV010BudgetAuditUsers1778930000000
  implements MigrationInterface
{
  name = "MigrationV010BudgetAuditUsers1778930000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "created_by" character varying NOT NULL DEFAULT 'SYSTEM',
      ADD COLUMN IF NOT EXISTS "updated_by" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ALTER COLUMN "created_by" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "updated_by",
      DROP COLUMN IF EXISTS "created_by"
    `);
  }
}

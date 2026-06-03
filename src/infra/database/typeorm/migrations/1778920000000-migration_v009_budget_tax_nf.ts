import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV009BudgetTaxNf1778920000000
  implements MigrationInterface
{
  name = "MigrationV009BudgetTaxNf1778920000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tb_settings" ("key", "value", "created_at", "updated_at")
      VALUES ('TAX_NF', '1.1', NOW(), NULL)
      ON CONFLICT ("key") DO NOTHING
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "tax_nf" double precision NOT NULL DEFAULT 1.1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "tax_nf"
    `);

    await queryRunner.query(`
      DELETE FROM "tb_settings"
      WHERE "key" = 'TAX_NF'
      AND "value" = '1.1'
    `);
  }
}

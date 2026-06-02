import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV008BudgetLineSupplierValues1778910000000
  implements MigrationInterface
{
  name = "MigrationV008BudgetLineSupplierValues1778910000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ADD COLUMN IF NOT EXISTS "supplier" character varying,
      ADD COLUMN IF NOT EXISTS "supplier_value" double precision,
      ADD COLUMN IF NOT EXISTS "percent_bv" double precision,
      ADD COLUMN IF NOT EXISTS "percent_nf_bv" double precision,
      ADD COLUMN IF NOT EXISTS "bv_value" double precision,
      ADD COLUMN IF NOT EXISTS "percent_nf_over" double precision,
      ADD COLUMN IF NOT EXISTS "over_value" double precision,
      ADD COLUMN IF NOT EXISTS "real_value" double precision
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      DROP COLUMN IF EXISTS "real_value",
      DROP COLUMN IF EXISTS "over_value",
      DROP COLUMN IF EXISTS "percent_nf_over",
      DROP COLUMN IF EXISTS "bv_value",
      DROP COLUMN IF EXISTS "percent_nf_bv",
      DROP COLUMN IF EXISTS "percent_bv",
      DROP COLUMN IF EXISTS "supplier_value",
      DROP COLUMN IF EXISTS "supplier"
    `);
  }
}

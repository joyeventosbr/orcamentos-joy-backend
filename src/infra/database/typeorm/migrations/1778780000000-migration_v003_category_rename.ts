import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationCategoryRename1778780000000 implements MigrationInterface {
  name = "MigrationCategoryRename1778780000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.tb_budget_categories') IS NOT NULL
          AND to_regclass('public.tb_categories') IS NULL THEN
          ALTER TABLE "tb_budget_categories" RENAME TO "tb_categories";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'UQ_tb_budget_categories_code'
        ) THEN
          ALTER TABLE "tb_categories"
          RENAME CONSTRAINT "UQ_tb_budget_categories_code" TO "UQ_tb_categories_code";
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.tb_categories') IS NOT NULL
          AND to_regclass('public.tb_budget_categories') IS NULL THEN
          ALTER TABLE "tb_categories" RENAME TO "tb_budget_categories";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'UQ_tb_categories_code'
        ) THEN
          ALTER TABLE "tb_budget_categories"
          RENAME CONSTRAINT "UQ_tb_categories_code" TO "UQ_tb_budget_categories_code";
        END IF;
      END
      $$;
    `);
  }
}

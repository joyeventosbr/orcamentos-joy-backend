import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0031778790000000 implements MigrationInterface {
  name = "MigrationV0031778790000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'UQ_tb_categories_code'
        ) THEN
          ALTER TABLE "tb_categories"
          ADD CONSTRAINT "UQ_tb_categories_code" UNIQUE ("code");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_budget_lines'
            AND column_name = 'category_id'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_budget_lines'
            AND column_name = 'category_code'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          ADD COLUMN "category_code" character varying;

          UPDATE "tb_budget_lines" line
          SET "category_code" = category."code"
          FROM "tb_categories" category
          WHERE line."category_id" = category."id";

          ALTER TABLE "tb_budget_lines"
          ALTER COLUMN "category_code" SET NOT NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_f35d88c3467fd7a1478ced1ff85'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          DROP CONSTRAINT "FK_f35d88c3467fd7a1478ced1ff85";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_budget_lines'
            AND column_name = 'category_id'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          DROP COLUMN "category_id";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_tb_budget_lines_category_code'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          ADD CONSTRAINT "FK_tb_budget_lines_category_code"
          FOREIGN KEY ("category_code")
          REFERENCES "tb_categories"("code")
          ON DELETE CASCADE
          ON UPDATE CASCADE;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_tb_budget_lines_category_code'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          DROP CONSTRAINT "FK_tb_budget_lines_category_code";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_budget_lines'
            AND column_name = 'category_code'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_budget_lines'
            AND column_name = 'category_id'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          ADD COLUMN "category_id" uuid;

          UPDATE "tb_budget_lines" line
          SET "category_id" = category."id"
          FROM "tb_categories" category
          WHERE line."category_code" = category."code";

          ALTER TABLE "tb_budget_lines"
          ALTER COLUMN "category_id" SET NOT NULL;

          ALTER TABLE "tb_budget_lines"
          DROP COLUMN "category_code";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_f35d88c3467fd7a1478ced1ff85'
        ) THEN
          ALTER TABLE "tb_budget_lines"
          ADD CONSTRAINT "FK_f35d88c3467fd7a1478ced1ff85"
          FOREIGN KEY ("category_id")
          REFERENCES "tb_categories"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV011BudgetParentEditableStatus1778940000000
  implements MigrationInterface
{
  name = "MigrationV011BudgetParentEditableStatus1778940000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "is_editable" boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "parent_id" uuid
    `);

    await queryRunner.query(`
      UPDATE "tb_budgets"
      SET "is_editable" = false
      WHERE "status" IN (2, 4)
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ALTER COLUMN "is_editable" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD CONSTRAINT "FK_tb_budgets_parent_id"
      FOREIGN KEY ("parent_id")
      REFERENCES "tb_budgets"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP CONSTRAINT IF EXISTS "FK_tb_budgets_parent_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "parent_id",
      DROP COLUMN IF EXISTS "is_editable"
    `);
  }
}

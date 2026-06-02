import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV007BillingTypeNullable1778900000000 implements MigrationInterface {
  name = "MigrationV007BillingTypeNullable1778900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "billing_type" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "tb_budget_lines"
      SET "billing_type" = 'VIA CLIENTE'
      WHERE "billing_type" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "billing_type" SET NOT NULL
    `);
  }
}

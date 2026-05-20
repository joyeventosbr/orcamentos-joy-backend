import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0041778870000000 implements MigrationInterface {
  name = "MigrationV0041778870000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ADD COLUMN IF NOT EXISTS "name" character varying
    `);

    await queryRunner.query(`
      UPDATE "tb_budgets"
      SET "name" = 'Orçamento sem nome'
      WHERE "name" IS NULL OR trim("name") = ''
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      ALTER COLUMN "name" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budgets"
      DROP COLUMN IF EXISTS "name"
    `);
  }
}

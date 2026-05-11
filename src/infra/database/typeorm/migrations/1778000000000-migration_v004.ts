import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationV0041778000000000 implements MigrationInterface {
  name = 'MigrationV0041778000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_users"
      ADD COLUMN IF NOT EXISTS "role" smallint NOT NULL DEFAULT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_users"
      DROP COLUMN IF EXISTS "role"
    `);
  }
}

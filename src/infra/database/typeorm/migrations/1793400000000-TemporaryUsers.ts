import { MigrationInterface, QueryRunner } from "typeorm";

export class TemporaryUsers1793400000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE tb_users ADD COLUMN is_active boolean NOT NULL DEFAULT true, ADD COLUMN folder_ids uuid[] NOT NULL DEFAULT '{}'`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE tb_users DROP COLUMN folder_ids, DROP COLUMN is_active`);
  }
}

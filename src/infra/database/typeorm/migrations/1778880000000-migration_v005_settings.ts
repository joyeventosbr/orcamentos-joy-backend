import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV005Settings1778880000000 implements MigrationInterface {
  name = "MigrationV005Settings1778880000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tb_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "value" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_tb_settings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tb_settings_key" UNIQUE ("key")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tb_settings"`);
  }
}

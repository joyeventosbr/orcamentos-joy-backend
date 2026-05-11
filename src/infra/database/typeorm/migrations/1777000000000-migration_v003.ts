import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationV0031777000000000 implements MigrationInterface {
  name = 'MigrationV0031777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tb_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" smallint NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP,
        CONSTRAINT "UQ_tb_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_tb_users_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tb_users"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationV0051778100000000 implements MigrationInterface {
  name = 'MigrationV0051778100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = (await queryRunner.query(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tb_users'
        AND column_name = 'role'
    `)) as Array<{ data_type: string }>;

    const roleColumnType = result[0]?.data_type;

    if (!roleColumnType) {
      return;
    }

    if (roleColumnType === 'smallint') {
      await queryRunner.query(`
        ALTER TABLE "tb_users"
        ALTER COLUMN "role" SET DEFAULT 1
      `);

      return;
    }

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      ADD COLUMN "role_tmp" smallint NOT NULL DEFAULT 1
    `);

    await queryRunner.query(`
      UPDATE "tb_users"
      SET "role_tmp" = CASE
        WHEN "role" IN ('admin', '2') THEN 2
        WHEN "role" IN ('default', '1') THEN 1
        ELSE 1
      END
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      DROP COLUMN "role"
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      RENAME COLUMN "role_tmp" TO "role"
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      ALTER COLUMN "role" SET DEFAULT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const result = (await queryRunner.query(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tb_users'
        AND column_name = 'role'
    `)) as Array<{ data_type: string }>;

    const roleColumnType = result[0]?.data_type;

    if (!roleColumnType) {
      return;
    }

    if (roleColumnType === 'character varying' || roleColumnType === 'text') {
      await queryRunner.query(`
        ALTER TABLE "tb_users"
        ALTER COLUMN "role" SET DEFAULT 'default'
      `);

      return;
    }

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      ADD COLUMN "role_tmp" character varying NOT NULL DEFAULT 'default'
    `);

    await queryRunner.query(`
      UPDATE "tb_users"
      SET "role_tmp" = CASE
        WHEN "role" = 2 THEN 'admin'
        ELSE 'default'
      END
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      DROP COLUMN "role"
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      RENAME COLUMN "role_tmp" TO "role"
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_users"
      ALTER COLUMN "role" SET DEFAULT 'default'
    `);
  }
}

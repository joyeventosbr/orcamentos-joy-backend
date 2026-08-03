import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV014UserRoleDescription1778970000000
  implements MigrationInterface
{
  name = "MigrationV014UserRoleDescription1778970000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_users'
            AND column_name = 'funcao'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_users'
            AND column_name = 'role_description'
        ) THEN
          ALTER TABLE "tb_users"
          RENAME COLUMN "funcao" TO "role_description";
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_users'
            AND column_name = 'role_description'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'tb_users'
            AND column_name = 'funcao'
        ) THEN
          ALTER TABLE "tb_users"
          RENAME COLUMN "role_description" TO "funcao";
        END IF;
      END $$;
    `);
  }
}

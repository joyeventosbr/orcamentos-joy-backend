import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0081776911883942 implements MigrationInterface {
    name = 'MigrationV0081776911883942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" RENAME COLUMN "updated_at" TO "error"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "error"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "error" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "error"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "error" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" RENAME COLUMN "error" TO "updated_at"`);
    }

}

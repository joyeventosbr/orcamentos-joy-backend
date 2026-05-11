import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0071776909224031 implements MigrationInterface {
    name = 'MigrationV0071776909224031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_users" ADD "cd_empresa" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_users" DROP COLUMN "cd_empresa"`);
    }

}

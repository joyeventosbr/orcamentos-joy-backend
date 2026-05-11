import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0091777312185077 implements MigrationInterface {
    name = 'MigrationV0091777312185077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "response" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "response"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0061776887671805 implements MigrationInterface {
    name = 'MigrationV0061776887671805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "beneficiary"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "beneficiary" character varying NOT NULL`);
    }

}

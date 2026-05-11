import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0021776181365219 implements MigrationInterface {
    name = 'MigrationV0021776181365219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "updated_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "updatedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tb_integrations" ADD "createdAt" TIMESTAMP NOT NULL`);
    }

}

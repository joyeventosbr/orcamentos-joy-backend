import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0011775576538999 implements MigrationInterface {
    name = 'MigrationV0011775576538999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "beneficiary" character varying NOT NULL, "status" integer NOT NULL, "payload" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "description" character varying, CONSTRAINT "PK_81efebed0aa6d58845637bb5352" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tb_integrations"`);
    }

}

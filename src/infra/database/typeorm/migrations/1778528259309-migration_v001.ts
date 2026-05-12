import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0011778528259309 implements MigrationInterface {
    name = 'MigrationV0011778528259309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL, "cd_cliente" character varying, "updated_at" TIMESTAMP, CONSTRAINT "UQ_142ce3112f446974f1c96a5d3ff" UNIQUE ("email"), CONSTRAINT "PK_a2c23e0679749c22ffa6c2be910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, CONSTRAINT "PK_edb1512762c7bc2e16aa57d588d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, CONSTRAINT "PK_76ea32aacaec2ebd650509d307a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_budgets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client" character varying NOT NULL, "job" character varying NOT NULL, "deadline" character varying NOT NULL, "location" character varying NOT NULL, "folder_date" character varying NOT NULL, "participants" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP, CONSTRAINT "PK_d06d41390f17faa1ed047e92896" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_budget_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_7ab2f6419c7a8281a911f09d525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_budget_line_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "budget_id" uuid NOT NULL, "category_id" uuid NOT NULL, "parent_id" uuid, "order" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "billing_type" character varying NOT NULL, "quantity" double precision NOT NULL, "daily_rates" double precision NOT NULL, "unit_value" double precision NOT NULL, "total_value" double precision NOT NULL, "upfront_payment" double precision NOT NULL, "installment_30_days" double precision NOT NULL, "installment_45_days" double precision NOT NULL, "installment_60_days" double precision NOT NULL, "installment_90_days" double precision NOT NULL, "installment_120_days" double precision NOT NULL, "billing_unit_value" double precision NOT NULL, "billing_total_value" double precision NOT NULL, CONSTRAINT "PK_3e6e14dec0018aba832eeec40e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_customers_folders" ("customer_id" uuid NOT NULL, "folder_id" uuid NOT NULL, CONSTRAINT "PK_e0c22799554b2f4b52cbed8ad07" PRIMARY KEY ("customer_id", "folder_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tb_customers_folders_folder_id" ON "tb_customers_folders" ("folder_id") `);
        await queryRunner.query(`CREATE TABLE "tb_folders_budgets" ("folder_id" uuid NOT NULL, "budget_id" uuid NOT NULL, CONSTRAINT "PK_5ad759ab7079d42aba1bb130845" PRIMARY KEY ("folder_id", "budget_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tb_folders_budgets_budget_id" ON "tb_folders_budgets" ("budget_id") `);
        await queryRunner.query(`CREATE TABLE "tb_budgets_categories" ("budget_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_42f567ea7db73e7ba75d2a231f8" PRIMARY KEY ("budget_id", "category_id"))`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" ADD CONSTRAINT "FK_1c385d13fa74d0875a1653c0794" FOREIGN KEY ("budget_id") REFERENCES "tb_budgets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" ADD CONSTRAINT "FK_f35d88c3467fd7a1478ced1ff85" FOREIGN KEY ("category_id") REFERENCES "tb_budget_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" ADD CONSTRAINT "FK_3e9f8fa934096c95bf4bed23322" FOREIGN KEY ("parent_id") REFERENCES "tb_budget_line_items"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_customers_folders" ADD CONSTRAINT "FK_e9c0465ed581318c51e743c6c9c" FOREIGN KEY ("customer_id") REFERENCES "tb_customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_customers_folders" ADD CONSTRAINT "FK_25a3ac716dda1e8971d6a970db4" FOREIGN KEY ("folder_id") REFERENCES "tb_folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_folders_budgets" ADD CONSTRAINT "FK_0aaa0a58ff868870ea850748b84" FOREIGN KEY ("folder_id") REFERENCES "tb_folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_folders_budgets" ADD CONSTRAINT "FK_74b3e2e1ff50d930c6a5fb4d05a" FOREIGN KEY ("budget_id") REFERENCES "tb_budgets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_budgets_categories" ADD CONSTRAINT "FK_e016aa5631ba49809247a394e51" FOREIGN KEY ("budget_id") REFERENCES "tb_budgets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tb_budgets_categories" ADD CONSTRAINT "FK_5e927140bff878ed10045c6a435" FOREIGN KEY ("category_id") REFERENCES "tb_budget_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_budgets_categories" DROP CONSTRAINT "FK_5e927140bff878ed10045c6a435"`);
        await queryRunner.query(`ALTER TABLE "tb_budgets_categories" DROP CONSTRAINT "FK_e016aa5631ba49809247a394e51"`);
        await queryRunner.query(`ALTER TABLE "tb_folders_budgets" DROP CONSTRAINT "FK_74b3e2e1ff50d930c6a5fb4d05a"`);
        await queryRunner.query(`ALTER TABLE "tb_folders_budgets" DROP CONSTRAINT "FK_0aaa0a58ff868870ea850748b84"`);
        await queryRunner.query(`ALTER TABLE "tb_customers_folders" DROP CONSTRAINT "FK_25a3ac716dda1e8971d6a970db4"`);
        await queryRunner.query(`ALTER TABLE "tb_customers_folders" DROP CONSTRAINT "FK_e9c0465ed581318c51e743c6c9c"`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" DROP CONSTRAINT "FK_3e9f8fa934096c95bf4bed23322"`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" DROP CONSTRAINT "FK_f35d88c3467fd7a1478ced1ff85"`);
        await queryRunner.query(`ALTER TABLE "tb_budget_line_items" DROP CONSTRAINT "FK_1c385d13fa74d0875a1653c0794"`);
        await queryRunner.query(`DROP TABLE "tb_budgets_categories"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_tb_folders_budgets_budget_id"`);
        await queryRunner.query(`DROP TABLE "tb_folders_budgets"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_tb_customers_folders_folder_id"`);
        await queryRunner.query(`DROP TABLE "tb_customers_folders"`);
        await queryRunner.query(`DROP TABLE "tb_budget_line_items"`);
        await queryRunner.query(`DROP TABLE "tb_budget_categories"`);
        await queryRunner.query(`DROP TABLE "tb_budgets"`);
        await queryRunner.query(`DROP TABLE "tb_folders"`);
        await queryRunner.query(`DROP TABLE "tb_customers"`);
        await queryRunner.query(`DROP TABLE "tb_users"`);
    }

}

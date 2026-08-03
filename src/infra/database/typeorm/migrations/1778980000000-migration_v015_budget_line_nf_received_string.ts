import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV015BudgetLineNfReceivedString1778980000000
  implements MigrationInterface
{
  name = "MigrationV015BudgetLineNfReceivedString1778980000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" TYPE varchar
      USING CASE
        WHEN "nf_received" IS NULL THEN NULL
        WHEN "nf_received" = true THEN 'true'
        ELSE 'false'
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" TYPE boolean
      USING CASE
        WHEN "nf_received" IS NULL THEN false
        WHEN lower("nf_received") = 'true' THEN true
        ELSE false
      END
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" SET DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "tb_budget_lines"
      ALTER COLUMN "nf_received" SET NOT NULL
    `);
  }
}

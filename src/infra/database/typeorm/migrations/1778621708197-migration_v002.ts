import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV0021778621708197 implements MigrationInterface {
  name = "MigrationV0021778621708197";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO public.tb_categories ("name", code, "order")
            VALUES
            ('Local | Hotel | Sala', '1.1', 1),
            ('A&B', '1.2', 2),
            ('Técnica', '1.3', 3),
            ('Cenografia', '1.4', 4),
            ('Material Gráfico | Promocional', '1.5', 5),
            ('Conteúdo', '1.6', 6),
            ('Atração', '1.7', 7),
            ('Equipe de apoio', '1.8', 8),
            ('Logística', '1.9', 9),
            ('Taxas e licenças', '1.10', 10),
            ('Diversos', '1.11', 11),
            ('Extras', '1.12', 12),
            ('Serviços internos (NF Joy Eventos)', '2.1', 13);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from public.tb_categories`);
  }
}

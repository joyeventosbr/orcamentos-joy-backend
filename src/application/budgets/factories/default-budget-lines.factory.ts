import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { Result } from "@shared/result";

type DefaultLineTemplate = {
  categoryCode: string;
  name: string;
  description?: string;
  billingType?: BillingType;
};

export class DefaultBudgetLinesFactory {
  private static resolveName(name: string, description: string): { name: string; description: string } {
    const trimmedName = name.trim();
    if (trimmedName) {
      return { name: trimmedName, description: description.trim() };
    }

    return { name: "Item", description: description.trim() };
  }

  private static buildTemplates(): DefaultLineTemplate[] {
    const templates: DefaultLineTemplate[] = [];
    const add = (categoryCode: string, name: string, description = "", billingType?: BillingType) => {
      templates.push({ categoryCode, name, description, billingType });
    };

    // 1.1 - Local | Hotel | Sala
    add("1.1", "Hospedagem", "Single");
    add("1.1", "Hospedagem", "Double");
    add("1.1", "Hospedagem", "Staff");
    add("1.1", "Locação Sala", "Evento");
    add("1.1", "Locação Sala", "Montagem");
    add("1.1", "Locação de sala de apoio");
    add("1.1", "Camarim");
    add("1.1", "");
    add("1.1", "");
    add("1.1", "");
    add("1.1", "");
    add("1.1", "");

    // 1.2 - A&B
    add("1.2", "Café da Manhã", "Convidados");
    add("1.2", "Café da Manhã", "Staff");
    add("1.2", "Welcome Coffee");
    add("1.2", "Coffee Break");
    add("1.2", "Coquetel", "Pacote alimentação");
    add("1.2", "Coquetel", "Pacote bebidas");
    add("1.2", "Almoço", "Pacote alimentação");
    add("1.2", "Almoço", "Pacote bebidas");
    add("1.2", "Almoço", "Staff - considerar todos os staffs envolvidos");
    add("1.2", "Jantar", "Pacote alimentação");
    add("1.2", "Jantar", "Pacote bebidas");
    add("1.2", "Jantar", "Staff - considerar todos os staffs envolvidos");
    add("1.2", "Happy Hour", "Pacote alimentação - duração");
    add("1.2", "Happy Hour", "Pacote bebidas - duração");
    add("1.2", "Festa", "Pacote alimentação - duração");
    add("1.2", "Festa", "Pacote bebidas - duração");
    add("1.2", "Camarim");
    add("1.2", "Degustação");
    add("1.2", "");
    add("1.2", "");

    // 1.3 - Técnica
    add("1.3", "Projeção");
    add("1.3", "Projeção");
    add("1.3", "Projeção", "Retorno - sempre 01 tela 42 + 2 notes");
    add("1.3", "Sonorização");
    add("1.3", "Sonorização");
    add("1.3", "Iluminação");
    add("1.3", "Iluminação");
    add("1.3", "ART");
    add("1.3", "Sala de apoio", "Impressora");
    add("1.3", "Clearcom");
    add("1.3", "Rider banda");
    add(
      "1.3",
      "Gerador",
      "02 geradores em paralelo, 100m de cabo, 01 intermediária (DE ACORDO COM A POSSIBILIDADE DO CLIENTE) Verificar qt de kva's e metragem cabo",
    );
    add("1.3", "Cabine de tradução", "xxx fones");
    add("1.3", "Transmissão simultânea");
    add("1.3", "TP");
    add("1.3", "Internet", "Evento");
    add("1.3", "Internet", "House");
    add("1.3", "Internet", "Sala de apoio");
    add("1.3", "Captação de Transmissão");
    add("1.3", "Streaming", "Transmissão - qtde pax");
    add("1.3", "Streaming", "LP");

    // 1.4 - Cenografia
    add("1.4", "Receptivo");
    add("1.4", "Receptivo");
    add("1.4", "Receptivo");
    add("1.4", "Plenária");
    add("1.4", "Plenária");
    add("1.4", "Plenária");
    add("1.4", "Festa");
    add("1.4", "Festa");
    add("1.4", "Festa");
    add("1.4", "Jantar");
    add("1.4", "Jantar");
    add("1.4", "Jantar");
    add("1.4", "Equipe e Logística de Cenografia");
    add("1.4", "Mobiliário");
    add("1.4", "Paisagismo | Dec Floral");

    // 1.5 - Material Gráfico | Promocional
    add("1.5", "Convite impresso");
    add("1.5", "Crachá", "Corpo");
    add("1.5", "Crachá", "Cordão");
    add("1.5", "Welcome Kit", "Caderno");
    add("1.5", "Welcome Kit", "Caneta");
    add("1.5", "Welcome Kit", "Camiseta");
    add("1.5", "Welcome Kit", "Sacochila");
    add("1.5", "Gift Out", "Brinde");
    add("1.5", "Gift Out", "Embalagem");
    add("1.5", "Manuseio", "Manuseio de gift/ welcome Kit");

    // 1.6 - Conteúdo
    add("1.6", "Palestrante");
    add("1.6", "Mediador");
    add("1.6", "Vídeo");
    add("1.6", "Vinheta");
    add("1.6", "Site");

    // 1.7 - Atração
    add("1.7", "Banda");
    add("1.7", "Totem de fotos");
    add("1.7", "Maquiagem artística");
    add("1.7", "DJ");

    // 1.8 - Equipe de apoio
    add("1.8", "Mestre de Cerimônias");
    add("1.8", "Tradutor");
    add("1.8", "Promotor");
    add("1.8", "Uniforme Promotor");
    add("1.8", "Carregadores");
    add("1.8", "Fotógrafo");
    add("1.8", "Captação de vídeo");
    add("1.8", "Bombeiro");
    add("1.8", "Ambulância");
    add("1.8", "Limpeza");
    add("1.8", "Segurança");
    add("1.8", "Credenciamento");
    add("1.8", "Valet");
    add("1.8", "RSVP", "Atendimento por 30 dias");
    add("1.8", "Disparo e-mail MKT");
    add("1.8", "Gerenciamento de Uploads", "Qdo possuir upload de arquivos, landing page simples");

    // 1.9 - Logística
    add("1.9", "Transfer terrestre");
    add("1.9", "Transfer palestrante");
    add("1.9", "Transfer Aéreo");

    // 1.10 - Taxas e licenças
    add("1.10", "ECAD");
    add("1.10", "Liberação prefeitura");
    add("1.10", "Liberação CET");
    add("1.10", "Seguro de responsabilidade civil");

    // 1.11 - Diversos
    add("1.11", "");
    add("1.11", "");
    add("1.11", "");

    // 1.12 - Extras
    add("1.12", "");
    add("1.12", "");
    add("1.12", "");

    // 2.1 - Serviços internos | Nota fiscal Joy Eventos
    add("2.1", "Verba de produção");
    add("2.1", "Rádios HT");
    add("2.1", "Clear com");
    add("2.1", "Logística equipe", "Transporte equipe, evento e material evento");
    add("2.1", "Visita Técnica", "aéreo, terrestre, hospedagem");
    add("2.1", "Produtor Executivo");
    add("2.1", "Produtor", "Montagem e desmontagem");
    add("2.1", "Produtor", "Evento");
    add("2.1", "Produtor Financeiro", "orçamentos acima de 800k");
    add("2.1", "Diretor técnico");
    add("2.1", "Diretor artístico");
    add("2.1", "Diretor artístico online", "qdo evento é híbrido");
    add("2.1", "Roteiro MC", "Considerar dias de evento - R$ 4.500,00/ dia");
    add("2.1", "Conteúdo Site");
    add("2.1", "Curadoria Site", "de acordo com cada assunto - avaliar a cada projeto");
    add("2.1", "Projeto Técnico Cenográfico", "valor Ademir");
    add("2.1", "Eletricista", "avaliar necessidades ceno/técnica");
    add("2.1", "Pacote Criação", "KV");
    add("2.1", "Pacote Criação", "Save");
    add("2.1", "Pacote Criação", "Convite");
    add("2.1", "Pacote Criação", "Reminder");
    add("2.1", "Pacote Criação", "Crachá");
    add("2.1", "Pacote Criação", "Cordão crachá");
    add("2.1", "Pacote Criação", "Pacote cenográfico");
    add("2.1", "Pacote Criação", "Site");
    add("2.1", "");
    add("2.1", "");
    add("2.1", "");
    add("2.1", "");
    add("2.1", "");

    return templates;
  }

  static create(budgetId: string): Result<BudgetLine[]> {
    const lines: BudgetLine[] = [];
    let order = 0;

    for (const template of this.buildTemplates()) {
      order += 1;
      const { name, description } = this.resolveName(template.name, template.description ?? "");

      const lineResult = BudgetLine.create({
        budgetId,
        categoryCode: template.categoryCode,
        order,
        name,
        description,
        billingType: template.billingType,
        quantity: 0,
        dailyRates: 0,
        unitValue: 0,
        totalValue: 0,
        upfrontPayment: 0,
        installment30Days: 0,
        installment45Days: 0,
        installment60Days: 0,
        installment90Days: 0,
        installment120Days: 0,
        billingUnitValue: 0,
        billingTotalValue: 0,
      });

      if (lineResult.isFailure()) {
        return Result.failure(lineResult.getError());
      }

      lines.push(lineResult.getValue());
    }

    return Result.success(lines);
  }
}

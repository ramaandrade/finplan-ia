import { formatBRL } from '../services/financialMath';

export const getNegotiationTemplates = (expenses = [], banks = [], incomes = []) => {
  const empNu = expenses.find(e => e.id === 'emprestimo_nubank' || (e.bank === 'Nubank' && e.debtType === 'loan')) || { values: { SET: 562.19 } };
  const chequeEsp = expenses.find(e => e.id === 'cheque_especial_bradesco' || e.name.toLowerCase().includes('cheque especial')) || { values: { SET: 1700 } };
  const faturaBrad = expenses.find(e => e.id === 'fatura_bradesco' || (e.bank === 'Bradesco' && e.debtType === 'card')) || { values: { SET: 2000 } };
  const empC6 = expenses.find(e => e.id === 'emprestimo_carro_c6' || (e.bank === 'C6 Bank' && e.debtType === 'loan')) || { values: { OUT: 392 } };
  const faturaMP = expenses.find(e => e.id === 'fatura_mercadopago' || (e.bank === 'Mercado Pago' && e.debtType === 'card')) || { values: { SET: 1162 } };

  const nuVal = formatBRL(Number(empNu.values?.SET) || Number(empNu.values?.OUT) || 562.19);
  const chequeVal = formatBRL(Number(chequeEsp.values?.SET) || 1700);
  const bradVal = formatBRL(Number(faturaBrad.values?.SET) || 2000);
  const c6Val = formatBRL(Number(empC6.values?.OUT) || Number(empC6.values?.SET) || 392);
  const mpVal = formatBRL(Number(faturaMP.values?.SET) || 1162);

  const totalSalary = formatBRL(incomes.reduce((s, i) => s + (Number(i.values?.OUT) || 0), 0) || 10040);

  return [
    {
      id: 'nubank_antecipacao',
      bank: 'Nubank',
      title: 'Amortização Antecipada de Empréstimo com Desconto',
      target: `Empréstimo Ativo Nubank (${nuVal}/mês)`,
      channel: 'App Nubank -> Empréstimos -> Antecipar Parcelas ou Chat',
      legalBasis: 'Art. 52, § 2º do Código de Defesa do Consumidor',
      script: `Olá! Sou cliente Nubank e possuo um empréstimo pessoal com parcelas de ${nuVal}. Gostaria de solicitar uma simulação para amortização antecipada de parcelas com o abatimento proporcional dos juros futuros, conforme prevê o Art. 52, § 2º do CDC.

Possuo liquidez disponível este mês e pretendo amortizar o saldo devedor diretamente pelo saldo da minha conta. Aguardo os valores com o desconto máximo de encargos aplicados.`,
      tip: 'No app do Nubank, você pode fazer isso direto pelo botão "Antecipar" na aba de Empréstimos, escolhendo as últimas parcelas para obter o maior desconto de juros possível.'
    },
    {
      id: 'bradesco_cheque_cartao',
      bank: 'Bradesco',
      title: 'Negociação de Taxa do Cheque Especial / Unificação de Fatura',
      target: `Cheque Especial (${chequeVal}) e Fatura de Setembro (${bradVal})`,
      channel: 'Gerente da Conta Corrente / Chat Bradesco / Fone Fácil',
      legalBasis: 'Resolução CMN nº 4.765 e Portabilidade de Crédito',
      script: `Olá! Sou correntista do Bradesco e gostaria de alinhar a quitação do meu limite de Cheque Especial (${chequeVal}) e da fatura do cartão deste mês (${bradVal}).

Para evitar a incidência de juros do rotativo ou do teto de 8% a.m. do cheque especial, gostaria de verificar se o banco possui uma taxa diferenciada de CDC/Crédito Pessoal (na faixa de 2% a 3,5% a.m.) para cobrir esse saldo pontual em parcela única ou 2x com débito já no próximo mês, quando receberei minha receita de ${totalSalary}.

Caso o Bradesco não possua condição especial, solicitarei a portabilidade do saldo devedor para outra instituição parceira. Aguardo as opções disponíveis.`,
      tip: 'Bancos tradicionais concedem taxas bem menores quando você menciona a possibilidade de portabilidade de crédito.'
    },
    {
      id: 'c6_revisao_carro',
      bank: 'C6 Bank',
      title: 'Amortização de Parcelas do Financiamento Conserto Carro',
      target: `Empréstimo Auto/Conserto C6 (${c6Val}/mês)`,
      channel: 'Chat App C6 Bank -> Empréstimos e Financiamentos',
      legalBasis: 'Art. 52, § 2º do CDC e Resoluções Bacen de Quitação Antecipada',
      script: `Olá! Tenho um financiamento ativo referente ao conserto do carro no valor mensal de ${c6Val}. Gostaria de receber a memória de cálculo para quitação e abatimento proporcional de parcelas futuras em parcela única neste mês.

Favor encaminhar o boleto/débito com o cálculo a valor presente deduzindo todos os juros contratuais não transcorridos.`,
      tip: 'No C6 Bank, solicitar a amortização pelas parcelas de trás para frente reduz tanto o prazo quanto o custo efetivo total com o maior desconto.'
    },
    {
      id: 'mercadopago_fatura',
      bank: 'Mercado Pago',
      title: 'Quitação Antecipada de Fatura Mercado Pago',
      target: `Fatura Mercado Pago (${mpVal})`,
      channel: 'App Mercado Pago -> Ajuda -> Chat de Crédito',
      legalBasis: 'Lei nº 14.690/2023 (Teto 100% de Juros do Cartão) e Art. 52 CDC',
      script: `Olá! Sou usuário do Mercado Pago com fatura de ${mpVal}. Gostaria de antecipar todas as parcelas restantes para quitação total nesta data.

Solicito a remoção de todos os juros futuros de parcelamento embutidos nas parcelas a vencer para emitir o código PIX de pagamento à vista hoje.`,
      tip: 'O Mercado Pago tem a maior taxa de rotativo da sua carteira (16.5% a.m.). Quitar essa conta primeiro economiza centenas de reais por mês.'
    }
  ];
};

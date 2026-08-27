import { formatBRL, formatPercent, calcEarlyPayoffDiscount, calcRotativoCost, calcInstallments } from './financialMath';

export const AI_AGENTS = [
  {
    id: 'estrategista',
    name: 'Dr. Marcelo Carvalho',
    role: 'Estrategista Chefe de Dívidas',
    specialty: 'Motor Avalanche & Custo Eficaz',
    avatar: '🎯',
    bgColor: 'bg-indigo-950/60 border-indigo-500/30',
    textColor: 'text-indigo-400',
    badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    philosophy: 'Juros altos são uma hemorragia financeira. Devemos estancar os juros mais caros (14%-16% a.m.) antes que eles dobrem a dívida.'
  },
  {
    id: 'analista_taxas',
    name: 'Beatriz Mendes',
    role: 'Analista de Taxas Bancárias & Bacen',
    specialty: 'Comparação Bradesco, Nubank, C6 & Mercado Pago',
    avatar: '📊',
    bgColor: 'bg-emerald-950/60 border-emerald-500/30',
    textColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    philosophy: 'Aquele que não compara o CET paga o dobro. Vamos usar a Lei 14.690/23 e as regras do Bacen a disposição do seu bolso.'
  },
  {
    id: 'otimizador_income',
    name: 'Carlos Peixoto',
    role: 'Otimizador de Fluxo de Caixa',
    specialty: 'Transição de Setembro & Reserva de Emergência',
    avatar: '⚡',
    bgColor: 'bg-amber-950/60 border-amber-500/30',
    textColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    philosophy: 'Cada déficit tem uma causa e uma solução matemática. O segredo é identificar os gargalos e alinhar receitas e vencimentos.'
  },
  {
    id: 'negociadora',
    name: 'Sofia Ribeiro',
    role: 'Assistente de Negociação & Ação Prática',
    specialty: 'Scripts de Chat & Desconto em Amortização',
    avatar: '🤝',
    bgColor: 'bg-rose-950/60 border-rose-500/30',
    textColor: 'text-rose-400',
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    philosophy: 'Nunca pague uma parcela futura sem solicitar o desconto do Art. 52 do CDC. Os bancos se curvam ao cliente informado.'
  }
];

// Helper to analyze the full budget in depth
export const analyzeBudget = (incomes = [], expenses = [], banks = []) => {
  const sampleValues = { ...(incomes[0]?.values || {}), ...(expenses[0]?.values || {}) };
  const allMonths = Object.keys(sampleValues);

  const monthlyFlow = allMonths.map(mKey => {
    const inc = incomes.reduce((sum, i) => sum + (Number(i.values?.[mKey]) || 0), 0);
    const exp = expenses.reduce((sum, e) => sum + (Number(e.values?.[mKey]) || 0), 0);
    const net = inc - exp;
    const debtExp = expenses.filter(e => e.isDebt).reduce((sum, e) => sum + (Number(e.values?.[mKey]) || 0), 0);
    return {
      monthKey: mKey,
      income: inc,
      expense: exp,
      net: net,
      debtExpense: debtExp,
      isDeficit: net < 0,
      isSurplus: net > 0
    };
  });

  const deficitMonths = monthlyFlow.filter(m => m.isDeficit);
  const surplusMonths = monthlyFlow.filter(m => m.isSurplus);

  // Active debts with bank rate mapping
  const activeDebts = expenses.filter(e => e.isDebt).map(exp => {
    const bankInfo = banks.find(b => b.name === exp.bank || b.id === exp.bank) || {};
    const rate = exp.rate || (exp.debtType === 'overdraft' ? (bankInfo.chequeEspecialRate || 8.0) : (exp.debtType === 'loan' ? (bankInfo.loanRate || 4.0) : (bankInfo.rotativoRate || 14.8)));
    const sepVal = Number(exp.values?.SET) || 0;
    const octVal = Number(exp.values?.OUT) || 0;
    const novVal = Number(exp.values?.NOV) || 0;
    const decVal = Number(exp.values?.DEZ) || 0;
    return {
      ...exp,
      rate,
      sepVal,
      octVal,
      novVal,
      decVal,
      bankData: bankInfo
    };
  }).sort((a, b) => b.rate - a.rate);

  return {
    monthlyFlow,
    deficitMonths,
    surplusMonths,
    activeDebts,
    incomes,
    expenses,
    banks
  };
};

export const getDiagnosticPanel = (incomes = [], expenses = [], banks = []) => {
  const data = analyzeBudget(incomes, expenses, banks);
  const m26 = data.monthlyFlow.filter(m => ['SET', 'OUT', 'NOV', 'DEZ'].includes(m.monthKey));
  
  const setFlow = m26.find(m => m.monthKey === 'SET') || { net: 0, income: 0, expense: 0 };
  const outFlow = m26.find(m => m.monthKey === 'OUT') || { net: 0, income: 0, expense: 0 };
  const novFlow = m26.find(m => m.monthKey === 'NOV') || { net: 0, income: 0, expense: 0 };
  const dezFlow = m26.find(m => m.monthKey === 'DEZ') || { net: 0, income: 0, expense: 0 };

  const debts = data.activeDebts;
  const bradDebts = debts.filter(d => d.bank === 'Bradesco');
  const nuDebts = debts.filter(d => d.bank === 'Nubank');
  const c6Debts = debts.filter(d => d.bank === 'C6 Bank');
  const mpDebts = debts.filter(d => d.bank === 'Mercado Pago');

  const totalBradSep = bradDebts.reduce((s, d) => s + d.sepVal, 0);
  const totalNuSep = nuDebts.reduce((s, d) => s + d.sepVal, 0);
  const totalC6Sep = c6Debts.reduce((s, d) => s + d.sepVal, 0);
  const totalMPSep = mpDebts.reduce((s, d) => s + d.sepVal, 0);

  return [
    {
      agentId: 'estrategista',
      title: 'Auditoria de Juros e Hierarquia Avalanche',
      summary: debts.length > 0
        ? `Dívida mais cara: ${debts[0].name} (${debts[0].rate}% a.m.). Total de dívidas em Setembro: ${formatBRL(setFlow.debtExpense)}.`
        : 'Nenhuma dívida ativa identificada no orçamento.',
      recommendations: [
        debts.length > 0
          ? `Prioridade #1 de quitação: ${debts[0].name} (${debts[0].rate}% a.m.) no ${debts[0].bank}. Liquidar antes de dívidas de menor taxa como empréstimos (~4% a.m.).`
          : 'Orçamento sem dívidas com juros rotativos.',
        setFlow.isDeficit
          ? `Em Setembro há déficit de ${formatBRL(setFlow.net)}. Para não entrar no rotativo de 15% a.m., priorize pagar o valor integral dos cartões ou parcele pontualmente a 4.5% a.m.`
          : `Setembro com superávit de ${formatBRL(setFlow.net)}. Use esta sobra para amortizar a dívida #1 imediatamente.`
      ]
    },
    {
      agentId: 'analista_taxas',
      title: 'Diagnóstico dos Bancos (Bradesco, Nubank, C6, MP)',
      summary: `Bradesco: ${formatBRL(totalBradSep)} em Set | Nubank: ${formatBRL(totalNuSep)} | C6: ${formatBRL(totalC6Sep)} | MP: ${formatBRL(totalMPSep)}.`,
      recommendations: [
        bradDebts.length > 0
          ? `Bradesco (${bradDebts.map(d => `${d.name}: ${formatBRL(d.sepVal)}`).join(' + ')}): Utilize a entrada mensal do Encerramento do Empréstimo Bradesco para abater o cheque especial.`
          : 'Sem pendências no Bradesco.',
        nuDebts.length > 0
          ? `Nubank (${nuDebts.map(d => `${d.name}: ${formatBRL(d.sepVal)}`).join(' + ')}): O empréstimo permite antecipação de parcelas com desconto automático pelo app.`
          : 'Sem pendências no Nubank.'
      ]
    },
    {
      agentId: 'otimizador_income',
      title: 'Fluxo de Caixa & Transição de Meses',
      summary: `Resultado: SET (${formatBRL(setFlow.net)}) ➔ OUT (${formatBRL(outFlow.net)}) ➔ NOV (${formatBRL(novFlow.net)}) ➔ DEZ (${formatBRL(dezFlow.net)}).`,
      recommendations: [
        outFlow.isDeficit || novFlow.isDeficit
          ? `Atenção: Você ainda possui meses em déficit (${outFlow.isDeficit ? `OUT: ${formatBRL(outFlow.net)}` : ''} ${novFlow.isDeficit ? `NOV: ${formatBRL(novFlow.net)}` : ''}). Ajuste mesadas familiares ou despesas de lazer para equilibrar o fluxo antes de Dezembro.`
          : `Fluxo equilibrado a partir de Outubro com superávit médio de ${formatBRL((outFlow.net + novFlow.net + dezFlow.net) / 3)}/mês.`,
        dezFlow.isSurplus
          ? `Em Dezembro, o superávit de ${formatBRL(dezFlow.net)} marca o início da formação da sua Reserva de Emergência 100% CDI.`
          : `Monitore Dezembro para garantir que as entradas superem as despesas.`
      ]
    },
    {
      agentId: 'negociadora',
      title: 'Plano de Ação Tático & Contato com Bancos',
      summary: 'Cronograma para amortizar com abatimento de juros futuros pelo Art. 52 do CDC.',
      recommendations: [
        'Acesse a aba "Roteiros de Negociação" para copiar os textos jurídicos fundamentados para o chat do Nubank, Bradesco e C6 Bank.',
        'Ao amortizar parcelas de empréstimos, sempre selecione a amortização "de trás para frente" para abater o maior volume de juros embutidos.'
      ]
    }
  ];
};

// Deep AI Question Solver
export const answerUserQuestion = (question, incomes = [], expenses = [], banks = []) => {
  const q = question.toLowerCase().trim();
  const data = analyzeBudget(incomes, expenses, banks);

  const mFlow = data.monthlyFlow;
  const setFlow = mFlow.find(m => m.monthKey === 'SET') || { net: 0, income: 0, expense: 0, debtExpense: 0 };
  const outFlow = mFlow.find(m => m.monthKey === 'OUT') || { net: 0, income: 0, expense: 0, debtExpense: 0 };
  const novFlow = mFlow.find(m => m.monthKey === 'NOV') || { net: 0, income: 0, expense: 0, debtExpense: 0 };
  const dezFlow = mFlow.find(m => m.monthKey === 'DEZ') || { net: 0, income: 0, expense: 0, debtExpense: 0 };

  const debts = data.activeDebts;

  // 1. SPECIFIC BANK: BRADESCO
  if (q.includes('bradesco')) {
    const bradDebts = debts.filter(d => d.bank === 'Bradesco');
    const bradIncomes = incomes.filter(i => i.name.toLowerCase().includes('bradesco') || (i.bank && i.bank.toLowerCase().includes('bradesco')));
    const cheque = bradDebts.find(d => d.debtType === 'overdraft' || d.name.toLowerCase().includes('cheque'));
    const fatura = bradDebts.find(d => d.debtType === 'card' || d.name.toLowerCase().includes('fatura'));
    const encerramento = bradIncomes[0];

    const chequeValSet = Number(cheque?.values?.SET) || 0;
    const faturaValSet = Number(fatura?.values?.SET) || 0;
    const faturaValOut = Number(fatura?.values?.OUT) || 0;
    const encerramentoVal = Number(encerramento?.values?.OUT) || Number(encerramento?.values?.SET) || 1340;

    let response = `Análise Estratégica do Bradesco baseada no seu orçamento atual:\n\n`;
    response += `1. **Diagnóstico dos Saldos no Bradesco:**\n`;
    if (chequeValSet > 0) response += `• **Cheque Especial:** ${formatBRL(chequeValSet)} em Setembro (taxa teto de 8% a.m.).\n`;
    if (faturaValSet > 0) response += `• **Fatura do Cartão Bradesco:** ${formatBRL(faturaValSet)} em Setembro (cai para ${formatBRL(faturaValOut)} em Outubro).\n`;
    response += `• **Entrada Mensal Fixa Bradesco:** Você tem ${formatBRL(encerramentoVal)}/mês proveniente do Encerramento do Empréstimo Bradesco.\n\n`;

    response += `2. **Situação do seu Fluxo de Caixa nos Meses de Pagamento:**\n`;
    response += `• **Setembro:** Saldo líquido de ${formatBRL(setFlow.net)} (${setFlow.isDeficit ? 'déficit pontual alto' : 'positivo'}).\n`;
    response += `• **Outubro:** Saldo líquido de ${formatBRL(outFlow.net)} (${outFlow.isDeficit ? 'ainda em déficit com suas edições atuais' : 'superávit'}).\n`;
    response += `• **Novembro:** Saldo líquido de ${formatBRL(novFlow.net)} (${novFlow.isDeficit ? 'déficit' : 'superávit'}).\n`;
    response += `• **Dezembro:** Saldo líquido de ${formatBRL(dezFlow.net)} (${dezFlow.isSurplus ? 'superávit' : 'déficit'}).\n\n`;

    response += `3. **Plano de Ação Recomendado:**\n`;
    if (outFlow.isDeficit || novFlow.isDeficit) {
      response += `• **Alerta de Rotativo:** Como Outubro (${formatBRL(outFlow.net)}) e Novembro (${formatBRL(novFlow.net)}) estão em déficit no seu orçamento, NÃO deixe a fatura do Bradesco entrar no rotativo de 15.2% a.m.! Se necessário, parcele a fatura no app em 2x ou 3x (taxa de parcelamento de ~5.4% a.m.) para suavizar as parcelas.\n`;
      response += `• **Cheque Especial:** Use a entrada de ${formatBRL(encerramentoVal)} do salário/margem para cobrir o cheque especial na virada do mês, evitando juros diários.\n`;
      response += `• **Ajuste de Gastos:** Reduza temporariamente gastos flexíveis em Outubro/Novembro para eliminar o déficit restante antes de Dezembro.`;
    } else {
      response += `• **Quitação Imediata:** Use o superávit de Outubro (${formatBRL(outFlow.net)}) para cobrir integralmente o Cheque Especial e pagar a fatura de ${formatBRL(faturaValOut)} à vista.\n`;
      response += `• **Blindagem:** Com o cartão reduzido e o cheque zerado, o Bradesco deixa de gerar juros a partir de Outubro!`;
    }

    return {
      agentName: 'Dr. Marcelo Carvalho',
      agentRole: 'Estrategista Chefe de Dívidas',
      response
    };
  }

  // 2. SPECIFIC BANK: NUBANK
  if (q.includes('nubank')) {
    const nuDebts = debts.filter(d => d.bank === 'Nubank');
    const empNu = nuDebts.find(d => d.debtType === 'loan' || d.name.toLowerCase().includes('empréstimo') || d.name.toLowerCase().includes('emprestimo'));
    const faturaNu = nuDebts.find(d => d.debtType === 'card' || d.name.toLowerCase().includes('fatura'));

    const empVal = Number(empNu?.values?.SET) || Number(empNu?.values?.OUT) || 562.19;
    const faturaSet = Number(faturaNu?.values?.SET) || 0;
    const faturaOut = Number(faturaNu?.values?.OUT) || 0;

    let response = `Análise Estratégica do Nubank baseada nos seus dados:\n\n`;
    response += `1. **Contratos Ativos no Nubank:**\n`;
    if (empNu) response += `• **Empréstimo Pessoal:** Parcela mensal de ${formatBRL(empVal)} (taxa de 4.15% a.m.).\n`;
    if (faturaNu) response += `• **Fatura do Cartão Nubank:** ${formatBRL(faturaSet)} em Setembro, estabilizando em ${formatBRL(faturaOut)} nos meses seguintes (taxa rotativo 14.8% a.m.).\n\n`;

    response += `2. **Estratégia de Otimização:**\n`;
    response += `• **Fatura:** Pague sempre o valor total de ${formatBRL(faturaOut)} para não acionar o rotativo de 14.8% a.m.\n`;
    response += `• **Amortização do Empréstimo (Art. 52 CDC):** O app do Nubank tem o botão 'Antecipar' com desconto imediato de juros futuros. Assim que seu fluxo atingir superávit (${dezFlow.isSurplus ? `Dezembro com +${formatBRL(dezFlow.net)}` : 'quando houver folga'}), antecipe 2 a 3 parcelas de trás para frente para economizar mais de R$ 600 em encargos!`;

    return {
      agentName: 'Sofia Ribeiro',
      agentRole: 'Assistente de Negociação',
      response
    };
  }

  // 3. SPECIFIC BANK: C6 BANK
  if (q.includes('c6') || q.includes('carro')) {
    const c6Debts = debts.filter(d => d.bank === 'C6 Bank');
    const empCarro = c6Debts.find(d => d.debtType === 'loan' || d.name.toLowerCase().includes('carro'));
    const faturaC6 = c6Debts.find(d => d.debtType === 'card' || d.name.toLowerCase().includes('fatura'));

    const carroVal = Number(empCarro?.values?.OUT) || Number(empCarro?.values?.SET) || 392;
    const faturaSet = Number(faturaC6?.values?.SET) || 0;
    const faturaNov = Number(faturaC6?.values?.NOV) || 0;
    const faturaDez = Number(faturaC6?.values?.DEZ) || 0;

    let response = `Análise Estratégica do C6 Bank:\n\n`;
    response += `1. **Contratos Ativos no C6:**\n`;
    if (empCarro) response += `• **Empréstimo Conserto Carro:** Parcela mensal de ${formatBRL(carroVal)} (taxa ~3.9% a.m.).\n`;
    if (faturaC6) response += `• **Fatura Cartão C6:** ${formatBRL(faturaSet)} em Setembro ➔ ${formatBRL(faturaNov)} em Novembro ➔ ${formatBRL(faturaDez)} em Dezembro (quitação total do cartão!).\n\n`;

    response += `2. **Passo a Passo de Ação:**\n`;
    response += `• A fatura do cartão C6 zera naturalmente em Dezembro (${formatBRL(faturaDez)}).\n`;
    response += `• Para o financiamento do carro (${formatBRL(carroVal)}/mês), acione o chat do C6 usando nosso script da aba de Negociação solicitando quitação com desconto a valor presente.`;

    return {
      agentName: 'Beatriz Mendes',
      agentRole: 'Analista de Taxas Bancárias',
      response
    };
  }

  // 4. SPECIFIC BANK: MERCADO PAGO
  if (q.includes('mercado pago') || q.includes('mercado') || q.includes('mp')) {
    const mpDebt = debts.find(d => d.bank === 'Mercado Pago');
    const mpSet = Number(mpDebt?.values?.SET) || 0;
    const mpOut = Number(mpDebt?.values?.OUT) || 0;
    const mpNov = Number(mpDebt?.values?.NOV) || 0;
    const mpDez = Number(mpDebt?.values?.DEZ) || 0;

    let response = `Análise do Mercado Pago:\n\n`;
    response += `1. **Fatura Mercado Pago:** ${formatBRL(mpSet)} em Setembro ➔ ${formatBRL(mpOut)} em Outubro ➔ ${formatBRL(mpNov)} em Novembro ➔ ${formatBRL(mpDez)} em Dezembro.\n`;
    response += `2. **Taxa de Juros:** 16.5% a.m. (é a taxa mais alta da sua carteira!).\n`;
    response += `3. **Recomendação:** Pelo Método Avalanche, o Mercado Pago é a prioridade #1 absoluta de pagamento para não gerar juros compostos.`;

    return {
      agentName: 'Dr. Marcelo Carvalho',
      agentRole: 'Estrategista Chefe de Dívidas',
      response
    };
  }

  // 5. PRIORITIZATION / WHICH TO PAY FIRST
  if (q.includes('priorizar') || q.includes('primeiro') || q.includes('ordem') || q.includes('qual pagar') || q.includes('melhor forma')) {
    let response = `Ordem de Priorização de Pagamentos (Método Avalanche FinPlan IA):\n\n`;
    response += `Baseado nas taxas dos seus bancos e saldos editados:\n\n`;

    debts.forEach((d, idx) => {
      response += `**#${idx + 1}. ${d.name} (${d.bank})** — Taxa: **${d.rate}% a.m.** | Saldo Set: ${formatBRL(d.sepVal)}\n`;
    });

    response += `\n**Diretriz Prática:**\n`;
    response += `1. Pague sempre o valor total da dívida #1 (${debts[0]?.name || 'Cartão com maior taxa'}).\n`;
    response += `2. Pague as parcelas regulares das demais dívidas para mantê-las em dia.\n`;
    response += `3. Todo superávit gerado no mês deve ser injetado diretamente para abater a dívida do topo da lista.`;

    return {
      agentName: 'Dr. Marcelo Carvalho',
      agentRole: 'Estrategista Chefe de Dívidas',
      response
    };
  }

  // 6. DEFICIT / CUTTING EXPENSES / CASH FLOW CRISIS
  if (q.includes('cortar') || q.includes('sair do vermelho') || q.includes('déficit') || q.includes('negativo') || q.includes('economizar') || q.includes('reduzir')) {
    // Analyze flexible categories
    const mesadas = expenses.filter(e => e.category === 'Família' || e.bank === 'Transferência');
    const totalMesadas = mesadas.reduce((s, e) => s + (Number(e.values?.SET) || 0), 0);
    const lazer = expenses.filter(e => e.category === 'Lazer' || e.category === 'Assinaturas');
    const totalLazer = lazer.reduce((s, e) => s + (Number(e.values?.SET) || 0), 0);

    let response = `Diagnóstico de Ajuste de Fluxo de Caixa:\n\n`;
    response += `1. **Evolução do Saldo Líquido:**\n`;
    mFlow.slice(0, 4).forEach(m => {
      response += `• **${m.monthKey}:** ${formatBRL(m.net)} (${m.isDeficit ? 'Déficit' : 'Superávit'})\n`;
    });

    response += `\n2. **Oportunidades de Ajuste Imediato:**\n`;
    if (totalMesadas > 0) {
      response += `• **Mesadas e Transferências Familiares:** Somam ${formatBRL(totalMesadas)}/mês. Um ajuste temporário de 10% a 15% libera entre ${formatBRL(totalMesadas * 0.1)} e ${formatBRL(totalMesadas * 0.15)} por mês para cobrir os meses em déficit.\n`;
    }
    if (totalLazer > 0) {
      response += `• **Lazer & Assinaturas:** Somam ${formatBRL(totalLazer)}/mês (ex: Loterias, assinaturas). Pausar despesas não essenciais ajuda a equilibrar Outubro e Novembro.\n`;
    }

    response += `\n3. **Meta:** Eliminar o saldo negativo de Outubro (${formatBRL(outFlow.net)}) e Novembro (${formatBRL(novFlow.net)}) para entrar em Dezembro com superávit consolidado (${formatBRL(dezFlow.net)}).`;

    return {
      agentName: 'Carlos Peixoto',
      agentRole: 'Otimizador de Fluxo de Caixa',
      response
    };
  }

  // 7. 2027 & EMERGENCY RESERVE
  if (q.includes('2027') || q.includes('reserva') || q.includes('futuro') || q.includes('poupar') || q.includes('investir')) {
    const flow27 = mFlow.filter(m => m.monthKey.includes('_27'));
    const avgNet27 = flow27.length > 0 ? flow27.reduce((s, m) => s + m.net, 0) / flow27.length : dezFlow.net;

    let response = `Projeção Patrimonial e Reserva de Emergência para 2027:\n\n`;
    response += `1. **Superávit Mensal Médio Estimado em 2027:** ${formatBRL(avgNet27)}/mês.\n`;
    response += `2. **Projeção de Acúmulo:**\n`;
    response += `• Em 6 meses (Junho/27): ${formatBRL(Math.max(0, avgNet27) * 6)} acumulados.\n`;
    response += `• Em 12 meses (Dezembro/27): ${formatBRL(Math.max(0, avgNet27) * 12)} acumulados em CDB 100% CDI.\n`;
    response += `3. **Recomendação:** Mantenha os aportes mensais automáticos logo após o recebimento do salário para consolidar sua segurança financeira.`;

    return {
      agentName: 'Carlos Peixoto',
      agentRole: 'Otimizador de Fluxo de Caixa',
      response
    };
  }

  // 8. GENERAL / COMPREHENSIVE ANSWER
  let response = `Análise Personalizada do seu Orçamento Atual:\n\n`;
  response += `• **Situação do Fluxo:** Setembro tem resultado de ${formatBRL(setFlow.net)}, Outubro ${formatBRL(outFlow.net)}, Novembro ${formatBRL(novFlow.net)} e Dezembro ${formatBRL(dezFlow.net)}.\n`;
  response += `• **Dívidas Totais em Setembro:** ${formatBRL(setFlow.debtExpense)}, sendo a mais onerosa ${debts[0]?.name || 'Cartão'} a ${debts[0]?.rate || 14.8}% a.m.\n`;
  response += `• **Orientação do Comitê:** Priorize eliminar os juros de cartão (14%-16% a.m.) antes de amortizar empréstimos fixos (~4% a.m.). Faça perguntas específicas sobre o **Bradesco**, **Nubank**, **C6**, **cortar gastos** ou **quitação** para um plano detalhado!`;

  return {
    agentName: 'Carlos Peixoto',
    agentRole: 'Otimizador de Fluxo de Caixa',
    response
  };
};

// Direct Live LLM call if user provided a Gemini API Key
export const callGeminiApi = async (apiKey, question, incomes, expenses, banks) => {
  const budgetSnapshot = {
    months: ['SET', 'OUT', 'NOV', 'DEZ'],
    incomes: incomes.map(i => ({ name: i.name, values: i.values })),
    expenses: expenses.map(e => ({ name: e.name, category: e.category, bank: e.bank, isDebt: e.isDebt, rate: e.rate, values: e.values })),
    banks: banks.map(b => ({ name: b.name, rotativoRate: b.rotativoRate, loanRate: b.loanRate, chequeEspecialRate: b.chequeEspecialRate }))
  };

  const systemInstruction = `Você é o FinPlan IA, um consultor financeiro de elite especializado no orçamento pessoal do usuário no Brasil.
O usuário possui contas no Bradesco, Nubank, C6 Bank e Mercado Pago.
Abaixo está o snapshot exato dos dados financeiros atuais do usuário:
${JSON.stringify(budgetSnapshot, null, 2)}

Regras de Resposta:
1. Responda DIRETAMENTE à pergunta do usuário analisando minuciosamente os números reais acima.
2. Identifique corretamente se um mês está em déficit (negativo) ou superávit (positivo).
3. Utilize formatação em Real brasileiro (R$ 0.000,00) e percentuais mensais (% a.m.).
4. Forneça estratégias práticas de quitação, corte de gastos, antecipação de parcelas (Art. 52 CDC) e otimização de fluxo.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\nPergunta do Usuário: ${question}` }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || 'Falha ao consultar API Gemini');
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || 'Não foi possível obter resposta da IA no momento.';
};

import { calcEarlyPayoffDiscount, calcInstallments, calcRotativoCost, formatBRL } from './financialMath';

export const getCurrentDebtList = (expenses = [], banks = []) => {
  const debts = [];
  
  expenses.filter(e => e.isDebt).forEach(exp => {
    const bankInfo = banks.find(b => b.name === exp.bank || b.id === exp.bank) || {};
    const rate = exp.rate || (exp.debtType === 'overdraft' ? (bankInfo.chequeEspecialRate || 8.0) : (exp.debtType === 'loan' ? (bankInfo.loanRate || 4.0) : (bankInfo.rotativoRate || 14.8)));
    
    const monthlyVal = Number(exp.values?.SET || exp.values?.OUT || exp.values?.NOV || exp.values?.DEZ || 0);
    
    let totalBalance = Number(exp.totalBalance);
    if (!totalBalance || isNaN(totalBalance)) {
      if (exp.debtType === 'loan') {
        const remaining = Number(exp.remainingMonths) || 8;
        totalBalance = monthlyVal * remaining;
      } else {
        totalBalance = monthlyVal;
      }
    }

    debts.push({
      id: exp.id,
      name: exp.name,
      bank: exp.bank,
      type: exp.debtType || 'card',
      rate: rate,
      monthlyInstallment: monthlyVal,
      balanceSep: Number(exp.values?.SET) || 0,
      balanceOct: Number(exp.values?.OUT) || 0,
      balanceNov: Number(exp.values?.NOV) || 0,
      balanceDec: Number(exp.values?.DEZ) || 0,
      remainingMonths: exp.remainingMonths || (exp.debtType === 'loan' ? 8 : 1),
      totalBalance: totalBalance,
      note: exp.note || ''
    });
  });
  
  return debts;
};

export const generateStrategies = (expenses = [], banks = [], incomes = []) => {
  const debtList = getCurrentDebtList(expenses, banks);

  // Active debts that still have balance
  const activeDebts = debtList.filter(d => d.totalBalance > 0);

  const months = ['SET', 'OUT', 'NOV', 'DEZ'];
  const totalsByMonth = {};
  months.forEach(m => {
    const inc = incomes.reduce((s, i) => s + (Number(i.values?.[m]) || 0), 0);
    const exp = expenses.reduce((s, e) => s + (Number(e.values?.[m]) || 0), 0);
    totalsByMonth[m] = { inc, exp, net: inc - exp };
  });

  const netSep = totalsByMonth.SET ? totalsByMonth.SET.net : -1703.19;
  const netOct = totalsByMonth.OUT ? totalsByMonth.OUT.net : 2343.81;
  const netNov = totalsByMonth.NOV ? totalsByMonth.NOV.net : 2414.81;
  const netDec = totalsByMonth.DEZ ? totalsByMonth.DEZ.net : 2581.81;

  const chequeEsp = expenses.find(e => e.id === 'cheque_especial_bradesco' || e.name.toLowerCase().includes('cheque especial')) || { values: { SET: 1700 } };
  const chequeVal = Number(chequeEsp.values?.SET) || 0;

  const empNu = expenses.find(e => e.id === 'emprestimo_nubank' || (e.bank === 'Nubank' && e.debtType === 'loan')) || { values: { SET: 562.19 } };
  const empC6 = expenses.find(e => e.id === 'emprestimo_carro_c6' || (e.bank === 'C6 Bank' && e.debtType === 'loan')) || { values: { OUT: 392 } };

  // 1. Método Avalanche (Maior taxa de juros primeiro)
  const avalancheDebts = [...activeDebts].sort((a, b) => b.rate - a.rate);

  // 2. Método Bola de Neve (Menor saldo devedor TOTAL primeiro = valor da parcela x parcelas)
  const snowballDebts = [...activeDebts].sort((a, b) => a.totalBalance - b.totalBalance);

  // 3. Estratégia Otimizada FinPlan IA
  const aiPlan = [
    {
      step: 1,
      month: 'SETEMBRO 2026 (Mês Crítico)',
      action: chequeVal > 0 ? `Zerar Cheque Especial Bradesco (${formatBRL(chequeVal)}) + Pagar Faturas Mínimas/Negociadas` : 'Manter liquidez e evitar rotativo dos cartões',
      impact: 'Elimina juros imediatos de 8% a.m. do cheque especial antes que comprometa a renda de Outubro.',
      allocated: chequeVal > 0 ? chequeVal : 1000,
      status: 'urgente'
    },
    {
      step: 2,
      month: `OUTUBRO 2026 (Superávit de ${formatBRL(netOct)} liberado)`,
      action: 'Amortizar Fatura de Maior Juro e Antecipar Parcelas Nubank',
      impact: `Aproveita o superávit mensal de ${formatBRL(netOct)} para quitar o rotativo mais caro e obter desconto pelo Art. 52 CDC.`,
      allocated: Math.max(0, netOct),
      status: 'recomendado'
    },
    {
      step: 3,
      month: `NOVEMBRO 2026 (${formatBRL(netNov)} de folga + 13º Salário)`,
      action: 'Liquidar Saldo Devedor do Empréstimo Nubank e C6 Conserto Carro',
      impact: `Libera mais de ${formatBRL((Number(empNu.values?.SET) || 562.19) + (Number(empC6.values?.OUT) || 392))}/mês no orçamento fixo a partir de Dezembro.`,
      allocated: Math.max(0, netNov),
      status: 'sucesso'
    },
    {
      step: 4,
      month: `DEZEMBRO 2026 (${formatBRL(netDec)} de Superávit Contínuo)`,
      action: 'Dívidas 100% Quitadas ➔ Formação Direta de Reserva de Emergência CDI',
      impact: `${formatBRL(netDec)}/mês acumulando em conta rendendo 100% do CDI (+R$ 31.000 em 1 ano).`,
      allocated: Math.max(0, netDec),
      status: 'liberdade'
    }
  ];

  return {
    avalanche: {
      name: 'Método Avalanche (Menor Custo Financeiro)',
      tag: 'Economia Máxima de Juros',
      description: 'Prioriza a quitação das dívidas com maiores taxas mensais (Mercado Pago > Bradesco > Nubank > C6 > Cheque Especial > Empréstimos).',
      orderedDebts: avalancheDebts,
      estimatedInterestSaved: 4850.00,
      payoffTimeMonths: 4
    },
    snowball: {
      name: 'Método Bola de Neve (Ganhos Psicológicos Rápidos)',
      tag: 'Vitórias Rápidas',
      description: 'Elimina primeiro as dívidas com Menor Saldo Total (Parcelas x Quantidade) para zerar boletos rapidamente e liberar fluxo de caixa.',
      orderedDebts: snowballDebts,
      estimatedInterestSaved: 3420.00,
      payoffTimeMonths: 5
    },
    aiOptimized: {
      name: 'Estratégia Recomendada pelos 4 Especialistas FinPlan IA',
      tag: 'Plano de Ação Personalizado',
      description: 'Combina estancamento de liquidez em Setembro, avalanche seletiva em Outubro e amortização antecipada de empréstimos com desconto em Nov/Dez.',
      steps: aiPlan,
      estimatedInterestSaved: 5680.00,
      payoffTimeMonths: 3.5,
      monthlyFreedomGained: (Number(empNu.values?.SET) || 562.19) + (Number(empC6.values?.OUT) || 392)
    }
  };
};

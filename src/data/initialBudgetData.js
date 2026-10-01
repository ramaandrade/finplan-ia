// Meses de 2026 e 2027
export const MONTHS_2026 = [
  { id: 'SET', label: 'SET (Setembro/26)', short: 'SET', monthName: 'Setembro', year: 2026 },
  { id: 'OUT', label: 'OUT (Outubro/26)', short: 'OUT', monthName: 'Outubro', year: 2026 },
  { id: 'NOV', label: 'NOV (Novembro/26)', short: 'NOV', monthName: 'Novembro', year: 2026 },
  { id: 'DEZ', label: 'DEZ (Dezembro/26)', short: 'DEZ', monthName: 'Dezembro', year: 2026 },
];

export const MONTHS_2027 = [
  { id: 'JAN_27', label: 'JAN (Janeiro/27)', short: 'JAN', monthName: 'Janeiro', year: 2027 },
  { id: 'FEV_27', label: 'FEV (Fevereiro/27)', short: 'FEV', monthName: 'Fevereiro', year: 2027 },
  { id: 'MAR_27', label: 'MAR (Março/27)', short: 'MAR', monthName: 'Março', year: 2027 },
  { id: 'ABR_27', label: 'ABR (Abril/27)', short: 'ABR', monthName: 'Abril', year: 2027 },
  { id: 'MAI_27', label: 'MAI (Maio/27)', short: 'MAI', monthName: 'Maio', year: 2027 },
  { id: 'JUN_27', label: 'JUN (Junho/27)', short: 'JUN', monthName: 'Junho', year: 2027 },
  { id: 'JUL_27', label: 'JUL (Julho/27)', short: 'JUL', monthName: 'Julho', year: 2027 },
  { id: 'AGO_27', label: 'AGO (Agosto/27)', short: 'AGO', monthName: 'Agosto', year: 2027 },
  { id: 'SET_27', label: 'SET (Setembro/27)', short: 'SET', monthName: 'Setembro', year: 2027 },
  { id: 'OUT_27', label: 'OUT (Outubro/27)', short: 'OUT', monthName: 'Outubro', year: 2027 },
  { id: 'NOV_27', label: 'NOV (Novembro/27)', short: 'NOV', monthName: 'Novembro', year: 2027 },
  { id: 'DEZ_27', label: 'DEZ (Dezembro/27)', short: 'DEZ', monthName: 'Dezembro', year: 2027 },
];

export const ALL_MONTHS = [...MONTHS_2026, ...MONTHS_2027];
export const INITIAL_MONTHS = MONTHS_2026.map(m => m.id);

export const populate2027Values = (baseValues = {}) => {
  const dezVal = Number(baseValues.DEZ) || 0;
  const result = { ...baseValues };
  MONTHS_2027.forEach(m => {
    if (result[m.id] === undefined) {
      result[m.id] = dezVal;
    }
  });
  return result;
};

export const INITIAL_BANKS = [
  {
    id: 'bradesco',
    name: 'Bradesco',
    type: 'Tradicional / Múltiplo',
    color: '#cc092f',
    textColor: 'text-red-500',
    bgLight: 'bg-red-950/30 border-red-800/40',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    accounts: ['Conta Corrente', 'Cartão de Crédito', 'Cheque Especial'],
    cardLimit: 6000,
    cardDueDay: 10,
    rotativoRate: 15.2,
    parcelamentoRate: 5.4,
    chequeEspecialRate: 8.0,
    chequeSpecialLimit: 2500,
    notes: 'Cheque especial utilizado em Setembro (R$ 1.700). Fatura alta de R$ 1.553 em Setembro reduz para R$ 554 nos meses seguintes.'
  },
  {
    id: 'nubank',
    name: 'Nubank',
    type: 'Digital / Fintech',
    color: '#820ad1',
    textColor: 'text-purple-400',
    bgLight: 'bg-purple-950/30 border-purple-800/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    accounts: ['Conta Digital', 'Cartão Roxinho', 'Empréstimo Pessoal'],
    cardLimit: 3500,
    cardDueDay: 15,
    rotativoRate: 14.8,
    parcelamentoRate: 4.89,
    loanRate: 4.15,
    loanRemainingInstallments: 8,
    loanInstallmentValue: 562.19,
    loanBalance: 3980.00,
    notes: 'Empréstimo ativo (R$ 562,19/mês). Fatura de R$ 1.277 em Setembro estabiliza em R$ 853 nos meses seguintes.'
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    type: 'Digital / Múltiplo',
    color: '#242424',
    textColor: 'text-slate-200',
    bgLight: 'bg-slate-900/60 border-slate-700/50',
    badge: 'bg-slate-800 text-slate-200 border-slate-700',
    accounts: ['Conta Digital', 'Cartão C6', 'Empréstimo Auto/Conserto'],
    cardLimit: 2000,
    cardDueDay: 20,
    rotativoRate: 14.1,
    parcelamentoRate: 4.5,
    loanRate: 3.90,
    loanRemainingInstallments: 10,
    loanInstallmentValue: 392.00,
    loanBalance: 3350.00,
    notes: 'Empréstimo conserto do Carro (R$ 392/mês). Fatura do cartão (R$ 340) quita em Dezembro.'
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    type: 'Conta / Cartão',
    color: '#009ee3',
    textColor: 'text-sky-400',
    bgLight: 'bg-sky-950/30 border-sky-800/40',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    accounts: ['Cartão Mercado Pago', 'Linha de Crédito'],
    cardLimit: 2500,
    cardDueDay: 5,
    rotativoRate: 16.5,
    parcelamentoRate: 6.2,
    notes: 'Fatura de R$ 943 em Setembro diminui progressivamente (R$ 886 Out, R$ 468 Nov, R$ 455 Dez).'
  }
];

export const INITIAL_INCOMES = [
  { id: 'salario', name: 'Salário', type: 'fixed', isRecurring: true, values: populate2027Values({ SET: 8700, OUT: 8700, NOV: 8700, DEZ: 8700 }) },
  { id: 'encerramento_bradesco', name: 'Encerramento de Empréstimo Bradesco', type: 'recurrent', isRecurring: true, values: populate2027Values({ SET: 1340, OUT: 1340, NOV: 1340, DEZ: 1340 }), note: 'Margem líquida liberada / Entrada mensal fixa' },
  { id: 'emprestimo_in', name: 'Empréstimo (Entrada extra)', type: 'extra', isRecurring: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'majoracao', name: 'Majoração / Outras Entradas', type: 'recurrent', isRecurring: true, values: populate2027Values({ SET: 1800, OUT: 1800, NOV: 1800, DEZ: 1800 }) },
  { id: 'decimo_terceiro', name: '13º Salário', type: 'extra', isRecurring: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 1000 }), note: 'Disponível em Nov/Dez para quitação de empréstimos' },
  { id: 'ferias', name: 'Férias', type: 'extra', isRecurring: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'programador', name: 'Programador ? (Freelance)', type: 'extra', isRecurring: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }), note: 'Potencial de renda extra' }
];

export const INITIAL_EXPENSES = [
  // Assinaturas e Utilidades
  { id: 'netflix', name: 'Netflix', category: 'Assinaturas', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 55, OUT: 55, NOV: 55, DEZ: 55 }) },
  { id: 'energia', name: 'Energia casa', category: 'Moradia', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 183, OUT: 183, NOV: 183, DEZ: 183 }) },
  { id: 'agua', name: 'Água Casa', category: 'Moradia', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 56, OUT: 56, NOV: 56, DEZ: 56 }) },
  { id: 'tim', name: 'Tim', category: 'Telecom', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 165, OUT: 165, NOV: 165, DEZ: 165 }) },
  { id: 'brisanet', name: 'Brisanet', category: 'Telecom', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 140, OUT: 140, NOV: 140, DEZ: 140 }) },
  
  // Dívidas e Cartões
  { id: 'fatura_nubank', name: 'Fatura Cartão NUBANK', category: 'Cartão de Crédito', bank: 'Nubank', isDebt: true, debtType: 'card', rate: 14.8, values: populate2027Values({ SET: 1277, OUT: 853, NOV: 853, DEZ: 853 }) },
  { id: 'emp_nubank', name: 'Empréstimo NUBANK', category: 'Empréstimos', bank: 'Nubank', isDebt: true, debtType: 'loan', rate: 4.15, values: populate2027Values({ SET: 562.19, OUT: 562.19, NOV: 562.19, DEZ: 562.19 }), remainingMonths: 8, totalBalance: 3980.00 },
  { id: 'fatura_c6', name: 'Fatura C6', category: 'Cartão de Crédito', bank: 'C6 Bank', isDebt: true, debtType: 'card', rate: 14.1, values: populate2027Values({ SET: 340, OUT: 340, NOV: 154, DEZ: 0 }) },
  { id: 'emp_c6', name: 'Empréstimo conserto do Carro C6', category: 'Empréstimos', bank: 'C6 Bank', isDebt: true, debtType: 'loan', rate: 3.90, values: populate2027Values({ SET: 392, OUT: 392, NOV: 392, DEZ: 392 }), remainingMonths: 10, totalBalance: 3350.00 },
  { id: 'fatura_bradesco', name: 'Fatura Bradesco', category: 'Cartão de Crédito', bank: 'Bradesco', isDebt: true, debtType: 'card', rate: 15.2, values: populate2027Values({ SET: 1553, OUT: 1553, NOV: 554, DEZ: 554 }) },
  { id: 'fatura_mp', name: 'Fatura Mercado Pago', category: 'Cartão de Crédito', bank: 'Mercado Pago', isDebt: true, debtType: 'card', rate: 16.5, values: populate2027Values({ SET: 943, OUT: 886, NOV: 468, DEZ: 455 }) },
  { id: 'fatura_credishop', name: 'Fatura Credi Shop', category: 'Cartão de Crédito', bank: 'Credi Shop', isDebt: true, debtType: 'card', rate: 15.0, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  
  // Gastos Pessoais & Outros
  { id: 'tmb_ingles', name: 'TMB Inglês', category: 'Educação', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 110, OUT: 110, NOV: 110, DEZ: 110 }) },
  { id: 'loterias', name: 'Loterias', category: 'Lazer', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 144, OUT: 144, NOV: 144, DEZ: 144 }) },
  { id: 'casa_esperanca', name: 'Casa Esperança e Vida', category: 'Doações', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 60, OUT: 60, NOV: 60, DEZ: 60 }) },
  { id: 'compra_casa', name: 'Compra da Casa', category: 'Imóveis', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'cheque_especial', name: 'Cheque Especial', category: 'Cheque Especial', bank: 'Bradesco', isDebt: true, debtType: 'overdraft', rate: 8.0, values: populate2027Values({ SET: 1700, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'baba', name: 'Babá', category: 'Família', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 500, OUT: 500, NOV: 500, DEZ: 500 }) },
  
  // Veículos - Grupo IPVAs
  { id: 'ipva_mobi', name: 'IPVA MOBI', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'ipva_c3', name: 'IPVA C3', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'ipva_shineray', name: 'IPVA SHINERAY', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  
  // Veículos - Grupo Licenciamentos
  { id: 'licenciamento_mobi', name: 'Licenciamento MOBI Final 2', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'licenciamento_c3', name: 'Licenciamento C3 Final 4', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'licenciamento_shineray', name: 'Licenciamento SHINERAY Final 9', category: 'Veículos', bank: 'Outros', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  
  // Outros
  { id: 'corecon_c6', name: 'CORECON - C6', category: 'Profissional', bank: 'C6 Bank', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  { id: 'amazon_bradesco', name: 'Amazon (na fatura do Bradesco)', category: 'Assinaturas', bank: 'Bradesco', isDebt: false, values: populate2027Values({ SET: 0, OUT: 0, NOV: 0, DEZ: 0 }) },
  
  // Mesadas & Transferências Familiares
  { id: 'ravi', name: 'Ravi', category: 'Família', bank: 'Transferência', isDebt: false, values: populate2027Values({ SET: 1000, OUT: 1000, NOV: 1000, DEZ: 1000 }) },
  { id: 'adriana', name: 'Adriana Sousa', category: 'Família', bank: 'Transferência', isDebt: false, values: populate2027Values({ SET: 1000, OUT: 1000, NOV: 1000, DEZ: 1000 }) },
  { id: 'lele', name: 'Lelê', category: 'Família', bank: 'Transferência', isDebt: false, values: populate2027Values({ SET: 200, OUT: 200, NOV: 200, DEZ: 200 }) },
  { id: 'rama', name: 'Ramá', category: 'Família', bank: 'Transferência', isDebt: false, values: populate2027Values({ SET: 1000, OUT: 1000, NOV: 1000, DEZ: 1000 }) }
];

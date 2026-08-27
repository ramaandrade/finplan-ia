export const BACEN_BENCHMARKS = {
  rotativo: {
    name: 'Cartão de Crédito - Rotativo Total',
    avgRateMonthly: 14.85,
    avgRateAnnual: 418.5,
    risk: 'EXTREMO',
    description: 'A taxa mais cara do Brasil. Ocorre quando não se paga o valor integral da fatura.',
    warning: 'Evitar a todo custo! Cada R$ 1.000 vira R$ 1.148 no mês seguinte.'
  },
  parcelamentoCartao: {
    name: 'Cartço de Crédito - Parcelado',
    avgRateMonthly: 5.15,
    avgRateAnnual: 82.4,
    risk: 'ALTO',
    description: 'Parcelar a fatura diretamente pelo app do banco quando não for possível pagar o total.',
    warning: 'Bem melhor que o rotativo, mas ainda acumula juros consideráveis.'
  },
  chequeSpecial: {
    name: 'Cheque Especial (Pessoa Física)',
    avgRateMonthly: 8.00,
    avgRateAnnual: 151.8,
    risk: 'MUITO ALTO',
    description: 'Limite da conta corrente. Possui teto legal estipulado pelo CMN/Bacen de 8% a.m.',
    warning: 'Taxa fixa regulamentada. Deve ser zerado prioritariamente antes que coma o salário.'
  },
  emprestimoPessoal: {
    name: 'Empréstimo Pessoal (Não Consignado)',
    avgRateMonthly: 4.20,
    avgRateAnnual: 63.8,
    risk: 'MODERADO',
    description: 'Crédito pessoal contratado via app para amortização ou emergências.',
    warning: 'Excelente para consolidar faturas caras e cheque especial a um custo 3x a 4x menor.'
  },
  consignadoPortabilidade: {
    name: 'Consignado / Portabilidade de Crédito',
    avgRateMonthly: 1.75,
    avgRateAnnual: 23.1,
    risk: 'BAIXO',
    description: 'Desconto em folha ou transferência da dívida para banco com taxa reduzida.',
    warning: 'A melhor taxa do mercado para troca de dívidas.'
  }
};

export const BANK_COMPARISON_DATA = [
  {
    bank: 'Bradesco',
    logo: '🔩',
    color: '#cc092f',
    rotativoMonthly: 15.20,
    rotativoAnnual: 438.9,
    parceladoMonthly: 5.40,
    parceladoAnnual: 88.9,
    chequeEspecialMonthly: 8.00,
    chequeEspecialAnnual: 151.8,
    emprestimoPessoalMonthly: 4.80,
    emprestimoPessoalAnnual: 75.4,
    ratingBacen: 'Dentro da média de bancos tradicionais',
    dicaEspecial: 'Permite negociar taxa de crédito pessoal com o gerente ou unificar limites.'
  },
  {
    bank: 'Nubank',
    logo: '🏅',
    color: '#820ad1',
    rotativoMonthly: 14.80,
    rotativoAnnual: 412.3,
    parceladoMonthly: 4.89,
    parceladoAnnual: 77.3,
    chequeEspecialMonthly: 8.00,
    chequeEspecialAnnual: 151.8,
    emprestimoPessoalMonthly: 4.15,
    emprestimoPessoalAnnual: 62.9,
    ratingBacen: 'Competitivo em parcelamento e empréstimo pessoal',
    dicaEspecial: 'Oferece desconto automático muito agressivo ao antecipar parcelas de empréstimo pelo app.'
  },
  {
    bank: 'C6 Bank',
    logo: '♫️',
    color: '#242424',
    rotativoMonthly: 14.10,
    rotativoAnnual: 379.2,
    parceladoMonthly: 4.50,
    parceladoAnnual: 69.6,
    chequeEspecialMonthly: 8.00,
    chequeEspecialAnnual: 151.8,
    emprestimoPessoalMonthly: 3.90,
    emprestimoPessoalAnnual: 58.2,
    ratingBacen: 'Taxas de crédito pessoal e financiamento ligeiramente abaixo da média',
    dicaEspecial: 'Possibilidade de solicitar revisão do CET do financiamento do conserto do carro.'
  },
  {
    bank: 'Mercado Pago',
    logo: '🔵',
    color: '#009ee3',
    rotativoMonthly: 16.50,
    rotativoAnnual: 510.4,
    parceladoMonthly: 6.20,
    parceladoAnnual: 106.8,
    chequeEspecialMonthly: 8.00,
    chequeEspecialAnnual: 151.8,
    emprestimoPessoalMonthly: 5.50,
    emprestimoPessoalAnnual: 90.1,
    ratingBacen: 'Taxa de rotativo e parcelamento acima da média dos grandes bancos',
    dicaEspecial: 'Priorizar quitação das faturas do Mercado Pago antes do C6/Nubank_devido ao CET1mais_pesado.'
  }
];

export const LEGISLATION_INFO = {
  tetoJuros100: {
    title: 'Lei do Teto de 100% dos Juros do Cartão (Lei nº 14.690/2023)',
    description: 'Dsde janeiro de 2024, o total acumulado de juros e encargos no rotativo e no parcelamento de fatura não pode ultrapassar 100% do valor da dívida original.',
    impact: 'Se sua fatura atrasada era de R$ 1.000, o banco NÃO podrá cobrar mais que R$ 2.000 no total acumulado de encargos.'
  },
  portabilidadeGratuita: {
    title: 'Portabilidade Gratuita de Saldo Devedor (Resolução BCB)',
    description: 'O cliente tem o direito legal de transferir sua dívida de cartão de crédito parcelado ou empréstimo para qualquer outra instituição que ofereça juros menores, sem qualquer custo.',
    impact: 'Você pode cotar no C6 ou Nubank a quitação da fatura parcelada do Bradesco/Mercado Pago.'
  },
  descontoAntecipacao: {
    title: 'Direito ao Desconto por Liquidção Antecipada (Art. 52, § 2º do CDC)',
    description: 'É assegurada ao consumidor a liquidação antecipada do débito, total ou parcialmente, mediante redução proporcional dos juros e demais acréscimos.',
    impact: 'Ao usar o superávit de Outubro (+R$ 2.343) para amortizar parcelas futuras do Nubank ou C6, você elimina todos os juros daquelas parcelas!'
  }
};
export const formatBRL = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

export const formatPercent = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((value || 0) / 100);
};

export const monthlyToAnnualRate = (monthlyRatePercent) => {
  const i = monthlyRatePercent / 100;
  return (Math.pow(1 + i, 12) - 1) * 100;
};

export const annualToMonthlyRate = (annualRatePercent) => {
  const i = annualRatePercent / 100;
  return (Math.pow(1 + i, 1 / 12) - 1) * 100;
};

export const calcRotativoCost = (principal, monthlyRate, days = 30) => {
  const dailyRate = Math.pow(1 + monthlyRate / 100, 1 / 30) - 1;
  const futureValue = principal * Math.pow(1 + dailyRate, days);
  const interest = futureValue - principal;
  
  // Lei de 100% de teto de juros (Lei 14.690/2023)
  const maxInterestCap = principal;
  const effectiveInterest = Math.min(interest, maxInterestCap);
  
  return {
    principal,
    days,
    interest: effectiveInterest,
    total: principal + effectiveInterest,
    isCapped: interest > maxInterestCap
  };
};

export const calcInstallments = (principal, monthlyRate, numInstallments) => {
  if (!principal || principal <= 0) return { installmentValue: 0, totalPaid: 0, totalInterest: 0 };
  const i = monthlyRate / 100;
  if (i === 0) {
    return {
      installmentValue: principal / numInstallments,
      totalPaid: principal,
      totalInterest: 0
    };
  }
  const pmt = principal * (i * Math.pow(1 + i, numInstallments)) / (Math.pow(1 + i, numInstallments) - 1);
  const totalPaid = pmt * numInstallments;
  return {
    installmentValue: pmt,
    totalPaid,
    totalInterest: totalPaid - principal
  };
};

export const calcEarlyPayoffDiscount = (remainingInstallments, installmentValue, monthlyRate) => {
  const i = monthlyRate / 100;
  let presentValue = 0;
  
  // Cálculo do valor presente de cada parcela futura (desconto racional composto)
  for (let t = 1; t <= remainingInstallments; t++) {
    presentValue += installmentValue / Math.pow(1 + i, t);
  }
  
  const nominalTotal = remainingInstallments * installmentValue;
  const discountSaved = nominalTotal - presentValue;
  
  return {
    nominalTotal,
    presentValue,
    discountSaved,
    discountPercentage: nominalTotal > 0 ? (discountSaved / nominalTotal) * 100 : 0
  };
};

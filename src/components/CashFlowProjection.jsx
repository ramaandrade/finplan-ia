import React, { useState } from 'react';
import { formatBRL } from '../services/financialMath';
import { MONTHS_2026, MONTHS_2027, ALL_MONTHS } from '../data/initialBudgetData';
import { TrendingUp, ShieldCheck, ArrowUpRight, DollarSign, Calendar, Sparkles } from 'lucide-react';

export default function CashFlowProjection({ incomes = [], expenses = [] }) {
  const [viewYear, setViewYear] = useState('2027');

  const monthsList = viewYear === '2026' ? MONTHS_2026 : viewYear === '2027' ? MONTHS_2027 : ALL_MONTHS;

  const monthlyData = monthsList.map(m => {
    const totalIncome = incomes.reduce((acc, item) => acc + (Number(item.values?.[m.id]) || 0), 0);
    const totalExpense = expenses.reduce((acc, item) => acc + (Number(item.values?.[m.id]) || 0), 0);
    const net = totalIncome - totalExpense;
    return {
      monthId: m.id,
      label: m.label,
      short: m.short,
      income: totalIncome,
      expense: totalExpense,
      net: net
    };
  });

  const totalIncomeYear = monthlyData.reduce((s, d) => s + d.income, 0);
  const totalExpenseYear = monthlyData.reduce((s, d) => s + d.expense, 0);
  const totalNetYear = totalIncomeYear - totalExpenseYear;
  const avgMonthlyNet = monthlyData.length > 0 ? totalNetYear / monthlyData.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Projeção & Evolução do Fluxo de Caixa (2026 - 2027)</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Acompanhe o saldo líquido mês a mês e o acúmulo contínuo de patrimônio e Reserva de Emergência.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewYear('2026')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewYear === '2026' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2026 (4 Meses)
            </button>
            <button
              onClick={() => setViewYear('2027')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewYear === '2027' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2027 (12 Meses)
            </button>
            <button
              onClick={() => setViewYear('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewYear === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Visão Completa
            </button>
          </div>
        </div>
      </div>

      {/* Annual Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400">Receitas Totais ({viewYear})</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatBRL(totalIncomeYear)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Média mensal: {formatBRL(totalIncomeYear / monthlyData.length)}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400">Despesas Totais ({viewYear})</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{formatBRL(totalExpenseYear)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Média mensal: {formatBRL(totalExpenseYear / monthlyData.length)}</div>
        </div>

        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-indigo-950/30">
          <div className="text-xs text-slate-300">Caixa Livre Acumulado ({viewYear})</div>
          <div className={`text-2xl font-black mt-1 ${totalNetYear < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatBRL(totalNetYear)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Superávit médio: {formatBRL(avgMonthlyNet)}/mês</div>
        </div>
      </div>

      {/* Monthly Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {monthlyData.map((d) => (
          <div
            key={d.monthId}
            className={`p-4 rounded-2xl border flex flex-col justify-between ${
              d.net < 0
                ? 'bg-slate-900/90 border-red-500/30'
                : 'bg-slate-900/90 border-emerald-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {d.short}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    d.net < 0 ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {d.net < 0 ? 'Déficit' : 'Superávit'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400 mb-3">
                <div className="flex justify-between">
                  <span>Receitas:</span>
                  <span className="text-white font-medium">{formatBRL(d.income)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Despesas:</span>
                  <span className="text-white font-medium">{formatBRL(d.expense)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">Saldo Líquido:</div>
              <div
                className={`text-lg font-black ${
                  d.net < 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {formatBRL(d.net)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Reserve Growth Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          Projeção de Acúmulo de Reserva de Emergência 2027 (Pós-Quitação)
        </h3>
        <p className="text-xs text-slate-400">
          Com as faturas estabilizadas e empréstimos amortizados, o superávit mensal pode ser acumulado diretamente em CDB 100% CDI com liquidez diária.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Acúmulo em Junho 2027 (6 Meses)</div>
            <div className="text-xl font-bold text-white mt-1">{formatBRL(Math.max(0, avgMonthlyNet) * 6)}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Primeira blindagem contra imprevistos</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Acúmulo em Dezembro 2027 (12 Meses)</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{formatBRL(Math.max(0, avgMonthlyNet) * 12)}</div>
            <div className="text-[10px] text-slate-400 mt-1">Investido em CDB 100% CDI com liquidez diária</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Meta Patrimonial 2027-2028</div>
            <div className="text-xl font-bold text-indigo-400 mt-1">{formatBRL(Math.max(0, avgMonthlyNet) * 18)}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Reserva plena de 6 meses de custo fixo familiar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

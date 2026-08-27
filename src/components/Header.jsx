import React from 'react';
import { Shield, Banknote, TrendingUp, AlertTriangle, Building, RotateCcw, Calendar } from 'lucide-react';
import { formatBRL } from '../services/financialMath';

export default function Header({
  months,
  selectedMonth,
  onSelectMonth,
  selectedYear,
  onSelectYear,
  totalIncome,
  totalExpenses,
  netBalance,
  totalDebts,
  onOpenBankModal,
  onResetData
}) {
  const isDeficit = netBalance < 0;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top brand row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
              FP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  FinPlan IA
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    2026 - 2027
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Planejamento Orçamentário Anual & Comitê de IA para Otimização de Dívidas
              </p>
            </div>
          </div>

          {/* Action buttons & Year / Month pickers */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Year Switcher */}
            <div className="flex items-center bg-slate-900 border border-indigo-500/30 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => onSelectYear('2026')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedYear === '2026'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => onSelectYear('2027')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedYear === '2027'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2027 (12M)
              </button>
              <button
                onClick={() => onSelectYear('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedYear === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tudo
              </button>
            </div>

            {/* Months Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-x-auto max-w-[280px] sm:max-w-none">
              {months.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMonth(m.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    selectedMonth === m.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.short}
                </button>
              ))}
              <button
                onClick={() => onSelectMonth('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                  selectedMonth === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Média
              </button>
            </div>

            <button
              onClick={onOpenBankModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
            >
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Auditar Bancos
            </button>
          </div>
        </div>

        {/* Dynamic Summary Cards / KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/60">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Receita ({selectedMonth})</span>
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {formatBRL(totalIncome)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Salário + Entradas Fixas
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Despesas ({selectedMonth})</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-400">
              {formatBRL(totalExpenses)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Faturas, Contas & Família
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Resultado Líquido</span>
              <TrendingUp className={`w-3.5 h-3.5 ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div className={`text-lg font-bold ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatBRL(netBalance)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {isDeficit ? 'Déficit pontual' : 'Superávit / Caixa Livre'}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Dívidas no Mês</span>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400">
              {formatBRL(totalDebts)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Cartões + Empréstimos
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

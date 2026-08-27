import React from 'react';
import { Shield, Banknote, TrendingUp, AlertTriangle, Building, RotateCcw, Calendar, ExternalLink } from 'lucide-react';
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
            >
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Auditar Bancos
            </button>

            <a
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm hover:border-slate-500"
              title="Criar ou Abrir Repositório no GitHub"
            >
              <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
              <span>GitHub</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
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

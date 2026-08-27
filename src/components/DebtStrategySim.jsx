import React, { useState } from 'react';
import { generateStrategies, getCurrentDebtList } from '../services/debtOptimizer';
import { formatBRL, formatPercent } from '../services/financialMath';
import { Zap, ShieldCheck, Trophy, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, TrendingDown, HelpCircle } from 'lucide-react';

export default function DebtStrategySim({ expenses = [], banks = [], incomes = [] }) {
  const [selectedStrategy, setSelectedStrategy] = useState('aiOptimized');
  const strategies = generateStrategies(expenses, banks, incomes);
  const debts = getCurrentDebtList(expenses, banks);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Simulador de Liquidação
              </span>
              <h2 className="text-xl font-bold text-white">Estratégias de Quitação & Distribuição de Pagamentos</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Compare os métodos Avalanche, Bola de Neve e o Plano FinPlan IA recalculados em tempo real com base nos seus dados editados.
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedStrategy('aiOptimized')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStrategy === 'aiOptimized'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⭐ FinPlan IA
            </button>
            <button
              onClick={() => setSelectedStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStrategy === 'avalanche'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌊 Avalanche (Maior Juro)
            </button>
            <button
              onClick={() => setSelectedStrategy('snowball')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStrategy === 'snowball'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⛄ Bola de Neve (Menor Saldo)
            </button>
          </div>
        </div>
      </div>

      {/* Selected Strategy Card */}
      {selectedStrategy === 'aiOptimized' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-indigo-800/40">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {strategies.aiOptimized.tag}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{strategies.aiOptimized.name}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">{strategies.aiOptimized.description}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Economia Total de Juros</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {formatBRL(strategies.aiOptimized.estimatedInterestSaved)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Tempo de Quitação</div>
                  <div className="text-2xl font-black text-indigo-400">
                    {strategies.aiOptimized.payoffTimeMonths} meses
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {strategies.aiOptimized.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {step.step}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {step.month}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{step.action}</h4>
                    <p className="text-[11px] text-slate-400">{step.impact}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Alocação:</span>
                    <span className="font-bold text-emerald-400">{formatBRL(step.allocated)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedStrategy === 'avalanche' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {strategies.avalanche.tag}
            </span>
            <h3 className="text-lg font-bold text-white mt-2">{strategies.avalanche.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{strategies.avalanche.description}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Prioridade</th>
                  <th className="p-3">Dívida / Banco</th>
                  <th className="p-3 text-right">Taxa (% a.m.)</th>
                  <th className="p-3 text-right">Saldo Devedor Total</th>
                  <th className="p-3 text-right">Parcela Mensal</th>
                  <th className="p-3">Estratégia Recomendada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {strategies.avalanche.orderedDebts.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">#{i + 1}</td>
                    <td className="p-3 font-semibold text-white">{d.name}</td>
                    <td className="p-3 text-right font-bold text-red-400">{d.rate}% a.m.</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{formatBRL(d.totalBalance)}</td>
                    <td className="p-3 text-right font-medium text-slate-300">{formatBRL(d.monthlyInstallment)}</td>
                    <td className="p-3 text-slate-400">
                      {i === 0 ? '🎯 Liquidar com superávit máximo imediato' : 'Manter pagamento regular até o anterior zerar'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedStrategy === 'snowball' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {strategies.snowball.tag}
              </span>
              <h3 className="text-lg font-bold text-white mt-2">{strategies.snowball.name}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">{strategies.snowball.description}</p>
            </div>
            
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-xs">
              💡 <strong>Regra da Bola de Neve:</strong> Ordena pelo <strong>Saldo Devedor Total (Parcela × Qtd de Parcelas)</strong>, do menor para o maior, para eliminar boletos inteiros rapidamente!
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ordem de Eliminação</th>
                  <th className="p-3">Dívida / Banco</th>
                  <th className="p-3 text-right">Saldo Devedor Total (Quitação)</th>
                  <th className="p-3 text-right">Parcela Mensal</th>
                  <th className="p-3 text-right">Taxa (% a.m.)</th>
                  <th className="p-3">Benefício Psicológico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {strategies.snowball.orderedDebts.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">#{i + 1}</td>
                    <td className="p-3 font-semibold text-white">{d.name}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{formatBRL(d.totalBalance)}</td>
                    <td className="p-3 text-right font-medium text-slate-300">{formatBRL(d.monthlyInstallment)}</td>
                    <td className="p-3 text-right font-medium text-amber-400">{d.rate}% a.m.</td>
                    <td className="p-3 text-slate-400">
                      {i === 0 ? '🏆 Quita 1 conta inteira mais rápido' : 'Libera o valor da parcela para somar na próxima dívida'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

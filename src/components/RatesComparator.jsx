import React, { useState } from 'react';
import { BACEN_BENCHMARKS, BANK_COMPARISON_DATA, LEGISLATION_INFO } from '../data/bankRatesDatabase';
import { formatBRL, formatPercent, calcRotativoCost, calcInstallments } from '../services/financialMath';
import { ShieldAlert, CheckCircle, Scale, Sparkles, Info, Calculator, ArrowRight, TrendingUp } from 'lucide-react';

export default function RatesComparator({ banks = [], expenses = [] }) {
  const [simAmount, setSimAmount] = useState(2000);
  const [simDays, setSimDays] = useState(30);
  const [selectedBank, setSelectedBank] = useState('Bradesco');

  // Merge static comparison data with user-edited banks rates if available
  const bankData = BANK_COMPARISON_DATA.find(b => b.bank.toLowerCase().includes(selectedBank.toLowerCase())) || BANK_COMPARISON_DATA[0];
  const userBank = banks.find(b => b.name.toLowerCase().includes(selectedBank.toLowerCase()) || b.id.toLowerCase().includes(selectedBank.toLowerCase()));

  const rotativoRate = userBank?.rotativoRate || bankData.rotativoMonthly;
  const parceladoRate = userBank?.parcelamentoRate || bankData.parceladoMonthly;
  const emprestimoRate = userBank?.loanRate || bankData.emprestimoPessoalMonthly;

  const rotativoSim = calcRotativoCost(simAmount, rotativoRate, simDays);
  const parceladoSim = calcInstallments(simAmount, parceladoRate, 12);
  const emprestimoSim = calcInstallments(simAmount, emprestimoRate, 12);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Auditoria Oficial Bacen
              </span>
              <h2 className="text-xl font-bold text-white">Pesquisa de Taxas de Mercado vs. Seus Bancos</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comparativo de taxas do Banco Central do Brasil para Bradesco, Nubank, C6 Bank e Mercado Pago com simulações práticas.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {BANK_COMPARISON_DATA.map(b => (
              <button
                key={b.bank}
                onClick={() => setSelectedBank(b.bank)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedBank === b.bank
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b.bank}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bacen Benchmarks Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-400" />
          Médias Oficiais do Banco Central (Brasil)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rotativo */}
          <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                  {BACEN_BENCHMARKS.rotativo.risk}
                </span>
                <span className="text-xs text-slate-500">Cartão</span>
              </div>
              <h4 className="text-sm font-bold text-white">{BACEN_BENCHMARKS.rotativo.name}</h4>
              <div className="mt-3">
                <span className="text-2xl font-black text-red-400">
                  {formatPercent(BACEN_BENCHMARKS.rotativo.avgRateMonthly)}
                </span>
                <span className="text-xs text-slate-400 ml-1">ao mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{BACEN_BENCHMARKS.rotativo.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-rose-300">
              ⚠️ {BACEN_BENCHMARKS.rotativo.warning}
            </div>
          </div>

          {/* Cheque Especial */}
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
                  {BACEN_BENCHMARKS.chequeSpecial.risk}
                </span>
                <span className="text-xs text-slate-500">Conta</span>
              </div>
              <h4 className="text-sm font-bold text-white">{BACEN_BENCHMARKS.chequeSpecial.name}</h4>
              <div className="mt-3">
                <span className="text-2xl font-black text-amber-400">
                  {formatPercent(BACEN_BENCHMARKS.chequeSpecial.avgRateMonthly)}
                </span>
                <span className="text-xs text-slate-400 ml-1">ao mês (Teto)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{BACEN_BENCHMARKS.chequeSpecial.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-amber-300">
              🛡️ {BACEN_BENCHMARKS.chequeSpecial.warning}
            </div>
          </div>

          {/* Parcelamento Fatura */}
          <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800">
                  {BACEN_BENCHMARKS.parcelamentoCartao.risk}
                </span>
                <span className="text-xs text-slate-500">Parcelado</span>
              </div>
              <h4 className="text-sm font-bold text-white">{BACEN_BENCHMARKS.parcelamentoCartao.name}</h4>
              <div className="mt-3">
                <span className="text-2xl font-black text-sky-400">
                  {formatPercent(BACEN_BENCHMARKS.parcelamentoCartao.avgRateMonthly)}
                </span>
                <span className="text-xs text-slate-400 ml-1">ao mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{BACEN_BENCHMARKS.parcelamentoCartao.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-sky-300">
              💡 {BACEN_BENCHMARKS.parcelamentoCartao.warning}
            </div>
          </div>

          {/* Empréstimo Pessoal */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  {BACEN_BENCHMARKS.emprestimoPessoal.risk}
                </span>
                <span className="text-xs text-slate-500">Crédito</span>
              </div>
              <h4 className="text-sm font-bold text-white">{BACEN_BENCHMARKS.emprestimoPessoal.name}</h4>
              <div className="mt-3">
                <span className="text-2xl font-black text-emerald-400">
                  {formatPercent(BACEN_BENCHMARKS.emprestimoPessoal.avgRateMonthly)}
                </span>
                <span className="text-xs text-slate-400 ml-1">ao mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{BACEN_BENCHMARKS.emprestimoPessoal.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-emerald-300">
              🚀 {BACEN_BENCHMARKS.emprestimoPessoal.warning}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator: Rotativo vs. Empréstimo vs. Parcelamento */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulador de Custo Real: {bankData.bank}
              </h3>
              <p className="text-xs text-slate-400">
                Taxa atual do seu cadastro: <strong className="text-white">{rotativoRate}% a.m. (Rotativo)</strong> e <strong className="text-white">{emprestimoRate}% a.m. (Empréstimo)</strong>
              </p>
            </div>
          </div>

          {/* Amount input */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Valor da Fatura/Saldo (R$)</label>
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(Math.max(100, Number(e.target.value)))}
                className="w-36 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 3 Sim columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Rotativo */}
          <div className="bg-slate-950 border border-red-800/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-red-400 font-bold mb-2">
                <span>Cenário 1: Rotativo ({rotativoRate}% a.m.)</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {formatBRL(rotativoSim.interest)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Juros em apenas 30 dias</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
              Total a pagar no mês seguinte: <strong className="text-white">{formatBRL(rotativoSim.total)}</strong>
              {rotativoSim.isCapped && (
                <div className="text-[10px] text-amber-400 mt-1">
                  * Limitado pelo teto legal de 100% (Lei 14.690/23)
                </div>
              )}
            </div>
          </div>

          {/* 2. Parcelamento */}
          <div className="bg-slate-950 border border-sky-800/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-sky-400 font-bold mb-2">
                <span>Cenário 2: Parcelamento ({parceladoRate}% a.m.)</span>
              </div>
              <div className="text-2xl font-bold text-sky-400">
                12x {formatBRL(parceladoSim.installmentValue)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Total Juros: {formatBRL(parceladoSim.totalInterest)}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
              Total Pago ao final: <strong className="text-white">{formatBRL(parceladoSim.totalPaid)}</strong>
            </div>
          </div>

          {/* 3. Empréstimo */}
          <div className="bg-slate-950 border border-emerald-800/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                <span>Cenário 3: Crédito Pessoal ({emprestimoRate}% a.m.)</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                12x {formatBRL(emprestimoSim.installmentValue)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Total Juros: {formatBRL(emprestimoSim.totalInterest)}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-emerald-300 font-semibold">
              Economia vs. Rotativo: {formatBRL(rotativoSim.interest * 6 - emprestimoSim.totalInterest)}
            </div>
          </div>
        </div>

        {/* Bank insight note */}
        <div className="mt-5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Dica FinPlan IA para o {bankData.bank}: </strong>
            {bankData.dicaEspecial}
          </div>
        </div>
      </div>

      {/* Legal Protections */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          Seus Direitos & Legislação Bancária Vigente (2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300">{LEGISLATION_INFO.tetoJuros100.title}</h4>
            <p className="text-xs text-slate-400">{LEGISLATION_INFO.tetoJuros100.description}</p>
            <div className="text-[11px] text-emerald-400 font-medium pt-2 border-t border-slate-800/80">
              💡 {LEGISLATION_INFO.tetoJuros100.impact}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300">{LEGISLATION_INFO.portabilidadeGratuita.title}</h4>
            <p className="text-xs text-slate-400">{LEGISLATION_INFO.portabilidadeGratuita.description}</p>
            <div className="text-[11px] text-emerald-400 font-medium pt-2 border-t border-slate-800/80">
              💡 {LEGISLATION_INFO.portabilidadeGratuita.impact}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300">{LEGISLATION_INFO.descontoAntecipacao.title}</h4>
            <p className="text-xs text-slate-400">{LEGISLATION_INFO.descontoAntecipacao.description}</p>
            <div className="text-[11px] text-emerald-400 font-medium pt-2 border-t border-slate-800/80">
              💡 {LEGISLATION_INFO.descontoAntecipacao.impact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

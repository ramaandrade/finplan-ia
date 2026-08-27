import React, { useState } from 'react';
import { X, Save, RefreshCw, Info, Check, ShieldCheck, CreditCard, Banknote, Building } from 'lucide-react';
import { BACEN_BENCHMARKS } from '../data/bankRatesDatabase';

export default function BankDataModal({
  isOpen,
  onClose,
  banks,
  onEditBanks
}) {
  if (!isOpen) return null;

  const [selectedBankId, setSelectedBankId] = useState(banks[0]?.id || 'bradesco');
  const [localBanks, setLocalBanks] = useState(banks);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentBank = localBanks.find(b => b.id === selectedBankId) || localBanks[0];

  const handleFieldChange = (field, value) => {
    setLocalBanks(prev => prev.map(b => b.id === selectedBankId ? { ...b, [field]: value } : b));
  };

  const handleApplyBacenAverages = () => {
    setLocalBanks(prev => prev.map(b => {
      if (b.id === selectedBankId) {
        return {
          ...b,
          rotativoRate: BACEN_BENCHMARKS.rotativo.avgRateMonthly,
          parcelamentoRate: BACEN_BENCHMARKS.parcelamentoCartao.avgRateMonthly,
          chequeEspecialRate: BACEN_BENCHMARKS.chequeSpecial.avgRateMonthly,
          loanRate: b.loanRate ? BACEN_BENCHMARKS.emprestimoPessoal.avgRateMonthly : undefined
        };
      }
      return b;
    }));
  };

  const handleSave = () => {
    onEditBanks(localBanks);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Auditoria de Dados Bancários</h2>
              <p className="text-xs text-slate-400">Consulte ou ajuste os limites, taxas de juros e contratos nos seus 3 bancos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bank selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {localBanks.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBankId(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                  selectedBankId === b.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{b.name}</span>
              </button>
            ))}
          </div>

          {/* Bank details and inputs */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentBank.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentBank.type}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentBank.notes}</p>
              </div>

              <button
                onClick={handleApplyBacenAverages}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
                title="Substituir taxas informadas pelas médias oficiais do Bacen"
              >
                <RefreshCw className="w-3 h-3 text-indigo-400" />
                Preencher Médias Bacen
              </button>
            </div>

            {/* Rates and limits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Taxa do Rotativo do Cartão (% a.m.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={currentBank.rotativoRate || 0}
                    onChange={(e) => handleFieldChange('rotativoRate', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">% a.m.</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Média Bacen: 14.85% a.m.</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Taxa de Parcelamento de Fatura (% a.m.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={currentBank.parcelamentoRate || 0}
                    onChange={(e) => handleFieldChange('parcelamentoRate', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">% a.m.</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Média Bacen: 5.15% a.m.</span>
              </div>

              {currentBank.chequeEspecialRate !== undefined && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Taxa Cheque Especial (% a.m.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={currentBank.chequeEspecialRate || 8.0}
                      onChange={(e) => handleFieldChange('chequeEspecialRate', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">% a.m.</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Teto CMN/Bacen: 8.00% a.m.</span>
                </div>
              )}

              {currentBank.loanRate !== undefined && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Taxa do Empréstimo Pessoal (% a.m.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      value={currentBank.loanRate || 0}
                      onChange={(e) => handleFieldChange('loanRate', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">% a.m.</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Parcela Atual: R$ {currentBank.loanInstallmentValue?.toFixed(2)} ({currentBank.loanRemainingInstallments} restantes)
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Limite Total do Cartão (R$)
                </label>
                <input
                  type="number"
                  value={currentBank.cardLimit || 0}
                  onChange={(e) => handleFieldChange('cardLimit', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Dia de Vencimento da Fatura
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={currentBank.cardDueDay || 10}
                  onChange={(e) => handleFieldChange('cardDueDay', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Legal alert */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Proteção Legal Aplicada (Lei 14.690/2023)</p>
              <p>
                Os cálculos do FinPlan IA respeitam automaticamente o teto de 100% de juros no rotativo e no parcelado do cartão. Nenhum banco pode cobrar juros acumulados superiores ao saldo original.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Fechar
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {saveSuccess ? 'Dados Atualizados!' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { getNegotiationTemplates } from '../data/negotiationTemplates';
import { Copy, Check, ShieldCheck, MessageSquare, PhoneCall, Building2 } from 'lucide-react';

export default function NegotiationScripts({ expenses = [], banks = [], incomes = [] }) {
  const [copiedId, setCopiedId] = useState(null);
  const templates = getNegotiationTemplates(expenses, banks, incomes);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Modelos e Scripts de Negociação Bancária</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Textos atualizados em tempo real com seus saldos e dívidas para copiar e colar no chat ou app dos seus bancos.
            </p>
          </div>
        </div>
      </div>

      {/* Script Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {item.bank}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.target}</span>
                </div>
                <button
                  onClick={() => handleCopy(item.id, item.script)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-sm"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === item.id ? 'Copiado!' : 'Copiar Script'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>

              <div className="text-[11px] text-slate-400 mb-3 space-y-1">
                <div><strong>Canal Ideal:</strong> {item.channel}</div>
                <div><strong>Base Legal:</strong> <span className="text-indigo-400">{item.legalBasis}</span></div>
              </div>

              {/* Script Box */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                {item.script}
              </div>
            </div>

            <div className="text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
              💡 <strong>Dica Tática:</strong> {item.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

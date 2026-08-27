import React, { useState, useEffect } from 'react';
import { AI_AGENTS, getDiagnosticPanel, answerUserQuestion, callGeminiApi } from '../services/aiAgentsEngine';
import { Sparkles, MessageSquare, Send, CheckCircle2, ShieldCheck, HelpCircle, Bot, Key, Settings, Loader2, RefreshCw } from 'lucide-react';

export default function AiAdvisorPanel({ incomes = [], expenses = [], banks = [] }) {
  const diagnostics = getDiagnosticPanel(incomes, expenses, banks);
  const [selectedAgentId, setSelectedAgentId] = useState('estrategista');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('finplan_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiKey);
  const [isLoading, setIsLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      agentName: 'Dr. Marcelo Carvalho',
      agentRole: 'Estrategista Chefe de Dívidas',
      text: 'Olá! Sou o Dr. Marcelo Carvalho. Analisei os valores atuais do seu orçamento nos 3 bancos (Bradesco, Nubank, C6) e Mercado Pago. Pode me fazer qualquer pergunta específica (ex: "como pagar o Bradesco?", "qual a melhor ordem de quitação?", "como sair do vermelho?") que farei a análise matemática detalhada dos seus dados!'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsLoading(true);

    try {
      if (geminiKey.trim()) {
        // Live Gemini API
        const llmResponse = await callGeminiApi(geminiKey, text, incomes, expenses, banks);
        const aiMsg = {
          sender: 'ai',
          agentName: 'FinPlan IA (Gemini 1.5 Live)',
          agentRole: 'Consultor Financeiro Conectado',
          text: llmResponse
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        // Advanced Local Financial Solver
        const aiResult = answerUserQuestion(text, incomes, expenses, banks);
        const aiMsg = {
          sender: 'ai',
          agentName: aiResult.agentName,
          agentRole: aiResult.agentRole,
          text: aiResult.response
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
      // Fallback to local solver on error
      const aiResult = answerUserQuestion(text, incomes, expenses, banks);
      const aiMsg = {
        sender: 'ai',
        agentName: aiResult.agentName,
        agentRole: aiResult.agentRole,
        text: `⚠️ (Nota da API: ${err.message}. Exibindo diagnóstico do motor local:)\n\n${aiResult.response}`
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Qual a melhor estratégia para pagar o Bradesco?',
    'Qual a melhor ordem para quitar todas as minhas dívidas?',
    'Como sair do vermelho nos meses de déficit?',
    'Vale a pena antecipar as parcelas do Nubank?',
    'Como fica meu fluxo de caixa e reserva em 2027?'
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Comitê de Agentes de IA Especialistas</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Motor de raciocínio financeiro que analisa especificamente cada pergunta sobre o seu orçamento real.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setTempKey(geminiKey);
              setShowKeyModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all shadow-sm shrink-0"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            {geminiKey ? 'Chave Gemini Ativa ✓' : 'Conectar Chave Gemini (Opcional)'}
          </button>
        </div>
      </div>

      {/* 4 Agent Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AI_AGENTS.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${agent.bgColor} ${
              selectedAgentId === agent.id ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{agent.avatar}</span>
              <div>
                <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                <p className={`text-[10px] font-semibold ${agent.textColor}`}>{agent.role}</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 font-medium mb-3">
              Especialidade: <span className="text-white">{agent.specialty}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
              "{agent.philosophy}"
            </p>
          </div>
        ))}
      </div>

      {/* Diagnostics and Action Plan */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Pareceres Técnicos & Diagnósticos em Tempo Real
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostics.map((diag, idx) => {
            const agent = AI_AGENTS.find(a => a.id === diag.agentId);
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{agent.avatar}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{diag.title}</h4>
                      <p className={`text-[10px] font-medium ${agent.textColor}`}>
                        {agent.name} ({agent.role})
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-3">
                    {diag.summary}
                  </p>
                  <div className="space-y-2">
                    {diag.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Consultation Chat with AI Agents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Sala de Consulta & Análise de Perguntas</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {geminiKey ? 'Modo: Gemini 1.5 Flash (Conectado)' : 'Modo: Motor de Raciocínio Financeiro Nativo'}
          </span>
        </div>

        {/* Quick sample prompt buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              {q}
            </button>
          ))}
        </div>

        {/* Messages container */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-96 overflow-y-auto space-y-4 mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'ai' && (
                <span className="text-[10px] text-indigo-400 font-semibold mb-1 flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  {msg.agentName} • {msg.agentRole}
                </span>
              )}
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 italic py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>O Agente está analisando seu orçamento e calculando a melhor resposta...</span>
            </div>
          )}
        </div>

        {/* Chat input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Faça qualquer pergunta sobre seu orçamento (ex: qual a melhor estratégia para o Bradesco?)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Analisar</span>
          </button>
        </form>
      </div>

      {/* Modal to configure Gemini API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Configurar Chave Google Gemini API</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              O aplicativo já possui um <strong>motor de IA e raciocínio financeiro local completo</strong>. Se desejar, você pode inserir sua chave gratuita do <strong>Google Gemini API</strong> para respostas generativas ainda mais amplas.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Chave Gemini API (AI Studio)</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setTempKey('');
                  setGeminiKey('');
                  localStorage.removeItem('finplan_gemini_key');
                  setShowKeyModal(false);
                }}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Remover Chave
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setGeminiKey(tempKey.trim());
                    localStorage.setItem('finplan_gemini_key', tempKey.trim());
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md"
                >
                  Salvar Chave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

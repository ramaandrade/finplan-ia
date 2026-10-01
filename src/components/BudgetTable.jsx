import React, { useState } from 'react';
import { formatBRL } from '../services/financialMath';
import { parseBrazilianNumber } from '../services/storageService';
import { Plus, Trash2, RefreshCw, AlertTriangle, CheckCircle2, Filter, ArrowUpRight, CreditCard, Copy, Calendar, Pencil, Edit3, X, Check, PlusCircle, ChevronUp, ChevronDown, Layers } from 'lucide-react';

function EditableCell({
  value = 0,
  onSave,
  isIncome = false,
  isPaid = false,
  onTogglePaid
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseBrazilianNumber(val);
    onSave(parsed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setVal(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        inputMode="decimal"
        autoFocus
        onFocus={(e) => e.target.select()}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-28 bg-slate-950 text-emerald-300 font-mono text-xs font-bold px-2 py-1 rounded-lg border-2 border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-right shadow-2xl"
        placeholder="0,00"
      />
    );
  }

  const num = Number(value) || 0;
  if (num === 0) {
    return (
      <div
        onClick={() => {
          setVal(value || '');
          setIsEditing(true);
        }}
        className="cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors font-mono text-xs font-semibold text-slate-600 hover:text-slate-400 inline-block"
        title="Clique para definir valor"
      >
        -
      </div>
    );
  }

  if (isIncome) {
    return (
      <div
        onClick={() => {
          setVal(value);
          setIsEditing(true);
        }}
        className="cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors font-mono text-xs font-bold text-emerald-400 inline-block border border-transparent hover:border-slate-700"
        title="Clique para editar valor"
      >
        {formatBRL(num)}
      </div>
    );
  }

  return (
    <div
      className={`group inline-flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all border ${
        isPaid
          ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-sm shadow-emerald-950/50'
          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onTogglePaid) onTogglePaid();
        }}
        className={`p-0.5 rounded-md transition-all ${
          isPaid
            ? 'text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/60'
            : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800 opacity-60 group-hover:opacity-100'
        }`}
        title={isPaid ? 'Conta PAGA ✓ (Clique para desmarcar)' : 'Clique para marcar como PAGA ✓'}
      >
        {isPaid ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 hover:border-emerald-400" />
        )}
      </button>

      <span
        onClick={() => {
          setVal(value);
          setIsEditing(true);
        }}
        className={`cursor-pointer font-mono text-xs font-semibold ${
          isPaid ? 'text-emerald-300 font-bold' : 'text-slate-100 hover:text-indigo-300'
        }`}
        title="Clique no número para editar valor"
      >
        {formatBRL(num)}
      </span>
    </div>
  );
}

function EditableText({ value = '', onSave, placeholder = 'Nome do item...', className = '' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  React.useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() && text !== value) {
      onSave(text.trim());
    } else {
      setText(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        autoFocus
        onFocus={(e) => e.target.select()}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-slate-950 text-white font-semibold text-xs px-2.5 py-1 rounded-lg border-2 border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-2xl"
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setText(value);
        setIsEditing(true);
      }}
      className={`group cursor-pointer flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-slate-800/80 transition-colors ${className}`}
      title="Clique no texto para editar a descrição"
    >
      <span className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">{value}</span>
      <Pencil className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}

export default function BudgetTable({
  visibleMonths,
  allMonths,
  selectedYear,
  onSelectYear,
  incomes,
  expenses,
  onUpdateIncome,
  onUpdateExpense,
  onUpdateExpenseDetails,
  onUpdateIncomeDetails,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  onReset,
  onReplicateDecTo2027,
  onMoveExpense,
  onGroupVehicles,
  banks,
  paidStatus = {},
  onTogglePaid
}) {
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [selectedBankFilter, setSelectedBankFilter] = useState('TODOS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('expense'); // 'expense' or 'income'
  const [replicateSuccess, setReplicateSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Item to edit in modal

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Moradia',
    bank: 'Outros',
    isDebt: false,
    value: 0,
    note: ''
  });

  const incomeTotalsByMonth = visibleMonths.reduce((acc, m) => {
    acc[m.id] = incomes.reduce((sum, i) => sum + (Number(i.values?.[m.id]) || 0), 0);
    return acc;
  }, {});

  const expenseTotalsByMonth = visibleMonths.reduce((acc, m) => {
    acc[m.id] = expenses.reduce((sum, e) => sum + (Number(e.values?.[m.id]) || 0), 0);
    return acc;
  }, {});

  const netBalancesByMonth = visibleMonths.reduce((acc, m) => {
    acc[m.id] = (incomeTotalsByMonth[m.id] || 0) - (expenseTotalsByMonth[m.id] || 0);
    return acc;
  }, {});

  const categories = ['TODAS', 'Reserva de Emergência', 'Cartão de Crédito', 'Empréstimos', 'Cheque Especial', 'Moradia', 'Veículos', 'Família', 'Investimentos', 'Telecom', 'Educação', 'Assinaturas', 'Lazer', 'Imóveis', 'Doações', 'Profissional'];

  const filteredExpenses = expenses.filter(e => {
    const matchCat = selectedCategory === 'TODAS' || e.category === selectedCategory;
    const matchBank = selectedBankFilter === 'TODOS' || e.bank === selectedBankFilter;
    return matchCat && matchBank;
  });

  const handleReplicateClick = () => {
    onReplicateDecTo2027();
    setReplicateSuccess(true);
    setTimeout(() => setReplicateSuccess(false), 2500);
  };

  const handleOpenAddModal = (type = 'expense') => {
    setAddModalType(type);
    setNewItem({
      name: '',
      category: type === 'expense' ? 'Moradia' : 'Receita',
      bank: 'Outros',
      isDebt: false,
      value: 0,
      note: ''
    });
    setShowAddModal(true);
  };

  const handleDeleteExpenseConfirm = (exp) => {
    if (window.confirm(`Deseja realmente remover a despesa "${exp.name}" do orçamento?`)) {
      onDeleteExpense(exp.id);
    }
  };

  const handleDeleteIncomeConfirm = (inc) => {
    if (window.confirm(`Deseja realmente remover a receita "${inc.name}" do orçamento?`)) {
      onDeleteIncome(inc.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Notification Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                Gerenciamento Completo de Despesas, Receitas & Valores
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60">
                  <CheckCircle2 className="w-3 h-3" /> Salvamento Automático Ativo
                </span>
                <p className="text-xs text-slate-400">
                  Acrescente novas contas pelo botão <strong>+ Nova Despesa</strong>, exclua itens no ícone da <strong>lixeira</strong> ou edite valores.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenAddModal('expense')}
              className="flex items-center gap-1.5 px-3 py-1.75 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Nova Despesa
            </button>
            <button
              onClick={() => handleOpenAddModal('income')}
              className="flex items-center gap-1.5 px-3 py-1.75 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              + Nova Receita
            </button>
            <button
              onClick={handleReplicateClick}
              className="flex items-center gap-1.5 px-3 py-1.75 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg shadow-sm transition-all"
              title="Copiar os valores de DEZ/2026 para todos os 12 meses de 2027"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              {replicateSuccess ? 'DEZ/26 Replicado!' : 'Replicar DEZ/26 ➔ 2027'}
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.75 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 rounded-lg border border-slate-700 transition-all"
              title="Restaurar valores da planilha original"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restaurar
            </button>
          </div>
        </div>
      </div>

      {/* Year and Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Ano:
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => onSelectYear('2026')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${selectedYear === '2026' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2026 (4 Meses)
            </button>
            <button
              onClick={() => onSelectYear('2027')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${selectedYear === '2027' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2027 (12 Meses)
            </button>
            <button
              onClick={() => onSelectYear('ALL')}
              className={`px-2.5 py-1 text-xs font-bold rounded ${selectedYear === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Visão Completa (16M)
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categoria:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[0.75rem] font-medium rounded-md transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bank dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Banco:</span>
          <select
            value={selectedBankFilter}
            onChange={(evt) => setSelectedBankFilter(evt.target.value)}
            className="bg-slate-950 text-slate-200 text-xs rounded-md border border-slate-700 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos os Bancos</option>
            <option value="Nubank">Nubank</option>
            <option value="Bradesco">Bradesco</option>
            <option value="C6 Bank">C6 Bank</option>
            <option value="Mercado Pago">Mercado Pago</option>
            <option value="Credi Shop">Credi Shop</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <button
          onClick={onGroupVehicles}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-md border border-slate-700 transition-colors shadow-sm"
          title="Agrupar todos os IPVAs e Licenciamentos juntos na tabela"
        >
          <Layers className="w-3.5 h-3.5" />
          Agrupar IPVAs & Licenciamento
        </button>
      </div>

      {/* Main Budget Grid */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-max">
            <thead className="bg-slate-950/90 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold sticky left-0 bg-slate-950 z-20 min-w-[280px]">
                  ITEM / DESCRIÇÃO (🗑️ Excluir • ✍️ Editar)
                </th>
                {visibleMonths.map(m => (
                  <th key={m.id} className="py-3 px-3 font-semibold text-right min-w-[120px]">
                    {m.label}
                  </th>
                ))}
                <th className="py-3 px-3 font-semibold text-center w-24">Ações</th>
              </tr>
            </thead>

            <tbody>
              {/* Incomes Header */}
              <tr className="bg-emerald-950/40 border-b border-emerald-800/40">
                <td className="py-2.5 px-4 font-bold text-emerald-300 text-xs uppercase tracking-wider sticky left-0 bg-emerald-950/90 z-10">
                  <div className="flex items-center justify-between">
                    <span>RECEITAS (Entradas)</span>
                    <button
                      onClick={() => handleOpenAddModal('income')}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova Receita
                    </button>
                  </div>
                </td>
                <td colSpan={visibleMonths.length + 1} className="py-2.5 px-3"></td>
              </tr>

              {/* Incomes List */}
              {incomes.map((inc) => (
                <tr key={inc.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 sticky left-0 bg-slate-900/95 z-10 border-r border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <button
                          onClick={() => handleDeleteIncomeConfirm(inc)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-950/50 transition-colors shrink-0"
                          title="Excluir esta receita"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
                        </button>
                        <EditableText
                          value={inc.name}
                          onSave={(newName) => onUpdateIncomeDetails(inc.id, { name: newName })}
                          placeholder="Nome da receita..."
                        />
                        {inc.note && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 shrink-0 truncate max-w-[120px]">
                            {inc.note}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingItem({ ...inc, isIncome: true })}
                        className="text-slate-500 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
                        title="Editar detalhes da receita"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  {visibleMonths.map(m => (
                    <td key={m.id} className="py-2.5 px-3 text-right">
                      <EditableCell
                        value={inc.values?.[m.id]}
                        onSave={(nval) => onUpdateIncome(inc.id, m.id, nval)}
                        isIncome={true}
                      />
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingItem({ ...inc, isIncome: true })}
                        className="text-slate-400 hover:text-indigo-300 p-1.5 rounded hover:bg-slate-800 transition-colors"
                        title="Editar detalhes da receita"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteIncomeConfirm(inc)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
                        title="Excluir receita"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Incomes */}
              <tr className="bg-slate-950 font-bold border-b-2 border-slate-700">
                <td className="py-3 px-4 text-slate-200 sticky left-0 bg-slate-950 z-10">
                  TOTAL RECEITAS
                </td>
                {visibleMonths.map(m => (
                  <td key={m.id} className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {formatBRL(incomeTotalsByMonth[m.id])}
                  </td>
                ))}
                <td className="py-3 px-3"></td>
              </tr>

              {/* Expenses Header */}
              <tr className="bg-rose-950/30 border-b border-rose-800/40">
                <td className="py-2.5 px-4 font-bold text-rose-300 text-xs uppercase tracking-wider sticky left-0 bg-rose-950/90 z-10">
                  <div className="flex items-center justify-between">
                    <span>DESPESAS (Gastos, Cartões & Dívidas)</span>
                    <button
                      onClick={() => handleOpenAddModal('expense')}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-rose-100 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700/60 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova Despesa
                    </button>
                  </div>
                </td>
                <td colSpan={visibleMonths.length + 1} className="py-2.5 px-3"></td>
              </tr>

              {/* Expenses List */}
              {filteredExpenses.map(exp => (
                <tr 
                  key={exp.id} 
                  className={`border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors ${exp.isDebt ? 'bg-slate-900/40' : ''}`}
                >
                  <td className="py-2 px-3 sticky left-0 bg-slate-900/95 z-10 border-r border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <button
                          onClick={() => handleDeleteExpenseConfirm(exp)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-950/50 transition-colors shrink-0"
                          title="Excluir esta despesa"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
                        </button>
                        <EditableText
                          value={exp.name}
                          onSave={(newName) => onUpdateExpenseDetails(exp.id, { name: newName })}
                          placeholder="Nome da despesa..."
                        />
                        {exp.isDebt && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800 shrink-0">
                            <CreditCard className="w-2.5 h-2.5" />
                            {exp.bank}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {exp.category === 'Reserva de Emergência' ? (
  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 font-bold shrink-0">
    🛡️ Reserva
  </span>
) : (
  <span className="text-[10px] text-slate-500 hidden sm:inline">{exp.category}</span>
)}
                        <button
                          onClick={() => setEditingItem({ ...exp, isIncome: false })}
                          className="text-slate-500 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Editar nome, categoria e banco"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  {visibleMonths.map(m => (
                    <td key={m.id} className="py-2.5 px-3 text-right">
                      <EditableCell
                        value={exp.values?.[m.id]}
                        onSave={(nval) => onUpdateExpense(exp.id, m.id, nval)}
                        isIncome={false}
                        isPaid={Boolean(paidStatus[`${exp.id}_${m.id}`])}
                        onTogglePaid={() => onTogglePaid && onTogglePaid(exp.id, m.id)}
                      />
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingItem({ ...exp, isIncome: false })}
                        className="text-slate-400 hover:text-indigo-300 p-1.5 rounded hover:bg-slate-800 transition-colors"
                        title="Editar nome, categoria e banco"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpenseConfirm(exp)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
                        title="Excluir despesa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Expenses */}
              <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                <td className="py-3 px-4 text-slate-200 sticky left-0 bg-slate-950 z-10">
                  TOTAL DESPESAS
                </td>
                {visibleMonths.map(m => (
                  <td key={m.id} className="py-3 px-3 text-right text-rose-400 font-bold">
                    {formatBRL(expenseTotalsByMonth[m.id])}
                  </td>
                ))}
                <td className="py-3 px-3"></td>
              </tr>

              {/* Net Cash Flow */}
              <tr className="bg-indigo-950/40 font-bold border-t border-indigo-800">
                <td className="py-3 px-4 text-white flex items-center gap-2 sticky left-0 bg-slate-950 z-10">
                  <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  RESULTADO LÍQUIDO (Entradas - Saídas)
                </td>
                {visibleMonths.map(m => {
                  const net = netBalancesByMonth[m.id] || 0;
                  return (
                    <td 
                      key={m.id} 
                      className={`py-3 px-3 text-right font-black text-sm ${net < 0 ? 'text-rose-400' : 'text-emerald-400'}`}
                    >
                      {formatBRL(net)}
                    </td>
                  );
                })}
                <td className="py-3 px-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-400" />
                Editar Informações de ${editingItem.isIncome ? 'Receita' : 'Despesa'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {addModalType === 'expense' && (
                <div className="flex items-center gap-2 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNewItem({
                        name: 'Aporte Reserva de Emergência (CDB 100% CDI)',
                        category: 'Reserva de Emergência',
                        bank: 'Nubank',
                        isDebt: false,
                        value: 500,
                        note: 'Investido a 100% do CDI com liquidez diária'
                      });
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-sm"
                  >
                    🛡️ Modelo Rápido: Reserva de Emergência
                  </button>
                </div>
              )}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome / Descrição</label>
                <input
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {!editingItem.isIncome && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Categoria</label>
                      <select
                        value={editingItem.category || 'Moradia'}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        {categories.filter(c => c !== 'TODAS').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Banco / Origem</label>
                      <select
                        value={editingItem.bank || 'Outros'}
                        onChange={(e) => setEditingItem({ ...editingItem, bank: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Outros">Outros</option>
                        <option value="Bradesco">Bradesco</option>
                        <option value="Nubank">Nubank</option>
                        <option value="C6 Bank">C6 Bank</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                        <option value="Credi Shop">Credi Shop</option>
                        <option value="Transferência">Transferência</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="editIsDebt"
                      checked={!!editingItem.isDebt}
                      onChange={(e) => setEditingItem({ ...editingItem, isDebt: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                    />
                    <label htmlFor="editIsDebt" className="text-xs text-slate-300 cursor-pointer">
                      É uma dívida / fatura de cartão / empréstimo com juros?
                    </label>
                  </div>
                </>
              )}

              {editingItem.isIncome && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Observação / Nota</label>
                  <input
                    type="text"
                    value={editingItem.note || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                    placeholder="Ex: Margem líquida liberada..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (editingItem.isIncome) {
                    onUpdateIncomeDetails(editingItem.id, {
                      name: editingItem.name,
                      note: editingItem.note
                    });
                  } else {
                    onUpdateExpenseDetails(editingItem.id, {
                      name: editingItem.name,
                      category: editingItem.category,
                      bank: editingItem.bank,
                      isDebt: editingItem.isDebt
                    });
                  }
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to add item (Expense or Income) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {addModalType === 'expense' ? 'Acrescentar Nova Despesa' : 'Acrescentar Nova Receita'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector pill */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAddModalType('expense')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  addModalType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Despesa / Gasto
              </button>
              <button
                type="button"
                onClick={() => setAddModalType('income')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  addModalType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Receita / Entrada
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome / Descrição</label>
                <input
                  type="text"
                  placeholder={addModalType === 'expense' ? 'Ex: Seguro Auto, Academia, Curso...' : 'Ex: Freelance, Aluguel, Rendimentos...'}
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {addModalType === 'expense' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Categoria</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {categories.filter(c => c !== 'TODAS').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Banco / Origem</label>
                    <select
                      value={newItem.bank}
                      onChange={(e) => setNewItem({ ...newItem, bank: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Outros">Outros</option>
                      <option value="Bradesco">Bradesco</option>
                      <option value="Nubank">Nubank</option>
                      <option value="C6 Bank">C6 Bank</option>
                      <option value="Mercado Pago">Mercado Pago</option>
                      <option value="Credi Shop">Credi Shop</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Valor Mensal Base (R$)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newItem.value || ''}
                  onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              {addModalType === 'expense' ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDebt"
                    checked={newItem.isDebt}
                    onChange={(e) => setNewItem({ ...newItem, isDebt: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                  />
                  <label htmlFor="isDebt" className="text-xs text-slate-300 cursor-pointer">
                    É uma dívida / fatura de cartão / empréstimo com juros?
                  </label>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nota / Observação</label>
                  <input
                    type="text"
                    placeholder="Ex: Renda extra mensal..."
                    value={newItem.note}
                    onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newItem.name.trim()) return;
                  const newValues = {};
                  allMonths.forEach(m => {
                    newValues[m.id] = newItem.value || 0;
                  });

                  if (addModalType === 'expense') {
                    onAddExpense({
                      id: 'custom_exp_' + Date.now(),
                      name: newItem.name.trim(),
                      category: newItem.category,
                      bank: newItem.bank,
                      isDebt: newItem.isDebt,
                      values: newValues
                    });
                  } else {
                    onAddIncome({
                      id: 'custom_inc_' + Date.now(),
                      name: newItem.name.trim(),
                      note: newItem.note.trim(),
                      values: newValues
                    });
                  }
                  setShowAddModal(false);
                }}
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md"
              >
                Adicionar {addModalType === 'expense' ? 'Despesa' : 'Receita'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

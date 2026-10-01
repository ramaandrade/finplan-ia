import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BudgetTable from './components/BudgetTable';
import BankDataModal from './components/BankDataModal';
import RatesComparator from './components/RatesComparator';
import AiAdvisorPanel from './components/AiAdvisorPanel';
import DebtStrategySim from './components/DebtStrategySim';
import NegotiationScripts from './components/NegotiationScripts';
import CashFlowProjection from './components/CashFlowProjection';
import { safeStorage } from './services/storageService';
import { 
  MONTHS_2026, 
  MONTHS_2027, 
  ALL_MONTHS, 
  populate2027Values, 
  INITIAL_BANKS, 
  INITIAL_INCOMES, 
  INITIAL_EXPENSES 
} from './data/initialBudgetData';
import { LayoutGrid, Target, Scale, Bot, MessageSquare, TrendingUp, ExternalLink } from 'lucide-react';




export const groupVehiclesTogether = (expenses) => {
  if (!Array.isArray(expenses)) return [];

  const isIpva = (e) => (e.name && e.name.toLowerCase().includes('ipva')) || (e.id && e.id.toLowerCase().includes('ipva'));
  const isLicenciamento = (e) => (e.name && e.name.toLowerCase().includes('licenciamento')) || (e.id && e.id.toLowerCase().includes('licenciamento'));

  const ipvaItems = expenses.filter(isIpva);
  const licenciamentoItems = expenses.filter(isLicenciamento);
  const otherItems = expenses.filter(e => !isIpva(e) && !isLicenciamento(e));

  const vehicleSortOrder = ['mobi', 'c3', 'shineray', 'hb20'];
  const getVehicleRank = (name = '') => {
    const n = name.toLowerCase();
    const idx = vehicleSortOrder.findIndex(v => n.includes(v));
    return idx === -1 ? 99 : idx;
  };

  ipvaItems.sort((a, b) => getVehicleRank(a.name) - getVehicleRank(b.name));
  licenciamentoItems.sort((a, b) => getVehicleRank(a.name) - getVehicleRank(b.name));

  const firstVehicleIndex = expenses.findIndex(e => isIpva(e) || isLicenciamento(e));
  const insertIndex = firstVehicleIndex === -1 ? otherItems.length : firstVehicleIndex;

  const result = [...otherItems];
  result.splice(insertIndex, 0, ...ipvaItems, ...licenciamentoItems);

  return result;
};

export default function App() {
  const [selectedYear, setSelectedYear] = useState(() => safeStorage.get('finplan_selected_year', '2027'));
  const [selectedMonth, setSelectedMonth] = useState(() => safeStorage.get('finplan_selected_month', 'JAN_27'));

  useEffect(() => {
    safeStorage.set('finplan_selected_year', selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    safeStorage.set('finplan_selected_month', selectedMonth);
  }, [selectedMonth]);
  const [activeTab, setActiveTab] = useState('orcamento');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Incomes state
  const [incomes, setIncomes] = useState(() => {
    const saved = safeStorage.get('finplan_incomes_v2');
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved.map(i => ({ ...i, values: populate2027Values(i.values) }));
    }
    const oldSaved = safeStorage.get('finplan_incomes_v1');
    if (oldSaved && Array.isArray(oldSaved) && oldSaved.length > 0) {
      return oldSaved.map(i => ({ ...i, values: populate2027Values(i.values) }));
    }
    return INITIAL_INCOMES;
  });

  // Expenses state
  const [expenses, setExpenses] = useState(() => {
    const saved = safeStorage.get('finplan_expenses_v2');
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return groupVehiclesTogether(saved.map(e => ({ ...e, values: populate2027Values(e.values) })));
    }
    const oldSaved = safeStorage.get('finplan_expenses_v1');
    if (oldSaved && Array.isArray(oldSaved) && oldSaved.length > 0) {
      return groupVehiclesTogether(oldSaved.map(e => ({ ...e, values: populate2027Values(e.values) })));
    }
    return INITIAL_EXPENSES;
  });

  
  // Paid status state: { [expenseId_monthId]: boolean }
  const [paidStatus, setPaidStatus] = useState(() => {
    return safeStorage.get('finplan_paid_status_v1', {});
  });

  useEffect(() => {
    safeStorage.set('finplan_paid_status_v1', paidStatus);
  }, [paidStatus]);

  const handleTogglePaid = (expenseId, monthId) => {
    const key = `${expenseId}_${monthId}`;
    setPaidStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const [banks, setBanks] = useState(() => {
    const saved = safeStorage.get('finplan_banks_v2') || safeStorage.get('finplan_banks_v1');
    return (saved && Array.isArray(saved) && saved.length > 0) ? saved : INITIAL_BANKS;
  });

  const [lastSavedTime, setLastSavedTime] = useState(null);

  useEffect(() => {
    safeStorage.set('finplan_incomes_v2', incomes);
    setLastSavedTime(new Date().toLocaleTimeString());
  }, [incomes]);

  useEffect(() => {
    safeStorage.set('finplan_expenses_v2', expenses);
    setLastSavedTime(new Date().toLocaleTimeString());
  }, [expenses]);

  useEffect(() => {
    safeStorage.set('finplan_banks_v2', banks);
    setLastSavedTime(new Date().toLocaleTimeString());
  }, [banks]);

  // Determine visible months based on selectedYear
  const visibleMonths = selectedYear === '2026'
    ? MONTHS_2026
    : selectedYear === '2027'
    ? MONTHS_2027
    : ALL_MONTHS;

  const currentMonthId = selectedMonth === 'ALL'
    ? visibleMonths[0].id
    : visibleMonths.some(m => m.id === selectedMonth)
    ? selectedMonth
    : visibleMonths[0].id;

  const totalIncome = selectedMonth === 'ALL'
    ? (incomes.reduce((sum, i) => sum + visibleMonths.reduce((a, m) => a + (Number(i.values?.[m.id]) || 0), 0), 0) / visibleMonths.length)
    : incomes.reduce((sum, i) => sum + (Number(i.values?.[currentMonthId]) || 0), 0);

  const totalExpenses = selectedMonth === 'ALL'
    ? (expenses.reduce((sum, e) => sum + visibleMonths.reduce((a, m) => a + (Number(e.values?.[m.id]) || 0), 0), 0) / visibleMonths.length)
    : expenses.reduce((sum, e) => sum + (Number(e.values?.[currentMonthId]) || 0), 0);

  const netBalance = totalIncome - totalExpenses;

  const totalDebts = expenses
    .filter(e => e.isDebt)
    .reduce((sum, e) => sum + (Number(e.values?.[currentMonthId]) || 0), 0);

  const handleUpdateIncome = (id, monthId, value) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, values: { ...i.values, [monthId]: value } } : i));
  };

  const handleUpdateExpense = (id, monthId, value) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, values: { ...e.values, [monthId]: value } } : e));
  };

  const handleUpdateIncomeDetails = (id, updatedFields) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updatedFields } : i));
  };

  const handleUpdateExpenseDetails = (id, updatedFields) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  
  const handleMoveExpense = (id, direction) => {
    setExpenses(prev => {
      const index = prev.findIndex(e => e.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const item = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = item;
      return copy;
    });
  };

  const handleGroupIpvas = () => {
    setExpenses(prev => groupVehiclesTogether(prev));
  };

  const handleAddExpense = (newExp) => {
    setExpenses(prev => [...prev, newExp]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleAddIncome = (newInc) => {
    setIncomes(prev => [...prev, newInc]);
  };

  const handleDeleteIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  const handleReplicateDecTo2027 = () => {
    setIncomes(prev => prev.map(inc => {
      const dezVal = Number(inc.values?.DEZ) || 0;
      const updated = { ...inc.values };
      MONTHS_2027.forEach(m => {
        updated[m.id] = dezVal;
      });
      return { ...inc, values: updated };
    }));

    setExpenses(prev => prev.map(exp => {
      const dezVal = Number(exp.values?.DEZ) || 0;
      const updated = { ...exp.values };
      MONTHS_2027.forEach(m => {
        updated[m.id] = dezVal;
      });
      return { ...exp, values: updated };
    }));
  };

  
  
  const handleManualSave = () => {
    safeStorage.set('finplan_incomes_v2', incomes);
    safeStorage.set('finplan_expenses_v2', expenses);
    safeStorage.set('finplan_banks_v2', banks);
    safeStorage.set('finplan_paid_status_v1', paidStatus);
    setLastSavedTime(new Date().toLocaleTimeString());
    return true;
  };

  const handleImportBackup = (backup) => {
    if (backup.incomes) {
      setIncomes(backup.incomes);
      localStorage.setItem('finplan_incomes_v2', JSON.stringify(backup.incomes));
    }
    if (backup.expenses) {
      setExpenses(backup.expenses);
      localStorage.setItem('finplan_expenses_v2', JSON.stringify(backup.expenses));
    }
    if (backup.paidStatus) {
      setPaidStatus(backup.paidStatus);
      localStorage.setItem('finplan_paid_status_v1', JSON.stringify(backup.paidStatus));
    }
    if (backup.banks) {
      setBanks(backup.banks);
      localStorage.setItem('finplan_banks_v2', JSON.stringify(backup.banks));
    }
  };

  const handleReset = () => {
    if (window.confirm('Restaurar todos os dados do orçamento para os valores originais?')) {
      setIncomes(INITIAL_INCOMES);
      setExpenses(INITIAL_EXPENSES);
      setBanks(INITIAL_BANKS);
      localStorage.removeItem('finplan_incomes_v2');
      localStorage.removeItem('finplan_expenses_v2');
      localStorage.removeItem('finplan_banks_v2');
      localStorage.removeItem('finplan_incomes_v1');
      localStorage.removeItem('finplan_expenses_v1');
      localStorage.removeItem('finplan_banks_v1');
    }
  };

  const tabs = [
    { id: 'orcamento', label: 'Orçamento & Planilha', icon: LayoutGrid, badge: selectedYear === 'ALL' ? '2026-2027' : selectedYear },
    { id: 'estrategia', label: 'Estratégia de Quitação', icon: Target, badge: 'Avalanche' },
    { id: 'taxas', label: 'Pesquisa de Taxas Bacen', icon: Scale },
    { id: 'agentes', label: 'Comitê de IA', icon: Bot, badge: '4 Agentes' },
    { id: 'negociacao', label: 'Roteiros de Negociação', icon: MessageSquare },
    { id: 'projecao', label: 'Projeção 2026-2027', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header
        months={visibleMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={df_month => setSelectedMonth(df_month)}
        selectedYear={selectedYear}
        onSelectYear={(yr) => {
          setSelectedYear(yr);
          if (yr === '2026') setSelectedMonth('SET');
          else if (yr === '2027') setSelectedMonth('JAN_27');
          else setSelectedMonth('ALL');
        }}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netBalance={netBalance}
        totalDebts={totalDebts}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        onResetData={handleReset}
        incomesData={incomes}
        expensesData={expenses}
        banksData={banks}
        paidStatusData={paidStatus}
        onImportBackup={handleImportBackup}
        onManualSave={handleManualSave}
        lastSavedTime={lastSavedTime}
      />

      <div className="border-b border-slate-800/80 bg-slate-900/40 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'orcamento' && (
          <BudgetTable
            visibleMonths={visibleMonths}
            allMonths={ALL_MONTHS}
            selectedYear={selectedYear}
            onSelectYear={(yr) => {
              setSelectedYear(yr);
              if (yr === '2026') setSelectedMonth('SET');
              else if (yr === '2027') setSelectedMonth('JAN_27');
            }}
            incomes={incomes}
            expenses={expenses}
            onUpdateIncome={handleUpdateIncome}
            onUpdateExpense={handleUpdateExpense}
            onUpdateIncomeDetails={handleUpdateIncomeDetails}
            onUpdateExpenseDetails={handleUpdateExpenseDetails}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            onReset={handleReset}
            onReplicateDecTo2027={handleReplicateDecTo2027}
            onMoveExpense={handleMoveExpense}
            onGroupVehicles={() => setExpenses(prev => groupVehiclesTogether(prev))}
            banks={banks}
            paidStatus={paidStatus}
            onTogglePaid={handleTogglePaid}
          />
        )}

        {activeTab === 'estrategia' && (
          <DebtStrategySim expenses={expenses} banks={banks} incomes={incomes} />
        )}

        {activeTab === 'taxas' && (
          <RatesComparator banks={banks} expenses={expenses} />
        )}

        {activeTab === 'agentes' && (
          <AiAdvisorPanel incomes={incomes} expenses={expenses} banks={banks} />
        )}

        {activeTab === 'negociacao' && (
          <NegotiationScripts expenses={expenses} banks={banks} incomes={incomes} />
        )}

        {activeTab === 'projecao' && (
          <CashFlowProjection incomes={incomes} expenses={expenses} />
        )}
      </main>

      <BankDataModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        banks={banks}
        onEditBanks={(newBanks) => setBanks(newBanks)}
      />

      <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>FinPlan IA • Planejador Financeiro & Auditoria de Dívidas 2026-2027</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ramaandrade/finplan-ia"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
              <span>Ver Repositório no GitHub</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <p>Bancos: Bradesco • Nubank • C6 Bank • Mercado Pago</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

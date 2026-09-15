import { useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useExpenses } from './hooks/useExpenses';
import { useBudgets } from './hooks/useBudgets';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { BudgetSummary } from './components/BudgetSummary';
import { CategoryChart } from './components/CategoryChart';
import { TabBar, type TabId } from './components/TabBar';
import { formatCurrency, monthKey } from './utils/format';
import type { Expense } from './types';
import './App.css';

function Dashboard() {
  const { user } = useAuth();
  const uid = user!.uid;
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(uid);
  const { budgets, setBudget } = useBudgets(uid);
  const [month, setMonth] = useState(() => new Date());
  const [tab, setTab] = useState<TabId>('gastos');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const monthExpenses = useMemo(() => {
    const key = monthKey(month);
    return expenses.filter((e) => e.date.startsWith(key));
  }, [expenses, month]);

  const total = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );

  const handleSubmit = (data: { amount: number; category: string; date: string; note: string }) => {
    if (editingExpense) {
      updateExpense(uid, editingExpense.id, data);
      setEditingExpense(null);
    } else {
      addExpense(uid, data);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setTab('gastos');
  };

  const handleDelete = (id: string) => {
    if (editingExpense?.id === id) setEditingExpense(null);
    deleteExpense(uid, id);
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <MonthSelector month={month} onChange={setMonth} />

        {tab === 'gastos' && (
          <>
            <ExpenseForm
              editingExpense={editingExpense}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingExpense(null)}
            />
            <h2 className="section-title">Movimientos</h2>
            <ExpenseList expenses={monthExpenses} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}

        {tab === 'resumen' && (
          <>
            <div className="total-card">
              <span>Total del mes</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <CategoryChart expenses={monthExpenses} />
          </>
        )}

        {tab === 'presupuestos' && (
          <BudgetSummary
            expenses={monthExpenses}
            budgets={budgets}
            onSetBudget={(category, limit) => setBudget(uid, category, limit)}
          />
        )}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

function Root() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Cargando…</div>;
  if (!user) return <Login />;
  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

export default App;

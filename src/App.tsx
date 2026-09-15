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
import { formatCurrency, monthKey } from './utils/format';
import './App.css';

function Dashboard() {
  const { user } = useAuth();
  const uid = user!.uid;
  const { expenses, addExpense, deleteExpense } = useExpenses(uid);
  const { budgets, setBudget } = useBudgets(uid);
  const [month, setMonth] = useState(() => new Date());

  const monthExpenses = useMemo(() => {
    const key = monthKey(month);
    return expenses.filter((e) => e.date.startsWith(key));
  }, [expenses, month]);

  const total = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <ExpenseForm onSubmit={(data) => addExpense(uid, data)} />

        <MonthSelector month={month} onChange={setMonth} />

        <div className="total-card">
          <span>Total del mes</span>
          <strong>{formatCurrency(total)}</strong>
        </div>

        <CategoryChart expenses={monthExpenses} />

        <h2 className="section-title">Presupuestos</h2>
        <BudgetSummary
          expenses={monthExpenses}
          budgets={budgets}
          onSetBudget={(category, limit) => setBudget(uid, category, limit)}
        />

        <h2 className="section-title">Movimientos</h2>
        <ExpenseList expenses={monthExpenses} onDelete={(id) => deleteExpense(uid, id)} />
      </main>
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

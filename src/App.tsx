import { useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { getExpensesByCategory, useExpenses } from './hooks/useExpenses';
import { useBudgets } from './hooks/useBudgets';
import { useCategories } from './hooks/useCategories';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { BudgetSummary } from './components/BudgetSummary';
import { CategoryManager } from './components/CategoryManager';
import { CategoryChart } from './components/CategoryChart';
import { StatsGrid } from './components/StatsGrid';
import { Reports } from './components/Reports';
import { TabBar, type TabId } from './components/TabBar';
import { formatCurrency, monthKey } from './utils/format';
import { getCategoryColors } from './utils/categoryColors';
import type { Expense } from './types';
import './App.css';

function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const uid = user!.uid;
  const { budgets, setBudget } = useBudgets(uid);
  const { categories, saveCategories } = useCategories(uid);
  const online = useOnlineStatus();
  const [month, setMonth] = useState(() => new Date());
  const [tab, setTab] = useState<TabId>('gastos');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [duplicateSeed, setDuplicateSeed] = useState<Expense | null>(null);

  const loadRange = useMemo(() => {
    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return {
      start: `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`,
      end: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    };
  }, [month]);

  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(uid, loadRange);

  const categoryColors = useMemo(() => getCategoryColors(categories), [categories]);

  const monthExpenses = useMemo(() => {
    const key = monthKey(month);
    return expenses.filter((e) => e.date.startsWith(key));
  }, [expenses, month]);

  const total = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );

  const prevMonthTotal = useMemo(() => {
    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    const key = monthKey(prevMonth);
    return expenses
      .filter((e) => e.date.startsWith(key))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, month]);

  const daysElapsed = useMemo(() => {
    const now = new Date();
    const isCurrentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
    if (isCurrentMonth) return now.getDate();
    return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  }, [month]);

  const topCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of monthExpenses) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    let best: { name: string; amount: number } | null = null;
    for (const [name, amount] of totals) {
      if (!best || amount > best.amount) best = { name, amount };
    }
    return best;
  }, [monthExpenses]);

  const handleSubmit = (data: { amount: number; category: string; date: string; note: string }) => {
    if (editingExpense) {
      updateExpense(uid, editingExpense.id, data);
      setEditingExpense(null);
    } else {
      addExpense(uid, data);
      setDuplicateSeed(null);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDuplicateSeed(null);
    setTab('gastos');
  };

  const handleDuplicate = (expense: Expense) => {
    setDuplicateSeed(expense);
    setEditingExpense(null);
    setTab('gastos');
  };

  const handleDelete = (id: string) => {
    if (editingExpense?.id === id) setEditingExpense(null);
    deleteExpense(uid, id);
  };

  const handleAddCategory = (name: string) => {
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      showToast('Esa categoría ya existe.');
      return;
    }
    saveCategories(uid, [...categories, name]);
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    if (categories.some((c) => c.toLowerCase() === newName.toLowerCase() && c !== oldName)) {
      showToast('Ya existe una categoría con ese nombre.');
      return;
    }
    const ok = await saveCategories(uid, categories.map((c) => (c === oldName ? newName : c)));
    if (!ok) return;
    const affected = await getExpensesByCategory(uid, oldName);
    for (const e of affected) {
      updateExpense(uid, e.id, { amount: e.amount, category: newName, date: e.date, note: e.note });
    }
    if (budgets[oldName]) {
      setBudget(uid, newName, budgets[oldName]);
      setBudget(uid, oldName, 0);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (categories.length <= 1) {
      showToast('Necesitás al menos una categoría.');
      return;
    }
    const inUse = await getExpensesByCategory(uid, name);
    if (inUse.length > 0) {
      showToast('No podés eliminar una categoría con gastos. Cambiala en esos gastos primero.');
      return;
    }
    saveCategories(uid, categories.filter((c) => c !== name));
  };

  return (
    <div className="app-shell">
      <Header />
      {!online && <div className="offline-banner">Sin conexión. Los cambios se guardan y sincronizan solos.</div>}
      <main className="app-main">
        {tab !== 'informes' && <MonthSelector month={month} onChange={setMonth} />}

        {tab === 'gastos' && (
          <>
            <ExpenseForm
              categories={categories}
              editingExpense={editingExpense}
              duplicateSeed={duplicateSeed}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingExpense(null)}
              onCancelDuplicate={() => setDuplicateSeed(null)}
            />
            <h2 className="section-title">Movimientos</h2>
            <ExpenseList
              expenses={monthExpenses}
              categoryColors={categoryColors}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </>
        )}

        {tab === 'resumen' && (
          <>
            <div className="total-card">
              <span>Total del mes</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <StatsGrid
              total={total}
              prevTotal={prevMonthTotal}
              count={monthExpenses.length}
              daysElapsed={daysElapsed}
              topCategory={topCategory}
            />
            <CategoryChart expenses={monthExpenses} categoryColors={categoryColors} />
          </>
        )}

        {tab === 'presupuestos' && (
          <>
            <CategoryManager
              categories={categories}
              categoryColors={categoryColors}
              onAdd={handleAddCategory}
              onRename={handleRenameCategory}
              onDelete={handleDeleteCategory}
            />
            <BudgetSummary
              categories={categories}
              expenses={monthExpenses}
              budgets={budgets}
              onSetBudget={(category, limit) => setBudget(uid, category, limit)}
            />
          </>
        )}

        {tab === 'informes' && <Reports />}
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

import { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Budgets, Expense } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  expenses: Expense[];
  budgets: Budgets;
  onSetBudget: (category: string, limit: number) => void;
}

export function BudgetSummary({ expenses, budgets, onSetBudget }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const spentByCategory = CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c] = expenses.filter((e) => e.category === c).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  const startEdit = (category: string) => {
    setEditing(category);
    setDraft(budgets[category] ? String(budgets[category]) : '');
  };

  const saveEdit = (category: string) => {
    const value = Number(draft);
    onSetBudget(category, isNaN(value) || value < 0 ? 0 : value);
    setEditing(null);
  };

  return (
    <div className="budget-summary">
      {CATEGORIES.map((c) => {
        const spent = spentByCategory[c] ?? 0;
        const limit = budgets[c] ?? 0;
        const hasLimit = limit > 0;
        const pct = hasLimit ? Math.min(100, (spent / limit) * 100) : 0;
        const over = hasLimit && spent > limit;

        if (!hasLimit && spent === 0) return null;

        return (
          <div key={c} className={`budget-row ${over ? 'budget-over' : ''}`}>
            <div className="budget-row-top">
              <span className="budget-category">{c}</span>
              {editing === c ? (
                <span className="budget-edit">
                  <input
                    type="number"
                    min="0"
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => saveEdit(c)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(c)}
                  />
                </span>
              ) : (
                <button className="btn-link budget-limit" onClick={() => startEdit(c)}>
                  {hasLimit ? `Presupuesto: ${formatCurrency(limit)}` : 'Definir presupuesto'}
                </button>
              )}
            </div>
            <div className="budget-bar">
              <div
                className={`budget-bar-fill ${over ? 'budget-bar-over' : ''}`}
                style={{ width: `${hasLimit ? pct : 0}%` }}
              />
            </div>
            <div className="budget-row-bottom">
              <span>{formatCurrency(spent)}</span>
              {over && <span className="budget-alert">⚠ Superaste el presupuesto</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

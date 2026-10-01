import { useState } from 'react';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';
import { FALLBACK_CATEGORY_COLOR } from '../utils/categoryColors';
import { ChevronDownIcon, CopyIcon, InboxIcon, PencilIcon, TrashIcon } from './icons';

interface Props {
  expenses: Expense[];
  categoryColors: Record<string, string>;
  onEdit: (expense: Expense) => void;
  onDuplicate: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

interface CategoryGroup {
  category: string;
  total: number;
  items: Expense[];
}

function groupByCategory(expenses: Expense[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();
  for (const e of expenses) {
    const group = map.get(e.category);
    if (group) {
      group.items.push(e);
      group.total += e.amount;
    } else {
      map.set(e.category, { category: e.category, total: e.amount, items: [e] });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function ExpenseList({ expenses, categoryColors, onEdit, onDuplicate, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <InboxIcon size={32} />
        <p>No hay gastos registrados este mes.</p>
      </div>
    );
  }

  const handleDelete = (e: Expense) => {
    if (window.confirm(`¿Eliminar el gasto de ${formatCurrency(e.amount)} en ${e.category}?`)) {
      onDelete(e.id);
    }
  };

  const toggleCollapsed = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const groups = groupByCategory(expenses);

  return (
    <div className="expense-groups">
      {groups.map((group) => {
        const isCollapsed = collapsed.has(group.category);
        return (
          <div key={group.category} className="expense-group">
            <button
              type="button"
              className="expense-group-header"
              onClick={() => toggleCollapsed(group.category)}
              aria-expanded={!isCollapsed}
            >
              <span className="expense-group-title">
                <ChevronDownIcon
                  size={15}
                  className={`expense-group-chevron ${isCollapsed ? 'expense-group-chevron-collapsed' : ''}`}
                />
                <span
                  className="category-dot"
                  style={{ background: categoryColors[group.category] ?? FALLBACK_CATEGORY_COLOR }}
                />
                {group.category}
                <span className="expense-group-count">{group.items.length}</span>
              </span>
              <span className="expense-group-total">{formatCurrency(group.total)}</span>
            </button>
            {!isCollapsed && (
              <ul className="expense-list">
                {group.items.map((e) => (
                  <li key={e.id} className="expense-item">
                    <div className="expense-main">
                      <span className="expense-date">{e.date}</span>
                      {e.note && <span className="expense-note">{e.note}</span>}
                    </div>
                    <div className="expense-side">
                      <span className="expense-amount">{formatCurrency(e.amount)}</span>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => onDuplicate(e)}
                        aria-label="Duplicar gasto"
                      >
                        <CopyIcon size={17} />
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => onEdit(e)}
                        aria-label="Editar gasto"
                      >
                        <PencilIcon size={17} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(e)}
                        aria-label="Eliminar gasto"
                      >
                        <TrashIcon size={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';
import { FALLBACK_CATEGORY_COLOR } from '../utils/categoryColors';
import { CopyIcon, InboxIcon, PencilIcon, TrashIcon } from './icons';

interface Props {
  expenses: Expense[];
  categoryColors: Record<string, string>;
  onEdit: (expense: Expense) => void;
  onDuplicate: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, categoryColors, onEdit, onDuplicate, onDelete }: Props) {
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

  return (
    <ul className="expense-list">
      {expenses.map((e) => (
        <li key={e.id} className="expense-item">
          <div className="expense-main">
            <span className="expense-category">
              <span
                className="category-dot"
                style={{ background: categoryColors[e.category] ?? FALLBACK_CATEGORY_COLOR }}
              />
              {e.category}
            </span>
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
  );
}

import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return <p className="empty-state">No hay gastos registrados este mes.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((e) => (
        <li key={e.id} className="expense-item">
          <div className="expense-main">
            <span className="expense-category">{e.category}</span>
            <span className="expense-date">{e.date}</span>
            {e.note && <span className="expense-note">{e.note}</span>}
          </div>
          <div className="expense-side">
            <span className="expense-amount">{formatCurrency(e.amount)}</span>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(e.id)}
              aria-label="Eliminar gasto"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

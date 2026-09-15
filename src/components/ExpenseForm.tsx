import { useEffect, useState, type FormEvent } from 'react';
import type { Expense } from '../types';
import { PlusIcon } from './icons';

interface Props {
  categories: string[];
  editingExpense: Expense | null;
  onSubmit: (data: { amount: number; category: string; date: string; note: string }) => void;
  onCancelEdit: () => void;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({ categories, editingExpense, onSubmit, onCancelEdit }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(categories[0]);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note);
      setError('');
    }
  }, [editingExpense]);

  useEffect(() => {
    if (!editingExpense && !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category, editingExpense]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount.replace(',', '.'));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Ingresá un monto válido mayor a 0.');
      return;
    }
    if (!date) {
      setError('Ingresá una fecha.');
      return;
    }
    setError('');
    onSubmit({ amount: parsed, category, date, note: note.trim() });
    setAmount('');
    setNote('');
    setDate(today());
    setCategory(categories[0]);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {editingExpense && <div className="expense-form-editing">Editando gasto</div>}
      <div className="form-row">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input
          type="text"
          placeholder="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      <div className="form-row">
        <button type="submit" className="btn btn-primary">
          {!editingExpense && <PlusIcon size={17} />}
          {editingExpense ? 'Guardar cambios' : 'Agregar gasto'}
        </button>
        {editingExpense && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

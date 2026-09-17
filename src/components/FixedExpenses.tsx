import { useEffect, useState, type FormEvent } from 'react';
import type { FixedExpense } from '../types';
import { formatCurrency } from '../utils/format';
import { FALLBACK_CATEGORY_COLOR } from '../utils/categoryColors';
import { CheckIcon, PencilIcon, PlusIcon, RepeatIcon, TrashIcon } from './icons';

interface Props {
  categories: string[];
  categoryColors: Record<string, string>;
  fixedExpenses: FixedExpense[];
  onAdd: (data: { amount: number; category: string; note: string }) => void;
  onUpdate: (id: string, data: { amount: number; category: string; note: string }) => void;
  onDelete: (id: string) => void;
  onApply: (ids: string[]) => void;
}

export function FixedExpenses({
  categories,
  categoryColors,
  fixedExpenses,
  onAdd,
  onUpdate,
  onDelete,
  onApply,
}: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(categories[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!editingId && !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category, editingId]);

  const resetForm = () => {
    setAmount('');
    setCategory(categories[0]);
    setNote('');
    setError('');
    setEditingId(null);
  };

  const startEdit = (fe: FixedExpense) => {
    setEditingId(fe.id);
    setAmount(String(fe.amount));
    setCategory(fe.category);
    setNote(fe.note);
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount.replace(',', '.'));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Ingresá un monto válido mayor a 0.');
      return;
    }
    setError('');
    const data = { amount: parsed, category, note: note.trim() };
    if (editingId) {
      onUpdate(editingId, data);
    } else {
      onAdd(data);
    }
    resetForm();
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = (fe: FixedExpense) => {
    if (window.confirm(`¿Eliminar "${fe.note || fe.category}" de tus gastos fijos?`)) {
      onDelete(fe.id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(fe.id);
        return next;
      });
      if (editingId === fe.id) resetForm();
    }
  };

  const handleApply = () => {
    onApply(Array.from(selected));
    setSelected(new Set());
  };

  return (
    <div className="fixed-expenses">
      <form className="expense-form" onSubmit={handleSubmit}>
        {editingId && <div className="expense-form-editing">Editando gasto fijo</div>}
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
          <input
            type="text"
            placeholder="Nombre (ej. Alquiler)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <div className="form-row">
          <button type="submit" className="btn btn-primary">
            {!editingId && <PlusIcon size={17} />}
            {editingId ? 'Guardar cambios' : 'Agregar gasto fijo'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="section-title">Marcá los que querés agregar hoy</h2>

      {fixedExpenses.length === 0 ? (
        <div className="empty-state">
          <RepeatIcon size={32} />
          <p>Todavía no cargaste gastos fijos. Agregá el primero arriba.</p>
        </div>
      ) : (
        <ul className="fixed-list">
          {fixedExpenses.map((fe) => (
            <li key={fe.id} className="fixed-item">
              <button
                type="button"
                className={`fixed-checkbox ${selected.has(fe.id) ? 'fixed-checkbox-checked' : ''}`}
                onClick={() => toggleSelected(fe.id)}
                aria-pressed={selected.has(fe.id)}
                aria-label={`Seleccionar ${fe.note || fe.category}`}
              >
                {selected.has(fe.id) && <CheckIcon size={14} />}
              </button>
              <div className="expense-main">
                <span className="expense-category">
                  <span
                    className="category-dot"
                    style={{ background: categoryColors[fe.category] ?? FALLBACK_CATEGORY_COLOR }}
                  />
                  {fe.note || fe.category}
                </span>
                {fe.note && <span className="expense-date">{fe.category}</span>}
              </div>
              <div className="expense-side">
                <span className="expense-amount">{formatCurrency(fe.amount)}</span>
                <button
                  className="btn-icon btn-edit"
                  onClick={() => startEdit(fe)}
                  aria-label={`Editar ${fe.note || fe.category}`}
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => handleDelete(fe)}
                  aria-label={`Eliminar ${fe.note || fe.category}`}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {fixedExpenses.length > 0 && (
        <button
          type="button"
          className="btn btn-primary fixed-apply-btn"
          disabled={selected.size === 0}
          onClick={handleApply}
        >
          Agregar {selected.size > 0 ? `${selected.size} ` : ''}a la fecha de hoy
        </button>
      )}
    </div>
  );
}

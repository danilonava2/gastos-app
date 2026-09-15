import { useState, type FormEvent } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from './icons';

interface Props {
  categories: string[];
  categoryColors: Record<string, string>;
  onAdd: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
}

export function CategoryManager({ categories, categoryColors, onAdd, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newName, setNewName] = useState('');

  const startEdit = (category: string) => {
    setEditing(category);
    setDraft(category);
  };

  const saveEdit = () => {
    if (editing && draft.trim() && draft.trim() !== editing) {
      onRename(editing, draft.trim());
    }
    setEditing(null);
  };

  const handleDelete = (category: string) => {
    if (window.confirm(`¿Eliminar la categoría "${category}"?`)) {
      onDelete(category);
    }
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName('');
  };

  return (
    <div className="category-manager">
      <h2 className="section-title">Categorías</h2>
      <ul className="category-list">
        {categories.map((c) => (
          <li key={c} className="category-chip">
            <span className="category-dot" style={{ background: categoryColors[c] }} />
            {editing === c ? (
              <input
                className="category-chip-input"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') setEditing(null);
                }}
              />
            ) : (
              <span className="category-chip-name">{c}</span>
            )}
            <button className="btn-icon btn-edit" onClick={() => startEdit(c)} aria-label={`Editar ${c}`}>
              <PencilIcon size={14} />
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => handleDelete(c)}
              aria-label={`Eliminar ${c}`}
              disabled={categories.length <= 1}
            >
              <TrashIcon size={14} />
            </button>
          </li>
        ))}
      </ul>
      <form className="category-add-form" onSubmit={handleAdd}>
        <input
          placeholder="Nueva categoría"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn-icon btn-edit" aria-label="Agregar categoría" disabled={!newName.trim()}>
          <PlusIcon size={18} />
        </button>
      </form>
    </div>
  );
}

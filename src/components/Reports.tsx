import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  expenses: Expense[];
}

function firstDayOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Reports({ expenses }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [generating, setGenerating] = useState<'pdf' | 'excel' | null>(null);

  const invalidRange = startDate > endDate;

  const filtered = useMemo(
    () => (invalidRange ? [] : expenses.filter((e) => e.date >= startDate && e.date <= endDate)),
    [expenses, startDate, endDate, invalidRange]
  );

  const total = useMemo(() => filtered.reduce((sum, e) => sum + e.amount, 0), [filtered]);

  const meta = {
    userName: user?.displayName ?? 'Usuario',
    userEmail: user?.email ?? '',
    startDate,
    endDate,
  };

  const handleDownloadPdf = async () => {
    setGenerating('pdf');
    try {
      const { generatePdfReport } = await import('../utils/report');
      generatePdfReport(filtered, meta);
    } catch {
      showToast('No se pudo generar el PDF.');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadExcel = async () => {
    setGenerating('excel');
    try {
      const { generateExcelReport } = await import('../utils/report');
      generateExcelReport(filtered, meta);
    } catch {
      showToast('No se pudo generar el Excel.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="reports">
      <div className="reports-card">
        <h2 className="section-title">Período del informe</h2>
        <div className="form-row">
          <label className="reports-field">
            <span>Desde</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className="reports-field">
            <span>Hasta</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>
        {invalidRange && <p className="field-error">La fecha "desde" es posterior a "hasta".</p>}
      </div>

      <div className="reports-card reports-preview">
        <span className="reports-preview-label">{filtered.length} movimientos en el período</span>
        <strong className="reports-preview-total">{formatCurrency(total)}</strong>
      </div>

      <div className="form-row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={filtered.length === 0 || generating !== null}
          onClick={handleDownloadPdf}
        >
          {generating === 'pdf' ? 'Generando…' : 'Descargar PDF'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={filtered.length === 0 || generating !== null}
          onClick={handleDownloadExcel}
        >
          {generating === 'excel' ? 'Generando…' : 'Descargar Excel'}
        </button>
      </div>
    </div>
  );
}

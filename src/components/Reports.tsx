import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [generating, setGenerating] = useState<'pdf' | 'excel' | null>(null);

  const filtered = useMemo(
    () => expenses.filter((e) => e.date >= startDate && e.date <= endDate),
    [expenses, startDate, endDate]
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
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadExcel = async () => {
    setGenerating('excel');
    try {
      const { generateExcelReport } = await import('../utils/report');
      generateExcelReport(filtered, meta);
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

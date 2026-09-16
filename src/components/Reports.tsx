import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../utils/format';

function firstDayOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Reports() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(firstDayOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [generating, setGenerating] = useState<'pdf' | 'excel' | null>(null);

  const invalidRange = startDate > endDate;

  const range = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);
  const { expenses: filtered, loading } = useExpenses(user!.uid, range);

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
      await generateExcelReport(filtered, meta);
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
        <span className="reports-preview-label">
          {loading ? 'Buscando movimientos…' : `${filtered.length} movimientos en el período`}
        </span>
        <strong className="reports-preview-total">{formatCurrency(total)}</strong>
      </div>

      <div className="form-row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={loading || filtered.length === 0 || generating !== null}
          onClick={handleDownloadPdf}
        >
          {generating === 'pdf' ? 'Generando…' : 'Descargar PDF'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={loading || filtered.length === 0 || generating !== null}
          onClick={handleDownloadExcel}
        >
          {generating === 'excel' ? 'Generando…' : 'Descargar Excel'}
        </button>
      </div>
    </div>
  );
}

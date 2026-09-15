import { formatCurrency } from '../utils/format';

interface Props {
  total: number;
  prevTotal: number;
  count: number;
  daysElapsed: number;
  topCategory: { name: string; amount: number } | null;
}

export function StatsGrid({ total, prevTotal, count, daysElapsed, topCategory }: Props) {
  const change = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null;
  const avgDaily = daysElapsed > 0 ? total / daysElapsed : 0;
  const trendClass = change === null ? '' : change > 0 ? 'stat-up' : change < 0 ? 'stat-down' : '';

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Vs. mes anterior</span>
        <strong className={`stat-value ${trendClass}`}>
          {change === null ? '—' : `${change > 0 ? '+' : ''}${change.toFixed(0)}%`}
        </strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Promedio diario</span>
        <strong className="stat-value">{formatCurrency(avgDaily)}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Movimientos</span>
        <strong className="stat-value">{count}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Categoría top</span>
        <strong className="stat-value stat-value-sm">{topCategory ? topCategory.name : '—'}</strong>
      </div>
    </div>
  );
}

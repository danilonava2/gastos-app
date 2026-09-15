import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';

const COLORS = [
  '#4f7cff',
  '#ff7d5c',
  '#3ecf8e',
  '#ffb84f',
  '#a06bff',
  '#ff5c93',
  '#39c0d9',
  '#8d99ae',
];

interface Props {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: Props) {
  const totals = new Map<string, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  const data = Array.from(totals.entries()).map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  return (
    <div className="category-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="chart-legend">
        {data.map((d, i) => (
          <li key={d.name}>
            <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            {d.name}: {formatCurrency(d.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

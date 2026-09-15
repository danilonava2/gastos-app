import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/format';
import { CATEGORY_COLORS } from '../utils/categoryColors';

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
            {data.map((d) => (
              <Cell key={d.name} fill={CATEGORY_COLORS[d.name]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="chart-legend">
        {data.map((d) => (
          <li key={d.name}>
            <span className="legend-dot" style={{ background: CATEGORY_COLORS[d.name] }} />
            {d.name}: {formatCurrency(d.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

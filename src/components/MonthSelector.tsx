import { monthLabel } from '../utils/format';

interface Props {
  month: Date;
  onChange: (month: Date) => void;
}

export function MonthSelector({ month, onChange }: Props) {
  const goPrev = () => onChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const goNext = () => onChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  return (
    <div className="month-selector">
      <button className="btn-icon" onClick={goPrev} aria-label="Mes anterior">
        ‹
      </button>
      <span className="month-label">{monthLabel(month)}</span>
      <button className="btn-icon" onClick={goNext} aria-label="Mes siguiente">
        ›
      </button>
    </div>
  );
}

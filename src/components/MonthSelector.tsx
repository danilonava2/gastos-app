import { monthLabel } from '../utils/format';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

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
        <ChevronLeftIcon size={18} />
      </button>
      <span className="month-label">{monthLabel(month)}</span>
      <button className="btn-icon" onClick={goNext} aria-label="Mes siguiente">
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}

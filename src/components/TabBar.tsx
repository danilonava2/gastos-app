import type { ComponentType } from 'react';
import { BarChartIcon, FileTextIcon, RepeatIcon, TargetIcon, WalletIcon } from './icons';

export type TabId = 'gastos' | 'resumen' | 'fijos' | 'presupuestos' | 'informes';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { id: 'gastos', label: 'Gastos', Icon: WalletIcon },
  { id: 'resumen', label: 'Resumen', Icon: BarChartIcon },
  { id: 'fijos', label: 'Fijos', Icon: RepeatIcon },
  { id: 'presupuestos', label: 'Presup.', Icon: TargetIcon },
  { id: 'informes', label: 'Informes', Icon: FileTextIcon },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`tab-btn ${active === id ? 'tab-btn-active' : ''}`}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <span className="tab-icon-wrap">
            <Icon size={20} />
          </span>
          <span className="tab-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

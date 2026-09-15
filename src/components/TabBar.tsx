export type TabId = 'gastos' | 'resumen' | 'presupuestos' | 'informes';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'gastos', label: 'Gastos', icon: '🧾' },
  { id: 'resumen', label: 'Resumen', icon: '📊' },
  { id: 'presupuestos', label: 'Presupuestos', icon: '🎯' },
  { id: 'informes', label: 'Informes', icon: '📄' },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${active === tab.id ? 'tab-btn-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

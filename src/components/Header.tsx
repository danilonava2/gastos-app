import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header-title">
        <img src="/favicon.svg" alt="" className="app-logo" />
        Gastos
      </div>
      <div className="app-header-user">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user?.photoURL && <img src={user.photoURL} alt="" className="avatar" />}
        {user && (
          <button className="btn-link" onClick={logout}>
            Salir
          </button>
        )}
      </div>
    </header>
  );
}

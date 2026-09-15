import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { LogOutIcon, MoonIcon, SunIcon } from './icons';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header-title">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="app-logo" />
        Control de Gastos
      </div>
      <div className="app-header-user">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? <SunIcon size={19} /> : <MoonIcon size={19} />}
        </button>
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="avatar"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {user && (
          <button className="btn-icon" onClick={logout} aria-label="Cerrar sesión">
            <LogOutIcon size={19} />
          </button>
        )}
      </div>
    </header>
  );
}

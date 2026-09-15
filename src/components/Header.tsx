import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-title">💸 Gastos</div>
      {user && (
        <div className="app-header-user">
          {user.photoURL && <img src={user.photoURL} alt="" className="avatar" />}
          <button className="btn-link" onClick={logout}>
            Salir
          </button>
        </div>
      )}
    </header>
  );
}

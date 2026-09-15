import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';

export function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="login-screen">
      <button
        className="btn-icon theme-toggle-floating"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <img src="/favicon.svg" alt="" className="login-logo" />
      <h1>Gastos</h1>
      <p>Registrá tus gastos y controlá tu presupuesto mensual.</p>
      <button className="btn btn-google" onClick={login}>
        Iniciar sesión con Google
      </button>
    </div>
  );
}

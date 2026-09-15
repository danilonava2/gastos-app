import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { BarChartIcon, GoogleIcon, MoonIcon, SunIcon, TargetIcon, WalletIcon } from './icons';

export function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="login-screen">
      <div className="login-glow" />
      <button
        className="btn-icon theme-toggle-floating"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        {theme === 'dark' ? <SunIcon size={19} /> : <MoonIcon size={19} />}
      </button>
      <div className="login-card">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="login-logo" />
        <h1>Gastos</h1>
        <p>Registrá tus gastos y controlá tu presupuesto mensual, todo en un solo lugar.</p>
        <button className="btn btn-google" onClick={login}>
          <GoogleIcon />
          Continuar con Google
        </button>
        <ul className="login-features">
          <li>
            <WalletIcon size={16} /> Registro rápido de gastos diarios
          </li>
          <li>
            <TargetIcon size={16} /> Presupuestos por categoría
          </li>
          <li>
            <BarChartIcon size={16} /> Informes en PDF y Excel
          </li>
        </ul>
      </div>
    </div>
  );
}

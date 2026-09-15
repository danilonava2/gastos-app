import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { login } = useAuth();

  return (
    <div className="login-screen">
      <h1>💸 Gastos</h1>
      <p>Registrá tus gastos y controlá tu presupuesto mensual.</p>
      <button className="btn btn-google" onClick={login}>
        Iniciar sesión con Google
      </button>
    </div>
  );
}

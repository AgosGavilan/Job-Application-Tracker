import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Bienvenido, {user?.name} 👋</h1>
      <p>Tu dashboard de postulaciones va acá.</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Home;
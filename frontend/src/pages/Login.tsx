import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const Login = () => {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 20px' }}>
            <h1>Iniciar sesión</h1>

            {error && (
                <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
                    {loading ? 'Cargando...' : 'Ingresar'}
                </button>
            </form>

            <p style={{ marginTop: 16, textAlign: 'center' }}>
                ¿No tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
        </div>
    )
}

export default Login
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const { register, loading, error } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(name, email, password);
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 20px' }}>
            <h1>Crear cuenta</h1>

            {error && (
                <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

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
                    {loading ? 'Cargando...' : 'Registrarse'}
                </button>
            </form>

            <p style={{ marginTop: 16, textAlign: 'center' }}>
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
        </div>
    );
}

export default Register;
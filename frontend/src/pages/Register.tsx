import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
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

    const inputStyle = {
        width: '100%', padding: '10px 12px 10px 36px',
        borderRadius: 'var(--radius-md)', border: '0.5px solid var(--color-border)',
        fontSize: 14, outline: 'none', background: 'var(--color-bg)',
    };

    return (
        <div style={{
            minHeight: '100vh', background: 'var(--color-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px',
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>


                {/* Card */}
                <div style={{
                    background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                    border: '0.5px solid var(--color-border)', padding: '32px 32px',
                }}>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 36, justifyContent: 'center' }}>
                        <div style={{
                            width: 34, height: 34, background: 'var(--color-primary)',
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>JT</span>
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                            Job<span style={{ color: 'var(--color-primary)' }}>Tracker</span>
                        </span>
                    </div>

                    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.02em', textAlign: 'center' }}>Crear cuenta</h1>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28, textAlign: 'center' }}>
                        Empezá a trackear tus postulaciones
                    </p>

                    {error && (
                        <div style={{
                            background: 'var(--color-red-light)', color: 'var(--color-red)',
                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                            fontSize: 13, marginBottom: 20,
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Nombre</label>
                            <div style={{ position: 'relative' }}>
                                <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete='off'
                                    placeholder="Tu nombre completo"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="email" autoComplete='off' value={email} onChange={(e) => setEmail(e.target.value)} required
                                    placeholder="tu@email.com"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="password" autoComplete='new-password' value={password} onChange={(e) => setPassword(e.target.value)} required
                                    placeholder="Mínimo 6 caracteres"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '11px',
                                background: 'var(--color-primary)', color: '#fff', border: 'none',
                                borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            <UserPlus size={15} />
                            {loading ? 'Cargando...' : 'Crear cuenta'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
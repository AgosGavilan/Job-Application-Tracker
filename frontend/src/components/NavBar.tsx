import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, BarChart2, Plus, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface Props {
  onNewApplication: () => void;
}

const Navbar = ({ onNewApplication }: Props) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const navLinks = [
    { to: '/',       label: 'Dashboard',      icon: LayoutGrid },
    { to: '/apps',   label: 'Postulaciones',  icon: FileText   },
    { to: '/stats',  label: 'Estadísticas',   icon: BarChart2  },
  ];

  return (
    <nav style={{
      background: 'var(--color-surface)',
      borderBottom: '0.5px solid var(--color-border)',
      padding: '0 28px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 32 }}>
        <div style={{
          width: 30, height: 30,
          background: 'var(--color-primary)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>JT</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Job<span style={{ color: 'var(--color-primary)' }}>Tracker</span>
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13.5,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: active ? 'var(--color-primary-light)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        <button
          onClick={onNewApplication}
          style={{
            background: 'var(--color-primary)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)', padding: '7px 15px',
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Nueva postulación
        </button>

        {/* Profile chip */}
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px 5px 5px',
            borderRadius: 'var(--radius-full)',
            border: '0.5px solid var(--color-border)',
            background: 'var(--color-bg)',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: '#fff',
          }}>
            {initials}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name.split(' ')[0]}</span>
          <ChevronDown size={14} color="var(--color-text-secondary)" />

          {/* Dropdown */}
          {showMenu && (
            <div style={{
              position: 'absolute', top: '110%', right: 0,
              background: 'var(--color-surface)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              padding: 6, minWidth: 160, zIndex: 100,
            }}>
              <div
                onClick={logout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 'var(--radius-md)',
                  fontSize: 13, color: 'var(--color-red)', cursor: 'pointer',
                }}
              >
                <LogOut size={14} />
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
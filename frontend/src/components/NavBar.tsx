import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid, FileText, BarChart2,
  Plus, ChevronDown, LogOut,
  Moon, Sun, Menu, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/themeContext';
import { useWindowSize } from '../hooks/useWindowSize';

interface Props {
  onNewApplication: () => void;
}

const Navbar = ({ onNewApplication }: Props) => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { isMobile } = useWindowSize();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const navLinks = [
    { to: '/',      label: 'Dashboard',     icon: LayoutGrid },
    { to: '/apps',  label: 'Postulaciones', icon: FileText   },
    { to: '/stats', label: 'Estadísticas',  icon: BarChart2  },
  ];

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '7px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: 13.5,
    fontWeight: active ? 500 : 400,
    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    background: active ? 'var(--color-primary-light)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s',
  });

  const iconBtnStyle: React.CSSProperties = {
    width: 34, height: 34,
    borderRadius: 'var(--radius-md)',
    border: '0.5px solid var(--color-border)',
    background: 'var(--color-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <>
      <nav style={{
        background: 'var(--color-surface)',
        borderBottom: '0.5px solid var(--color-border)',
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0, right: 0,
        zIndex: 52,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: isMobile ? 'auto' : 32 }}>
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

        {/* Links — solo desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={linkStyle(location.pathname === to)}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: isMobile ? 0 : 'auto' }}>

          {/* Toggle dark mode */}
          <button onClick={toggle} style={iconBtnStyle}>
            {isDark
              ? <Sun size={15} color="var(--color-primary)" />
              : <Moon size={15} color="var(--color-text-secondary)" />
            }
          </button>

          {/* Nueva postulación — solo desktop */}
          {!isMobile && (
            <button
              onClick={onNewApplication}
              style={{
                background: 'var(--color-primary)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius-md)', padding: '7px 15px',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font)',
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Nueva postulación
            </button>
          )}

          {/* Perfil — solo desktop */}
          {!isMobile && (
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 5px',
                borderRadius: 'var(--radius-full)',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-bg)',
                cursor: 'pointer', position: 'relative',
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
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {user?.name.split(' ')[0]}
              </span>
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
          )}

          {/* Hamburger — solo mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={iconBtnStyle}
            >
              {menuOpen
                ? <X size={16} color="var(--color-text-primary)" />
                : <Menu size={16} color="var(--color-text-primary)" />
              }
            </button>
          )}
        </div>
      </nav>

      {/* Overlay para cerrar al tocar afuera */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 48,
            background: 'transparent',
          }}
        />
      )}

      {/* Menú mobile desplegable */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 56, right: 0,
          width: 220,
          background: 'var(--color-surface)',
          borderLeft: '0.5px solid var(--color-border)',
          borderBottom: '0.5px solid var(--color-border)',
          borderBottomLeftRadius: 'var(--radius-lg)',
          padding: '8px 16px 16px',
          zIndex: 51,
          boxShadow: 'var(--shadow-md)',
        }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to} to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                ...linkStyle(location.pathname === to),
                display: 'flex',
                marginBottom: 2,
                fontSize: 14,
                padding: '10px 12px',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <div style={{ height: '0.5px', background: 'var(--color-border)', margin: '10px 0' }} />

          <button
            onClick={() => { onNewApplication(); setMenuOpen(false); }}
            style={{
              width: '100%', padding: '10px',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font)', marginBottom: 8,
            }}
          >
            <Plus size={15} />
            Nueva postulación
          </button>

          <div
            onClick={() => { logout(); setMenuOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 'var(--radius-md)',
              fontSize: 14, color: 'var(--color-red)', cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
            Cerrar sesión
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
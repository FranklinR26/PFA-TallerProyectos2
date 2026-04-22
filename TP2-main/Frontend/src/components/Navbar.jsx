import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LogoUC from './LogoUC';

const LINKS = {
  admin:       [
    { to: '/datos',     label: 'Datos' },
    { to: '/generar',   label: 'Generar' },
    { to: '/horario',   label: 'Horario' },
    { to: '/dashboard', label: 'Dashboard' },
  ],
  coordinador: [
    { to: '/datos',     label: 'Datos' },
    { to: '/generar',   label: 'Generar' },
    { to: '/horario',   label: 'Horario' },
    { to: '/dashboard', label: 'Dashboard' },
  ],
  docente:    [{ to: '/portal', label: 'Mi Horario' }],
  estudiante: [{ to: '/portal', label: 'Portal' }],
};

const ROLE_BADGE = {
  admin:       { label: 'Admin',       bg: 'rgba(20,110,245,0.08)', color: '#146ef5' },
  coordinador: { label: 'Coordinador', bg: 'rgba(122,61,255,0.08)', color: '#7a3dff' },
  docente:     { label: 'Docente',     bg: 'rgba(0,215,34,0.08)',   color: '#009618' },
  estudiante:  { label: 'Estudiante',  bg: 'rgba(255,174,19,0.08)', color: '#b87800' },
};

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  // No mostrar navbar en la página de login
  if (!user || pathname === '/login') return null;

  const links  = LINKS[user.role] ?? [];
  const badge  = ROLE_BADGE[user.role] ?? { label: user.role, bg: '#f2f2f2', color: '#5a5a5a' };

  const logout = () => { clearAuth(); navigate('/login'); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: 56,
      background: '#ffffff',
      borderBottom: '1px solid #d8d8d8',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 4,
      boxShadow: 'rgba(0,0,0,0) 0px 84px 24px, rgba(0,0,0,0.01) 0px 54px 22px, rgba(0,0,0,0.03) 0px 6px 8px, rgba(0,0,0,0.04) 0px 2px 4px',
    }}>

      {/* Logo */}
      <div style={{ marginRight: 24 }}>
        <LogoUC variant="dark" size="sm" />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: '#d8d8d8', marginRight: 16, flexShrink: 0 }} />

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            padding: '6px 12px', borderRadius: 4,
            fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.12s, color 0.12s',
            background: isActive ? 'rgba(20,110,245,0.08)' : 'transparent',
            color: isActive ? '#146ef5' : '#5a5a5a',
          })}>
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right: user + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{
          padding: '3px 8px', borderRadius: 4,
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          background: badge.bg, color: badge.color,
        }}>
          {badge.label}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#222222' }}>
          {user.name}
        </span>
        <button onClick={logout} className="btn btn-secondary btn-sm">
          Salir
        </button>
      </div>
    </nav>
  );
}

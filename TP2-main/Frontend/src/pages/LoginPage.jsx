import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import LogoUC from '../components/LogoUC';

const ROLES = [
  { id: 'admin',       label: 'Administrador', desc: 'Acceso total al sistema',   redirect: '/datos',  color: '#146ef5' },
  { id: 'coordinador', label: 'Coordinador',   desc: 'Gestiona datos y horarios', redirect: '/datos',  color: '#7a3dff' },
  { id: 'docente',     label: 'Docente',       desc: 'Consulta su horario',       redirect: '/portal', color: '#00d722' },
  { id: 'estudiante',  label: 'Estudiante',    desc: 'Portal de matrícula',       redirect: '/portal', color: '#ffae13' },
];

const ICONS = {
  admin:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  coordinador: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  docente:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  estudiante:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const setAuth  = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const selectRole = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Ingresa email y contraseña'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await loginRequest(email, password);
      setAuth(data.token, data.user);
      const role = ROLES.find(r => r.id === data.user.role);
      navigate(role?.redirect ?? '/portal');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      background: '#f8f8f8',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        minHeight: '100svh',
      }}>
        {/* Logo */}
        <LogoUC variant="light" size="md" />

        {/* Center text */}
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#146ef5', marginBottom: 16,
          }}>
            Sistema Académico
          </p>
          <h1 style={{
            fontSize: 48, fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-1.5px', color: '#ffffff',
            marginBottom: 20,
          }}>
            Sistema de<br />Horarios<br />
            <span style={{ color: '#146ef5' }}>Académicos</span>
          </h1>
          <p style={{
            fontSize: 15, color: '#5a5a5a', lineHeight: 1.6,
            maxWidth: 340,
          }}>
            Generación automática de horarios mediante optimización CSP.
            Sin conflictos, en segundos.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['⚡', 'Motor CSP con backtracking + MRV'],
            ['🔒', 'Autenticación JWT por roles'],
            ['📊', 'Dashboard de métricas en tiempo real'],
          ].map(([icon, text]) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 6,
              border: '1px solid #1e1e1e',
              background: '#111111',
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 13, color: '#5a5a5a' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 480,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 48px',
        background: '#ffffff',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 22, marginBottom: 6 }}>Acceso al sistema</h2>
          <p style={{ fontSize: 13, color: '#ababab', marginBottom: 28 }}>
            Selecciona tu rol para iniciar sesión
          </p>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {ROLES.map(role => {
              const active = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => selectRole(role)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px',
                    borderRadius: 6,
                    border: active ? `1.5px solid ${role.color}` : '1px solid #d8d8d8',
                    background: active ? `${role.color}0d` : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: active
                      ? `0 0 0 3px ${role.color}18`
                      : 'rgba(0,0,0,0) 0px 0px 0px, rgba(0,0,0,0.01) 0px 2px 4px, rgba(0,0,0,0.04) 0px 1px 3px',
                    transition: 'all 0.14s',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                    background: active ? `${role.color}18` : '#f2f2f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: active ? role.color : '#ababab',
                  }}>
                    {ICONS[role.id]}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, lineHeight: 1.2,
                      color: active ? role.color : '#080808',
                      marginBottom: 2,
                    }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#ababab', lineHeight: 1.3 }}>
                      {role.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: '#d8d8d8' }} />
            <span style={{ fontSize: 11, color: '#ababab', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Credenciales
            </span>
            <div style={{ flex: 1, height: 1, background: '#d8d8d8' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <input
                type="email" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                required style={{ width: '100%' }}
              />
              <input
                type="password" placeholder="Contraseña"
                value={password} onChange={e => setPassword(e.target.value)}
                required style={{ width: '100%' }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(238,29,54,0.06)',
                border: '1px solid rgba(238,29,54,0.2)',
                borderRadius: 4, padding: '9px 12px',
                color: '#ee1d36', fontSize: 13, marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ gap: 8 }}
              >
                {loading ? 'Entrando…' : <>Entrar <span>→</span></>}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid #e8e8e8',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <LogoUC variant="dark" size="sm" />
            <span style={{ fontSize: 11, color: '#d8d8d8' }}>
              © 2025 · Sistema de Horarios Académicos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

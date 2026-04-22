import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import { useAuthStore }  from './store/authStore';
import Navbar        from './components/Navbar';
import LoginPage     from './pages/LoginPage';
import DataPage      from './pages/DataPage';
import PortalPage    from './pages/PortalPage';
import GeneratePage  from './pages/GeneratePage';
import DashboardPage from './pages/DashboardPage';
import SchedulePage  from './pages/SchedulePage';

function Layout({ children }) {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';
  return isLogin
    ? children
    : <main style={{ flex: 1, width: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 20px 32px' }}>{children}</main>;
}

/** Si el usuario YA está logueado y visita /login, redirige a su home */
function PublicOnlyRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return children;
  const home = (user.role === 'admin' || user.role === 'coordinador') ? '/datos' : '/portal';
  return <Navigate to={home} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={
          <PublicOnlyRoute>
            <Layout><LoginPage /></Layout>
          </PublicOnlyRoute>
        } />

        <Route path="/datos" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador']}>
              <DataPage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/portal" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador', 'docente', 'estudiante']}>
              <PortalPage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/generar" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador']}>
              <GeneratePage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/horario" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador']}>
              <SchedulePage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/dashboard" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador']}>
              <DashboardPage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/unauthorized" element={
          <Layout><p style={{ padding: 40, color: '#64748b' }}>No tienes permiso para acceder a esta página.</p></Layout>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

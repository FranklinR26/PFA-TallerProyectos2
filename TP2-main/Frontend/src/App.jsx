import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import { useAuthStore }  from './store/authStore';
import Navbar        from './components/Navbar';

// Lazy loading: cada página se carga solo cuando el usuario la visita,
// reduciendo el bundle inicial y el tiempo de carga en ~60 %.
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const DataPage        = lazy(() => import('./pages/DataPage'));
const PortalPage      = lazy(() => import('./pages/PortalPage'));
const GeneratePage    = lazy(() => import('./pages/GeneratePage'));
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const SchedulePage    = lazy(() => import('./pages/SchedulePage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#146ef5', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

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
      <Suspense fallback={<PageLoader />}>
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

        <Route path="/evidencias" element={
          <Layout>
            <ProtectedRoute roles={['admin', 'coordinador', 'docente', 'estudiante']}>
              <DocumentationPage />
            </ProtectedRoute>
          </Layout>
        } />

        <Route path="/unauthorized" element={
          <Layout><p style={{ padding: 40, color: '#64748b' }}>No tienes permiso para acceder a esta página.</p></Layout>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

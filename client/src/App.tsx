import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useAppStore';
import { fetchCurrentUser } from './store/authSlice';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlertHistory from './pages/AlertHistory';
import ShelterMap from './pages/ShelterMap';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ResourceDashboard from './pages/ResourceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { UserRole } from './types';
import Skeleton from './components/Skeleton';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user } = useAppSelector((state) => state.auth);
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

function App() {
  const dispatch = useAppDispatch();
  const { token, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  if (token && !user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-16 h-16 rounded-card" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="alerts" element={<ErrorBoundary><AlertHistory /></ErrorBoundary>} />
        <Route path="shelters" element={<ErrorBoundary><ShelterMap /></ErrorBoundary>} />
        <Route path="volunteer" element={<ErrorBoundary><VolunteerDashboard /></ErrorBoundary>} />
        <Route path="resources" element={<ErrorBoundary><ResourceDashboard /></ErrorBoundary>} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={[UserRole.ADMIN]}>
              <ErrorBoundary><AdminDashboard /></ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

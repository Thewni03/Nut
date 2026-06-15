import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopNav from './TopNav';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-almond">
        <p className="text-walnut/50">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-almond">
      <TopNav />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

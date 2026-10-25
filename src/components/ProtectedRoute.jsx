// ProtectedRoute: Demonstrates route guarding in React Router v6 using <Navigate>
import { Navigate, Outlet } from 'react-router-dom';
import { useWelfora } from '../context/WelforaContext';

export default function ProtectedRoute() {
  const { authSession } = useWelfora();

  // Navigate: redirects unauthenticated users to /login
  if (!authSession) {
    return <Navigate to="/login" replace />;
  }

  // Outlet: renders matching child route elements
  return <Outlet />;
}

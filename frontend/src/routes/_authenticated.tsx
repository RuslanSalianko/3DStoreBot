import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useAuth } from '@store/auth';

export const Route = createFileRoute('/_authenticated')({
  component: Authenticated,
});

function Authenticated() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

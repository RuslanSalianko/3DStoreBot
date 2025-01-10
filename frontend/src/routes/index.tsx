import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useAuth } from '@store/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { isAuth } = useAuth();
  return (
    <>{!isAuth ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}</>
  );
}

import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useAuth } from '@store/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {!isAuthenticated ? (
        <Navigate to="/login" />
      ) : (
        <Navigate to="/dashboard" />
      )}
    </>
  );
}

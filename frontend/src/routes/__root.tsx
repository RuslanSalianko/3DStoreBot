import { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
//import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { useAuth } from '@store/auth';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <>
      <Outlet />
    </>
  );
}

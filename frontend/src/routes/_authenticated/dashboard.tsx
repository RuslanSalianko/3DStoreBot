import { Suspense } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import DashboardLayout from '../../layouts/dashboard';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </>
  );
}

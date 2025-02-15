import { Suspense } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import DashboardLayout from '../../layouts/dashboard';
import Snackbar from '@/components/snacbar';
import { useMessage } from '@/store/message';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { message, type, clearMessage } = useMessage();
  return (
    <>
      <DashboardLayout>
        <Suspense>
          <Snackbar
            message={message}
            severity={type}
            clearMessage={clearMessage}
          />
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </>
  );
}

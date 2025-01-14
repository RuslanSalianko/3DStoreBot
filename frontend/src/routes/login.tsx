import { createFileRoute, Navigate } from '@tanstack/react-router';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import LoginForm from '@sections/auth/login';

import { useAuth } from '@store/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navigate to="/dashboard" />}
      <Container maxWidth="sm" sx={{ mt: 8, p: 8 }}>
        <Typography variant="h4" textAlign="center">
          Sign in
        </Typography>
        <LoginForm />
      </Container>
    </>
  );
}

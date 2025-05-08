import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAuth } from '@store/auth';

export default function LoginForm() {
  const { getPassword, login, isGetPassword, errorMessage, clearErrorMessage } =
    useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      if (!value.password) {
        await getPassword(value.email);
        return;
      }
      await login(value.email, value.password);
    },
    validators: {
      onChange: z.object({
        email: z.string().email('Invalid email'),
        password: z.string(),
      }),
    },
  });

  return (
    <>
      <Stack spacing={4} direction="column" mt={4}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: z.string().email(),
            }}
            children={(field) => (
              <TextField
                error={
                  field.state.meta.errors.length ||
                  (errorMessage && !isGetPassword)
                    ? true
                    : false
                }
                label="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.setValue(e.target.value);
                  clearErrorMessage();
                }}
                helperText={
                  field.state.meta.errors[0]?.message ||
                  (!isGetPassword && errorMessage)
                }
                sx={{ label: { color: 'text.primary' } }}
              />
            )}
          />
          {!isGetPassword && (
            <form.Subscribe
              children={() => (
                <Button variant="contained" type="submit">
                  Get Password
                </Button>
              )}
            />
          )}

          {isGetPassword && (
            <>
              <form.Field
                name="password"
                children={(field) => (
                  <TextField
                    error={errorMessage ? true : false}
                    label={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      clearErrorMessage();
                    }}
                    helperText={errorMessage}
                    sx={{ label: { color: 'text.primary' } }}
                  />
                )}
              />
              <form.Subscribe
                children={() => (
                  <Button variant="contained" type="submit">
                    Login
                  </Button>
                )}
              />
            </>
          )}
        </form>
      </Stack>
    </>
  );
}

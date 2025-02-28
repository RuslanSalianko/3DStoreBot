import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};
type Props = {
  open: boolean;
  handleClose: () => void;
};

export function ModalAddCategory({ open, handleClose }: Props) {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      handleClose();
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack
          direction="column"
          sx={{ alignContent: 'center', alignItems: 'center' }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Create new category
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              validatorAdapter={zodValidator()}
              validators={{
                onChange: z.string().trim().min(3, { message: '' }),
              }}
              children={(field) => (
                <TextField
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors[0]}
                  label="Name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  sx={{ label: { color: 'text.primary' } }}
                />
              )}
            />
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <form.Subscribe
                children={() => (
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                )}
              />
            </Stack>
          </form>
        </Stack>
      </Box>
    </Modal>
  );
}

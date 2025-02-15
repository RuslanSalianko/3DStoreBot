import { useState } from 'react';

import Alert from '@mui/material/Alert';
import { SnackbarCloseReason, Snackbar as SnackbarMui } from '@mui/material';

type Props = {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  clearMessage: () => void;
};
const Snackbar = ({ message, severity, clearMessage }: Props) => {
  const isOpen = message !== '';
  const [open, setOpen] = useState(isOpen);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    event.preventDefault();
    if (reason === 'clickaway') {
      return;
    }
    clearMessage();
    setOpen(false);
  };

  return (
    <SnackbarMui open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </SnackbarMui>
  );
};

export default Snackbar;

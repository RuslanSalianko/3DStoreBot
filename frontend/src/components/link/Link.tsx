import { ReactNode } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';
import { Link as MuiLink, SxProps } from '@mui/material';

type Props = {
  children: ReactNode;
  to: string;
  sx?: SxProps;
};

const Link = ({ children, sx, ...other }: Props) => {
  return (
    <MuiLink
      component={RouterLink}
      underline="none"
      sx={{ display: 'flex', color: 'text.primary', ...sx }}
      {...other}
    >
      {children}
    </MuiLink>
  );
};

export default Link;

import { forwardRef } from 'react';
import { Box, BoxProps, Icon } from '@mui/material';

type IconifyProps = BoxProps & {
  icon: string;
};

const Iconify = forwardRef<HTMLElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={Icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    >
      <Icon>{icon}</Icon>
    </Box>
  ),
);

export default Iconify;

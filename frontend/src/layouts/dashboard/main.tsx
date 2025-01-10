import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';

import { useResponsive } from '@hooks/use-responsive';

import { NAV, HEADER } from './config';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  sx?: SxProps;
};

const SPACING = 8;

export default function Main({ children, sx, ...other }: Props) {
  const lgUp = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER.DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.WIDTH}px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

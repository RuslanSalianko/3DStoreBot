import { MouseEventHandler } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useResponsive } from '@hooks/use-responsive';

import { bgBlur } from '@theme/css';

import Iconify from '@components/iconify';

import { NAV, HEADER } from './config';
import AccountPopover from './common/account-popover';
import { useLocation } from '@tanstack/react-router';
import { stringUtils } from '../../utils/string';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav: MouseEventHandler<HTMLButtonElement>;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
          }}
        >
          <Iconify
            icon="menu-2-fill"
            sx={{ color: theme.palette.text.disabled }}
          />
        </IconButton>
      )}
      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {stringUtils.capitalize(pathname.split('/').pop() || '')}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.DESKTOP,
        }),
        ...bgBlur({
          color: theme.palette.background.paper,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

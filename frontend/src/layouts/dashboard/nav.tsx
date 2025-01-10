import { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';

import { alpha, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';

import Iconify from '@components/iconify';
import Scrollbar from '@components/scrollbar';
import Logo from '@components/logo';

import { useResponsive } from '@hooks/use-responsive';

import { NAV } from './config';
import { navConfig } from './nav-config';
import { INavItem } from './types/nav-item.interface';

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function Nav({ openNav, onCloseNav }: Props) {
  const { pathname } = useLocation();

  const theme = useTheme();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        background: theme.palette.primary.main,
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 4 }} />

      <RenderMenu navItem={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------
//

function RenderMenu({ navItem }: { navItem: INavItem[] }) {
  return (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navItem.map((item) => {
        if (item.children) {
          return <NavSubItem key={item.title} item={item} />;
        }

        return <NavItem key={item.title} item={item} />;
      })}
    </Stack>
  );
}

function NavItem({ item }: { item: INavItem }) {
  const { pathname } = useLocation();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={Link}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'background.default',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

function NavSubItem({ item }: { item: INavItem }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const active = item.path === pathname;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(active && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box component="span">{item.title} </Box>
        <Box component="span" sx={{ ml: 'auto', mr: 0 }}>
          {open ? (
            <Iconify icon={'keyboard_arrow_up'} />
          ) : (
            <Iconify icon={'keyboard_arrow_down'} />
          )}
        </Box>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box component="div" sx={{ pl: 2 }}>
          {item.children && <RenderMenu navItem={item.children} />}
        </Box>
      </Collapse>
    </>
  );
}

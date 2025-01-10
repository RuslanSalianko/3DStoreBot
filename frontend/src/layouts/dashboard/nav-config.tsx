import { ReactNode } from 'react';

import { Icon } from '@mui/material';
import { INavItem } from './types/nav-item.interface';

const icon = (name: string): ReactNode => {
  return <Icon>{name}</Icon>;
};

export const navConfig: INavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('dashboard'),
  },
  {
    title: 'Files',
    path: '/dashboard/files',
    icon: icon('file_copy'),
  },
];

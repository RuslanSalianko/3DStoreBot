import { ReactNode } from 'react';

export interface INavItem {
  title: string;
  path: string;
  icon: ReactNode;
  children?: INavItem[];
}

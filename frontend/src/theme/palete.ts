import { PaletteOptions, TypeBackground } from '@mui/material';

export const grey = {
  0: '#52414C',
  100: '#034732',
  200: '#008148',
  300: '#C6C013',
  400: '#EF8A17',
  500: '#EF2917',
  600: '#fb6107',
  700: '#3B8EA5',
  800: '#048BA8',
  900: '#52414C',
  A100: '#FFFFFF',
  A200: '#000000',
  A300: '#F2F2F2',
};

const primary = {
  main: grey[100],
};

const secondary = {
  main: grey[200],
};

const background: Partial<TypeBackground> = {
  default: grey['A300'],
  paper: grey['A100'],
};

const base = {
  primary,
  secondary,
  background,
};

export function palette(): PaletteOptions {
  return {
    ...base,
    text: {
      primary: grey['A200'],
      secondary: grey['A100'],
      disabled: grey['A300'],
    },
    grey,
  };
}

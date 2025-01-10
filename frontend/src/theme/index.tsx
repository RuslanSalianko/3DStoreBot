import { useMemo } from 'react';
import {
  ThemeOptions,
  CssBaseline,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material';
import { palette } from './palete';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette(),
    }),
    [],
  );
  const theme = createTheme(themeOptions);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

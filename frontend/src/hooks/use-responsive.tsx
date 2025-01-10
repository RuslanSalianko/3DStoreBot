import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export function useResponsive(
  query: string,
  start: Breakpoint,
  end?: Breakpoint,
): boolean {
  const theme = useTheme();
  const mediaUp = useMediaQuery(theme.breakpoints.up(start));
  const mediaDown = useMediaQuery(theme.breakpoints.down(start));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between' && end) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));

    return mediaBetween;
  }

  return mediaOnly;
}

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output: string | null, key: Breakpoint): string | null => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

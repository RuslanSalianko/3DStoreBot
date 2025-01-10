import { Link as RouterLink } from '@tanstack/react-router';
import { forwardRef } from 'react';

import { Box, Link, SxProps, useTheme } from '@mui/material';

type Props = {
  disabledLink?: boolean;
  sx?: SxProps;
};

const Logo = forwardRef(
  ({ disabledLink = false, sx, ...other }: Props, ref) => {
    const theme = useTheme();
    const COLOR = theme.palette.text.secondary;

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{ width: 150, heigth: 60, display: 'inline-flex', ...sx }}
        {...other}
      >
        <svg
          data-v-423bf9ae=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 410 90"
          className="iconLeft"
        >
          <g
            data-v-423bf9ae=""
            id="f31ac909-f986-43fc-aed4-e80c2e8f1a95"
            fill={COLOR}
            transform="matrix(5.565862655639648,0,0,5.565862655639648,105.33335876464844,4.090909957885742)"
          >
            <path d="M4.17 6.37L7.53 2.10L0.84 2.10L0.84 3.66L4.52 3.66L1.38 7.74L4.22 7.74C5.18 7.74 5.93 8.38 5.93 9.36C5.93 10.36 5.20 11.13 4.20 11.13C3.31 11.13 2.54 10.50 2.54 9.68L0.84 9.70C0.84 11.39 2.35 12.74 4.18 12.74C6.13 12.74 7.60 11.25 7.60 9.43C7.60 7.51 6.07 6.30 4.17 6.37ZM9.75 12.60L12.90 12.60C15.80 12.60 18.15 10.26 18.15 7.35C18.15 4.45 15.80 2.10 12.90 2.10L9.75 2.10ZM11.45 11.01L11.45 3.69L12.90 3.69C14.89 3.69 16.45 5.25 16.45 7.35C16.45 9.45 14.89 11.01 12.90 11.01ZM22.98 12.74C24.87 12.74 26.41 11.62 26.41 9.73C26.41 6.00 21.44 6.91 21.44 4.76C21.44 3.94 22.09 3.55 22.86 3.55C23.56 3.55 24.19 3.87 24.66 4.46L25.87 3.36C25.20 2.54 24.10 1.96 22.86 1.96C21.21 1.96 19.72 2.99 19.72 4.88C19.72 8.37 24.69 7.51 24.69 9.73C24.69 10.59 23.98 11.10 23.00 11.10C21.93 11.10 21.12 10.50 20.76 9.61L19.29 10.50C19.90 11.81 21.30 12.74 22.98 12.74ZM31.71 7.00L31.71 5.60L29.94 5.60L29.94 2.73L28.28 2.73L28.28 5.60L27.13 5.60L27.13 7.00L28.28 7.00L28.28 10.43C28.28 11.73 29.38 12.74 30.66 12.74C31.06 12.74 31.50 12.64 31.68 12.51L31.68 11.24L30.87 11.24C30.35 11.24 29.94 10.85 29.94 10.24L29.94 7.00ZM36.59 12.74C38.76 12.74 40.36 11.15 40.36 9.10C40.36 7.05 38.76 5.46 36.59 5.46C34.42 5.46 32.83 7.05 32.83 9.10C32.83 11.15 34.42 12.74 36.59 12.74ZM36.59 11.20C35.40 11.20 34.49 10.27 34.49 9.10C34.49 7.93 35.40 7.00 36.59 7.00C37.77 7.00 38.69 7.93 38.69 9.10C38.69 10.27 37.77 11.20 36.59 11.20ZM45.99 5.46C45.08 5.46 44.33 5.88 43.84 6.56L43.84 5.60L42.18 5.60L42.18 12.60L43.84 12.60L43.84 9.05C43.84 7.82 44.75 7.00 45.96 7.00C46.18 7.00 46.38 7.04 46.55 7.07L46.55 5.51C46.38 5.48 46.18 5.46 45.99 5.46ZM54.67 9.07C54.64 6.97 53.10 5.46 50.98 5.46C48.84 5.46 47.23 7.00 47.23 9.10C47.23 11.20 48.83 12.74 51.00 12.74C52.80 12.74 54.15 11.67 54.55 10.15L52.89 10.15C52.59 10.89 51.89 11.36 51.00 11.36C49.82 11.36 49.00 10.54 48.91 9.36L54.65 9.36ZM51.00 6.86C51.91 6.86 52.55 7.37 52.85 8.17L49.05 8.17C49.37 7.39 50.05 6.86 51.00 6.86Z"></path>
          </g>
          <g
            data-v-423bf9ae=""
            id="946c2d11-ca6d-418c-a690-b0cdfb9065bc"
            transform="matrix(2.8124992847442627,0,0,2.8124992847442627,0.9956609010696411,1.0000007152557373)"
            stroke="none"
            fill={COLOR}
          >
            <path d="M5.78 16L16 5.78 26.22 16 16 26.22z"></path>
            <path d="M32 3.714A3.714 3.714 0 0028.286 0c-1.659 0-3.047 1.095-3.524 2.596H7.238C6.761 1.095 5.373 0 3.714 0A3.714 3.714 0 000 3.714a3.7 3.7 0 002.597 3.524v17.524A3.7 3.7 0 000 28.286 3.714 3.714 0 003.714 32c1.506 0 2.795-.9 3.378-2.188h17.816A3.707 3.707 0 0028.286 32a3.709 3.709 0 001.526-7.093V7.092A3.707 3.707 0 0032 3.714zm-3.188 20.911c-.173-.025-.346-.053-.526-.053a3.714 3.714 0 00-3.714 3.714c0 .18.028.353.053.526H7.375c.025-.173.053-.346.053-.526a3.714 3.714 0 00-3.714-3.714c-.04 0-.077.01-.117.012V7.416c.04.001.077.012.117.012a3.714 3.714 0 003.714-3.714c0-.04-.011-.078-.012-.117h17.168c-.001.04-.012.077-.012.117a3.714 3.714 0 003.714 3.714c.18 0 .352-.028.526-.053v17.25z"></path>
          </g>
        </svg>
      </Box>
    );

    if (disabledLink) {
      return <>{logo} </>;
    }

    return (
      <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  },
);

export default Logo;

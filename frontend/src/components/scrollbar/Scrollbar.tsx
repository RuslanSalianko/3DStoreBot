import { memo, ReactNode } from 'react';

import { Box, SxProps } from '@mui/material';

import { StyledRootScrollbar, StyledScrollbar } from './styles';

type Props = {
  children: ReactNode;
  sx?: SxProps;
};

const Scrollbar = ({ children, sx, ...other }: Props) => {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }
  return (
    <StyledRootScrollbar>
      <StyledScrollbar clickOnTrack={false} sx={sx} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
};

export default memo(Scrollbar);

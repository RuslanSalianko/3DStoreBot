import Grid from '@mui/material/Grid2';
import { TextWidget } from '../text-widget';
import Typography from '@mui/material/Typography';

type Props = {
  day: number;
  week: number;
  month: number;
  total: number;
};

export function OverviewAnalyticsView({ day, week, month, total }: Props) {
  return (
    <>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Downloads Files
      </Typography>
      <Grid container spacing={2} sx={{ ml: 'auto', mr: 'auto' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextWidget
            title="Day"
            value={day}
            sx={{ backgroundColor: 'grey.200', color: 'text.secondary' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextWidget
            title="Week"
            value={week}
            sx={{ backgroundColor: 'grey.300', color: 'text.primary' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextWidget
            title="Month"
            value={month}
            sx={{ backgroundColor: 'grey.400' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextWidget
            title="Total"
            value={total}
            sx={{ backgroundColor: 'grey.500', color: 'text.secondary' }}
          />
        </Grid>
      </Grid>
    </>
  );
}

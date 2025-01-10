import { createFileRoute } from '@tanstack/react-router';

import { OverviewAnalyticsView } from '../../../sections/overview/view/overview-analytics-view';
import { FileService } from '../../../services/file.service';
import { FilesViewMini } from '@/sections/files/view';
import Typography from '@mui/material/Typography';

export const Route = createFileRoute('/_authenticated/dashboard/')({
  loader: async () => {
    const [day, week, month, total, files5] = await Promise.all([
      FileService.findAll({ day: '1' }),
      FileService.findAll({ day: '7' }),
      FileService.findAll({ day: '30' }),
      FileService.findAll({}),
      FileService.findAll({ limit: '5' }),
    ]);
    return {
      day: day.length,
      week: week.length,
      month: month.length,
      total: total.length,
      files5: files5,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <>
      <OverviewAnalyticsView {...data} />
      <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
        Latest Files
      </Typography>
      <FilesViewMini files={data.files5} />
    </>
  );
}

import { createFileRoute } from '@tanstack/react-router';

import { FileService } from '@services/file.service';
import Page from '@components/page';

export const Route = createFileRoute('/_authenticated/dashboard/file/$uuid')({
  loader: async ({ params }) => await FileService.findByUUID(params.uuid),
  component: File,
});

function File() {
  const file = Route.useLoaderData();

  return (
    <Page name="File">
      <>file</>
    </Page>
  );
}

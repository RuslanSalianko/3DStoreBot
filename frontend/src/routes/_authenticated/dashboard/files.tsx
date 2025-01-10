import { createFileRoute } from '@tanstack/react-router';
import { FileService } from '../../../services/file.service';
import Page from '@components/page/Page';
import FilesView from '@sections/files/view';
import { IFile } from '@models/file.interface';

export const Route = createFileRoute('/_authenticated/dashboard/files')({
  loader: async () => await FileService.findAll({}),
  component: Files,
});

function Files() {
  const files = Route.useLoaderData() as IFile[];
  return (
    <Page>
      <FilesView files={files} />
    </Page>
  );
}

import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { HEAD_LABEL_MINI } from './config';
import { FilesTableRowMini } from '../files-table-row-mini';
import { IFile } from '@models/file.interface';
import { FileService } from '@/api/services/file.service';

type Props = {
  files: IFile[];
};

export function FilesViewMini({ files }: Props) {
  const handleDeleteFile = (uuid: string) => {
    FileService.delete(uuid);
  };

  return (
    <TableContainer component={Paper}>
      <Table key="files">
        <TableHead>
          <TableRow>
            {HEAD_LABEL_MINI.map((item) => (
              <TableCell
                key={item.id}
                align={item.align || 'left'}
                sx={{ width: item.width, minWidth: item.minWidth }}
              >
                {item.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <FilesTableRowMini
              key={file.id}
              {...file}
              handleDeleteFile={handleDeleteFile}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Iconify from '@components/iconify';
import Link from '@components/link';

import { ImageService } from '@services/image.service';
import { FileService } from '@services/file.service';

import { IFile } from '@models/file.interface';

type Props = IFile & {
  handleDeleteFile: (uuid: string) => void;
};

export function FilesTableRowMini({
  id,
  uuid,
  name,
  images,
  size,
  format,
  category,
  handleDeleteFile,
}: Props) {
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const image = images.find((i) => i.isPrimary);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDownloadFile = async () => {
    await FileService.downloadFile(uuid, format);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {image && (
            <img
              src={ImageService.getImageUrl(image.uuid)}
              alt={name}
              width={100}
            />
          )}
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{category && category.name}</TableCell>
        <TableCell align="center">
          {(size / (1024 * 1024)).toFixed(2)}
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={handleDownloadFile}>
            <Iconify icon="download" sx={{ width: 20, height: 20 }} />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="more_vert" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 140,
          },
        }}
      >
        <Link to={`/dashboard/file/${id}`}>
          <MenuItem>
            <Iconify icon="info" sx={{ mr: 3, height: 24, width: 24 }} />
            Info
          </MenuItem>
        </Link>
        <MenuItem onClick={() => handleDeleteFile(uuid)}>
          <Iconify
            icon="delete"
            sx={{ mr: 3, height: 24, width: 24, color: 'error.main' }}
          />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

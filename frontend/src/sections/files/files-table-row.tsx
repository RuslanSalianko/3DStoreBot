import React, { useState } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from '@components/iconify';
import Link from '@components/link';

import { ImageService } from '@services/image.service';
import { FileService } from '@services/file.service';
import { ICategory } from '@/models/category.interface';
import { IImage } from '@/models/image.interface';

type Props = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  category: ICategory | null;
  size: number;
  format: string;
  images: IImage[];

  selected?: boolean;
  handleClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile: (uuid: string) => void;
};

export default function FilesTableRow({
  id,
  uuid,
  name,
  description,
  category,
  size,
  format,
  images,
  selected,
  handleClick,
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
      <TableRow hover tabIndex={-1} role="checkbox">
        {selected !== undefined ? (
          <TableCell padding="checkbox">
            <Checkbox
              disableRipple
              checked={selected}
              onChange={handleClick}
              sx={{ color: 'text.primary' }}
            />
          </TableCell>
        ) : null}
        <TableCell align="center">
          {image && (
            <img
              src={ImageService.getImageUrl(image.uuid)}
              alt={name}
              width={100}
            />
          )}
        </TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{description}</TableCell>
        <TableCell align="left">{category && category.name}</TableCell>
        <TableCell align="center">
          {(size / (1024 * 1024)).toFixed(2)}
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={handleDownloadFile}>
            <Iconify icon="download" sx={{ width: 20, height: 20 }} />
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="more_vert" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Link to={`/dashboard/files/${id}`}>
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="info" sx={{ mr: 2, height: 24, width: 24 }} />
            Info
          </MenuItem>
        </Link>
        <MenuItem onClick={() => handleDeleteFile(uuid)}>
          <Iconify
            icon="delete"
            sx={{ mr: 2, height: 24, width: 24, color: 'error.main' }}
          />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

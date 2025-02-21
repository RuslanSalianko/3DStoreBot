import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { FileService, ImageService, CategoryService } from '@services/index';

import Page from '@components/page';
import Iconify from '@components/iconify';
import { IFile } from '@models/file.interface';
import { ICategory } from '@models/category.interface';

export const Route = createFileRoute('/_authenticated/dashboard/file/$uuid')({
  loader: async ({ params }) => {
    const file = await FileService.findByUUID(params.uuid);
    const categories = await CategoryService.findAll();
    return { file, categories };
  },
  component: File,
});

function File() {
  const data = Route.useLoaderData();

  const [file, setFile] = useState<IFile>(data.file);
  const [categories, setCategories] = useState<ICategory[]>(data.categories);

  const handleDownload = async () => {
    await FileService.downloadFile(file.uuid, file.format);
  };

  const handleSave = async () => {
    console.log('save');
  };

  const handleChange = () => {};

  const handleAddCategory = () => {};

  return (
    <Page name="File">
      <Stack
        direction={{ xs: 'column', sm: 'column' }}
        spacing={2}
        sx={{
          m: 3,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          label="Name"
          value={file.name}
          sx={{ label: { color: 'text.primary' }, width: '100%' }}
        />
        <TextField
          label="Description"
          value={file.description}
          sx={{ label: { color: 'text.primary' }, width: '100%' }}
          placeholder="Add description"
        />
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category"
            value={file.category?.id}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={-1} onClick={handleAddCategory}>
              <Iconify icon="add" sx={{ mr: 1 }} />
              Add category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          sx={{
            m: 3,
            flexWrap: 'wrap',
            justifyContent: 'left',
            flexDirection: { xs: 'column', sm: 'row', gap: '16px' },
          }}
        >
          {file.images.map((image) => (
            <>
              <Card
                variant="outlined"
                key={image.uuid}
                sx={{
                  m: '0!important',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CardMedia
                  component="img"
                  image={ImageService.getImageUrl(image.uuid)}
                  sx={{ width: 'fit-content', height: 200 }}
                />
              </Card>
            </>
          ))}
        </Stack>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}
        >
          <Button variant="outlined" onClick={handleDownload}>
            <Iconify icon="download" sx={{ mr: 1 }} />
            {`${(file.size / (1024 * 1024)).toFixed(2)} M`}
          </Button>
          <Button variant="outlined" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Page>
  );
}

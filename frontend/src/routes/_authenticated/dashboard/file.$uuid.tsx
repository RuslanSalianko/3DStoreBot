import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

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

import { ModalAddCategory } from '@sections/file/modal';

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

  const [file, setFile] = useState<IFile | undefined>(data.file);
  const [categories, setCategories] = useState<ICategory[]>(data.categories);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: file?.name || '',
      description: file?.description || '',
      categoryId: file?.category ? file.category.id : 0,
    },
    onSubmit: async ({ value }) => {
      const updatedFile = await FileService.update(file?.uuid, value);
      setFile(updatedFile);
    },
    validators: {
      onChange: z.object({
        name: z.string().trim().min(5, { message: 'Min 5 symbols' }),
        description: z.string().trim().min(5, { message: 'Min 5 symbols' }),
        categoryId: z.number(),
      }),
    },
  });

  if (!file) return <h1>File not found</h1>;

  const handleDownload = async () => {
    await FileService.downloadFile(file.uuid, file.format);
  };

  const handleAddCategory = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    const updateCategories = await CategoryService.findAll();
    setCategories(updateCategories);
    setCategoryId(updateCategories.at(-1)?.id || 0);

    setOpen(false);
  };

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: z.string().trim().min(5, {
                message: 'Name must be at least 5 characters long',
              }),
            }}
            children={(field) => (
              <TextField
                error={field.state.meta.errors.length > 0}
                label="Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                helperText={field.state.meta.errors[0]?.message}
                sx={{ label: { color: 'text.primary' }, width: '100%' }}
              />
            )}
          />
          <form.Field
            name="description"
            validators={{
              onChange: z.string().trim(),
            }}
            children={(field) => (
              <TextField
                error={field.state.meta.errors.length > 0}
                label="Description"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                helperText={field.state.meta.errors[0]?.message}
                sx={{ label: { color: 'text.primary' }, width: '100%' }}
                placeholder="Add description"
              />
            )}
          />
          <form.Field
            name="categoryId"
            children={(field) => (
              <FormControl fullWidth>
                <InputLabel
                  id="category-select-label"
                  sx={{ color: 'text.primary' }}
                >
                  Category
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category"
                  value={field.state.value || categoryId}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={(e) =>
                    field.handleChange(categoryId || Number(e.target.value))
                  }
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem value={category.id}>{category.name}</MenuItem>
                  ))}

                  <MenuItem value={0} onClick={handleAddCategory}>
                    <Iconify icon="add" sx={{ mr: 1 }} />
                    Add category
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
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
            <form.Subscribe
              children={() => (
                <Button variant="outlined" type="submit">
                  Save
                </Button>
              )}
            />
          </Stack>
        </form>
      </Stack>
      <ModalAddCategory open={open} handleClose={handleClose} />
    </Page>
  );
}

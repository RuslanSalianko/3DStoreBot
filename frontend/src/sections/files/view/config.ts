export type HeadLabel = {
  id: string;
  label?: string;
  align?: 'left' | 'right' | 'center';
  width?: string;
  minWidth?: string;
};

export const HEAD_LABEL: HeadLabel[] = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'category', label: 'Category' },
  { id: 'size', label: 'Size, MB' },
  { id: 'download', label: 'Download' },
  { id: '' },
];

export const HEAD_LABEL_MINI: HeadLabel[] = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'category', label: 'Category' },
  { id: 'size', label: 'Size, MB' },
  { id: 'download', label: 'Download' },
  { id: '' },
];

export type applyFilterProps<T> = {
  inputData: T[];
  comparator: any;
  filterName: string;
};

export type HeadLabel = {
  id: string;
  label?: string;
  align?: 'left' | 'right' | 'center';
  width?: string;
  minWidth?: string;
};

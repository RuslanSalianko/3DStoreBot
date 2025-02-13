import { useState } from 'react';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

import { TableEmptyRows, TableHead, TableNoData } from '@components/table';
import { emptyRows, getComparator } from '@components/table/utils';
import { applyFilterProps } from '@components/table/types';

import { HEAD_LABEL } from './config';
import FilesTableToolbar from '../files-table-toolbar';
import FilesTableRow from '../files-table-row';

import { IFile } from '@models/file.interface';
import { FileService } from '@/api/services/file.service';

type Props = {
  files: IFile[];
};

function applyFilter({
  inputData,
  comparator,
  filterName,
}: applyFilterProps<IFile>) {
  const stabilizedThis: [IFile, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (data) => data.name.indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return inputData;
}

export default function FilesView({ files }: Props) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<number[]>([]);

  const [orderBy, setOrderBy] = useState<keyof IFile>('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [fileList] = useState<IFile[]>(files);

  const handleSort = (event: React.ChangeEvent<HTMLElement>, id: any) => {
    event.preventDefault();
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = fileList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.ChangeEvent<HTMLElement>, id: number) => {
    event.preventDefault();
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: fileList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDeleteFiles = async () => {
    setSelected([]);
    console.log('handleDeleteFiles');
  };

  const handleDeleteFile = async (uuid: string) => {
    FileService.delete(uuid);
  };

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <>
      <FilesTableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        onDelete={handleDeleteFiles}
      />
      <TableContainer sx={{ overflow: 'unset' }}>
        <Table>
          <TableHead<IFile>
            order={order}
            orderBy={orderBy}
            headLabel={HEAD_LABEL}
            rowCount={fileList.length}
            numSelected={selected.length}
            onRequestSort={handleSort}
            onSelectAllClick={handleSelectAllClick}
          />
          <TableBody>
            {dataFiltered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <FilesTableRow
                  key={row.id}
                  id={row.id}
                  uuid={row.uuid}
                  name={row.name}
                  description={row.description}
                  size={row.size}
                  category={row.category}
                  format={row.format}
                  images={row.images}
                  selected={selected.includes(row.id)}
                  handleClick={(event) => handleClick(event, row.id)}
                  handleDeleteFile={(uuid: string) => handleDeleteFile(uuid)}
                />
              ))}

            <TableEmptyRows
              height={77}
              emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
            />

            {notFound && <TableNoData query={filterName} />}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={page}
        component="div"
        count={fileList.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

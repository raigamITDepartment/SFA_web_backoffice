import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  flexRender 
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import { Button, toast, Alert, Tag } from '@/components/ui';
import DatePicker from '@/components/ui/DatePicker';
import Dialog from '@/components/ui/Dialog';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

interface Invoice {
  id: number;
  invoiceNo: string;
  route: string;
  shop: string;
  territoryCode: string;
  value: number;
  status: string;
  date: string;
}

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <Input
      size="sm"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
  { value: 40, label: '40 / page' },
  { value: 50, label: '50 / page' },
];

const statusOptions = [
  { value: 'Cancel', label: 'Cancel' },
  { value: 'Post Invoice', label: 'Post Invoice' },
];

function CancelBill() {
  const [data, setData] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-2023-001', route: 'Route A', shop: 'Shop 1', territoryCode: 'T001', value: 1500, status: 'Cancel', date: '2023-07-01' },
    { id: 2, invoiceNo: 'INV-2023-002', route: 'Route B', shop: 'Shop 2', territoryCode: 'T002', value: 2300, status: 'Cancel', date: '2023-07-02' },
    { id: 3, invoiceNo: 'INV-2023-003', route: 'Route C', shop: 'Shop 3', territoryCode: 'T003', value: 1750, status: 'Cancel', date: '2023-07-03' },
    { id: 4, invoiceNo: 'INV-2023-004', route: 'Route A', shop: 'Shop 4', territoryCode: 'T001', value: 4200, status: 'Cancel', date: '2023-07-04' },
    { id: 5, invoiceNo: 'INV-2023-005', route: 'Route D', shop: 'Shop 5', territoryCode: 'T002', value: 3100, status: 'Cancel', date: '2023-07-05' },
  ]);
  
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const [from, to] = dateRange;
      return (!from || itemDate >= from) && (!to || itemDate <= to);
    });
  }, [data, dateRange]);

  const handleStatusChange = (invoiceId: number, newStatus: string) => {
    setData(prevData => 
      prevData.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
      )
    );
  };

  const handleSubmit = () => {
    setDialogIsOpen(true);
  };

  const handleDialogConfirm = () => {
    setDialogIsOpen(false);
    toast.push(
      <Alert showIcon type="success" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
        Submitted Successfully
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    );
    console.log('Submitting canceled invoices data:', data);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No:', accessorKey: 'invoiceNo' },
    { header: 'Route', accessorKey: 'route' },
    { 
      header: 'Territory Code', 
      accessorKey: 'territoryCode',
    },
    { header: 'Shop', accessorKey: 'shop' },
    { 
      header: 'Value', 
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="font-medium text-right pr-2">Rs. {getValue<number>().toLocaleString()}</div>
      )
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ getValue }) => <div>{getValue<string>()}</div>,
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }) => (
        <Select
          size="sm"
          options={statusOptions}
          value={statusOptions.find(option => option.value === row.original.status)}
          onChange={(option) => handleStatusChange(row.original.id, option?.value || 'Cancel')}
          className="min-w-[150px]"
        />
      )
    }
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Canceled Invoices</h3>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="mr-2">Search:</span>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              className="w-64"
            />
          </div>
          <div className="w-64">
            <DatePickerRange
              value={dateRange}
              onChange={(newRange) => setDateRange(newRange)}
              placeholder="Select date range"
              clearable={true}
              size="sm"
            />
          </div>
        </div>

        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none flex items-center gap-1'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <Sorter sort={header.column.getIsSorted()} />
                      )}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={filteredData.length}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
          <div className="min-w-[130px]">
            <Select
              size="sm"
              isSearchable={false}
              value={pageSizeOptions.find(option => option.value === pageSize)}
              options={pageSizeOptions}
              onChange={(option) => {
                const size = option?.value ?? 10;
                setPageSize(size);
                table.setPageSize(size);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            variant="solid"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Submission</h5>
        <p>
          Are you sure you want to submit all canceled invoice changes?
        </p>
        <div className="text-right mt-6">
          <Button
            className="mr-2"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            color="blue"
            onClick={handleDialogConfirm}
          >
            Confirm Submit
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default CancelBill;
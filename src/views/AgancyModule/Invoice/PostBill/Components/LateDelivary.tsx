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
  invoiceType?: string;
  routeCode: string;
  shopCode: string;
  customer: string;
  agencyCode: string;
  value: number;
  source?: 'Web' | 'Mobile';
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
  { value: 'Late Delivery', label: 'Late Delivery' },
  { value: 'Post Invoice', label: 'Post Invoice' },
];

function LateDelivary() {
  const [data, setData] = useState<Invoice[]>([
  {
    id: 1,
    invoiceNo: 'INV-2023-001',
    invoiceType: 'Normal',
    routeCode: 'R001',
    shopCode: 'S001',
    customer: 'John Traders',
    agencyCode: 'AG001',
    value: 1500,
    source: 'Mobile',
    status: 'Late Delivery',
    date: '2023-07-01',
  },
  {
    id: 2,
    invoiceNo: 'INV-2023-002',
    invoiceType: 'Company',
    routeCode: 'R002',
    shopCode: 'S002',
    customer: 'Green Mart',
    agencyCode: 'AG002',
    value: 2300,
    source: 'Web',
    status: 'Late Delivery',
    date: '2023-07-03',
  },
  {
    id: 3,
    invoiceNo: 'INV-2023-003',
    invoiceType: 'Agency',
    routeCode: 'R003',
    shopCode: 'S003',
    customer: 'Fresh Foods',
    agencyCode: 'AG003',
    value: 1750,
    source: 'Mobile',
    status: 'Late Delivery',
    date: '2023-07-05',
  },
  {
    id: 4,
    invoiceNo: 'INV-2023-004',
    invoiceType: 'Normal',
    routeCode: 'R001',
    shopCode: 'S004',
    customer: 'Mega Store',
    agencyCode: 'AG001',
    value: 4200,
    source: 'Web',
    status: 'Late Delivery',
    date: '2023-07-01',
  },
  {
    id: 5,
    invoiceNo: 'INV-2023-005',
    invoiceType: 'Company',
    routeCode: 'R004',
    shopCode: 'S005',
    customer: 'Quick Buy',
    agencyCode: 'AG002',
    value: 3100,
    source: 'Mobile',
    status: 'Late Delivery',
    date: '2023-07-04',
  },
  {
    id: 6,
    invoiceNo: 'INV-2023-006',
    invoiceType: 'Agency',
    routeCode: 'R005',
    shopCode: 'S006',
    customer: 'Daily Needs',
    agencyCode: 'AG003',
    value: 2800,
    source: 'Web',
    status: 'Late Delivery',
    date: '2023-07-06',
  },
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
    console.log('Submitting late delivery data:', data);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Invoice Type', accessorKey: 'invoiceType' },
    { header: 'Agency Code', accessorKey: 'agencyCode' },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Shop Code', accessorKey: 'shopCode' },
    { header: 'Customer', accessorKey: 'customer' },

    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="flex items-center justify-end font-semibold text-right pr-2 space-x-1">
          <span>Rs.</span>
          <span>
            {getValue<number>().toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
    },


    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        return new Date(dateStr).toLocaleDateString();
      }
    },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ getValue }) => {
        const source = getValue<'Web' | 'Mobile'>();

        return (
          <span
            className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-full text-xs font-medium ${source === 'Web'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}
          >
            <span>{source === 'Web' ? '🌐' : '📱'}</span>
            <span>{source}</span>
          </span>
        );
      },
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }) => (
        <Select
          size="sm"
          options={statusOptions}
          value={statusOptions.find(option => option.value === row.original.status)}
          onChange={(option) => handleStatusChange(row.original.id, option?.value || 'Late Delivery')}
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Late Delivery</h3>
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
          Are you sure you want to submit all late delivery changes?
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

export default LateDelivary;
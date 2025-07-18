import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { FiEye } from 'react-icons/fi';
import DatePicker from '@/components/ui/DatePicker';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import dayjs from 'dayjs';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

interface Invoice {
  id: number;
  invoiceNo: string;
  route: string;
  bookingValue: number;
  marketReturnValue: number;
  goodReturnValue: number;
  freeIssue: number;
  discountPercentage: number;
  actualValue: number;
  bookingDate: string;
  actualDate: string;
  type: 'Actual' | 'Booking';
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

const typeOptions = [
  { value: 'Actual', label: 'Actual' },
  { value: 'Booking', label: 'Booking' },
];

function ViewInvoices() {
  const distributorName = "Example Distributor";
  const territory = "Central";
  const agencyName = "Example Agency";
  const navigate = useNavigate();

  // Sample data with dates for testing
  const [data, setData] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-2023-001', route: 'Route A', bookingValue: 1500, marketReturnValue: 100, goodReturnValue: 50, freeIssue: 0, discountPercentage: 5, actualValue: 1350, bookingDate: '2023-07-01', actualDate: '2023-07-02', type: 'Actual' },
    { id: 2, invoiceNo: 'INV-2023-002', route: 'Route B', bookingValue: 2300, marketReturnValue: 200, goodReturnValue: 100, freeIssue: 50, discountPercentage: 10, actualValue: 1950, bookingDate: '2023-07-01', actualDate: '2023-07-03', type: 'Booking' },
    { id: 3, invoiceNo: 'INV-2023-003', route: 'Route C', bookingValue: 1800, marketReturnValue: 150, goodReturnValue: 75, freeIssue: 25, discountPercentage: 8, actualValue: 1600, bookingDate: '2023-07-02', actualDate: '2023-07-04', type: 'Actual' },
    { id: 4, invoiceNo: 'INV-2023-004', route: 'Route A', bookingValue: 2100, marketReturnValue: 120, goodReturnValue: 60, freeIssue: 30, discountPercentage: 7, actualValue: 1890, bookingDate: '2023-07-03', actualDate: '2023-07-05', type: 'Booking' },
    { id: 5, invoiceNo: 'INV-2023-005', route: 'Route D', bookingValue: 1900, marketReturnValue: 90, goodReturnValue: 45, freeIssue: 15, discountPercentage: 6, actualValue: 1765, bookingDate: '2023-07-03', actualDate: '2023-07-06', type: 'Actual' },
  ]);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ColumnSort[]>([
    { id: 'bookingDate', desc: true } // Newest first by default
  ]);
  const [pageSize, setPageSize] = useState(10);


  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesType = !typeFilter || item.type === typeFilter;
      const itemDate = new Date(item.bookingDate);
      const [from, to] = dateRange;
      const matchesDate = (!from || itemDate >= from) && (!to || itemDate <= to);
      
      return matchesType && matchesDate;
    });
  }, [data, typeFilter, dateRange]);

  const handleView = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleFilterSubmit = () => {
    // Filtering is already applied reactively
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', 'Rs. ');
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Route', accessorKey: 'route' },
    {
      header: 'Booking Value',
      accessorKey: 'bookingValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>
    },
    {
      header: 'Market Return Value',
      accessorKey: 'marketReturnValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>
    },
    {
      header: 'Good Return Value',
      accessorKey: 'goodReturnValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>
    },
    {
      header: 'Free Issue',
      accessorKey: 'freeIssue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>
    },
    {
      header: 'Discount %',
      accessorKey: 'discountPercentage',
      cell: ({ getValue }) => <div className="text-right">{getValue<number>()}%</div>
    },
    {
      header: 'Actual Value',
      accessorKey: 'actualValue',
      cell: ({ getValue }) => <div className="text-right font-medium">{formatCurrency(getValue<number>())}</div>
    },
    {
      header: 'Booking Date',
      accessorKey: 'bookingDate',
      cell: ({ getValue }) => dayjs(getValue<string>()).format('DD/MM/YYYY'),
      sortingFn: 'datetime'
    },
    {
      header: 'Actual Date',
      accessorKey: 'actualDate',
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format('DD/MM/YYYY') : 'N/A';
      },
      sortingFn: 'datetime'
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <FiEye
            onClick={() => handleView(row.original)}
            className="cursor-pointer text-blue-500 text-lg hover:text-blue-700 transition-colors"
          />
        </div>
      ),
    },
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
      {/* 1st Card - Distributor Info */}
      <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 transition-all">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-16 h-16 flex items-center justify-center shadow-md border border-blue-200 dark:border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{agencyName}</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Distributor
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{distributorName}</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Territory
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{territory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2nd Card - Filters */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              size="sm"
              placeholder="Select Type"
              options={typeOptions}
              value={typeOptions.find(option => option.value === typeFilter) || null}
              onChange={(option) => setTypeFilter(option?.value || null)}
            />
            <DatePickerRange
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              clearable={true}
              size="sm"
            />
          </div>
          <Button
            variant="solid"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
            onClick={handleFilterSubmit}
          >
            Submit
          </Button>
        </div>
      </Card>

      {/* 3rd Card - Summary Counts */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Productive Calls</div>
      <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">0</div>
    </div>
    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg border border-orange-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Unproductive Calls</div>
      <div className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">0</div>
    </div>
    <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg border border-red-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancel Bills</div>
      <div className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">0</div>
    </div>
    <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancel Bill Total</div>
      <div className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">Rs.0</div>
    </div>
    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Day Total</div>
      <div className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">Rs.0</div>
    </div>
    <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reverse Bills</div>
      <div className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
    </div>
    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg border border-indigo-100 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reverse Bill Total</div>
      <div className="mt-1 text-xl font-bold text-indigo-600 dark:text-indigo-400">Rs.0</div>
    </div>
  </div>
</Card>


      {/* 4th Card - Table */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
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
            {table.getRowModel().rows.map((row, index) => {
              const currentDate = dayjs(row.original.bookingDate).format('YYYY-MM-DD');
              const prevDate = index > 0 
                ? dayjs(table.getRowModel().rows[index-1].original.bookingDate).format('YYYY-MM-DD')
                : null;

              return (
                <React.Fragment key={row.id}>
                  {/* Date divider row - appears before each new date group */}
                  {(index === 0 || currentDate !== prevDate) && (
                    <Tr className="bg-gray-100 dark:bg-gray-700 border-t-2 border-b-2 border-gray-200 dark:border-gray-600">
                      <Td colSpan={columns.length} className="text-center py-3 font-semibold">
                        {dayjs(currentDate).format('dddd, MMMM D, YYYY')}
                      </Td>
                    </Tr>
                  )}
                  {/* Regular data row */}
                  <Tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                </React.Fragment>
              );
            })}
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
      </Card>
    </div>
  );
}

export default ViewInvoices;
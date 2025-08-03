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
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import dayjs from 'dayjs';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceType: 'Normal' | 'Agency';
  type: 'Actual' | 'Booking'; // Status
  agencyCode: string;
  routeCode: string;
  shopCode: string;
  customer: string;
  source: 'Web' | 'Mobile';
  bookingValue: number;
  marketReturnValue: number;
  goodReturnValue: number;
  freeIssue: number;
  discountPercentage: number;
  actualValue: number;
  bookingDate: string;
  actualDate: string;
  // Agency/Cascade filter fields
  channel: string;
  subChannel: string;
  region: string;
  area: string;
  territory: string;
  agency: string;
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
  { value: '', label: 'All' },
  { value: 'Actual', label: 'Actual' },
  { value: 'Booking', label: 'Booking' },
];

const invoiceTypeOptions = [
  { value: '', label: 'All' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Agency', label: 'Agency' },
  { value: 'Company', label: 'Company' },
];

// Agency filter options - NO 'All'
const channelOptions = [
  { value: 'National', label: 'National' },
  { value: 'Bakery', label: 'Bakery' },
];
const subChannelOptions = [
  { value: 'SubChannel1', label: 'Sub Channel 1' },
  { value: 'SubChannel2', label: 'Sub Channel 2' },
];
const regionOptions = [
  { value: 'Region1', label: 'Region 1' },
  { value: 'Region2', label: 'Region 2' },
];
const areaOptions = [
  { value: 'Area1', label: 'Area 1' },
  { value: 'Area2', label: 'Area 2' },
];
const territoryOptions = [
  { value: 'Territory1', label: 'Territory 1' },
  { value: 'Territory2', label: 'Territory 2' },
];
const agencyOptions = [
  { value: 'Agency1', label: 'Agency 1' },
  { value: 'Agency2', label: 'Agency 2' },
];

function SalesViewInvoices() {
  const distributorName = 'Example Distributor';
  const territory = 'Central';
  const agencyName = 'Example Agency';
  const navigate = useNavigate();

  // Agency filter states - use null ("not selected")
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  // Dummy data for testing
  const [data] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-2023-001', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG001', routeCode: 'RT001', shopCode: 'SH001', customer: 'John Traders', source: 'Mobile', bookingValue: 1500, marketReturnValue: 100, goodReturnValue: 50, freeIssue: 0, discountPercentage: 5, actualValue: 1350, bookingDate: '2023-07-01', actualDate: '2023-07-02', channel: 'National', subChannel: 'SubChannel1', region: 'Region1', area: 'Area1', territory: 'Territory1', agency: 'Agency1' },
    { id: 2, invoiceNo: 'INV-2023-002', invoiceType: 'Agency', type: 'Booking', agencyCode: 'AG002', routeCode: 'RT002', shopCode: 'SH002', customer: 'Green Mart', source: 'Web', bookingValue: 2300, marketReturnValue: 200, goodReturnValue: 100, freeIssue: 50, discountPercentage: 10, actualValue: 1950, bookingDate: '2023-07-01', actualDate: '2023-07-03', channel: 'National', subChannel: 'SubChannel2', region: 'Region2', area: 'Area2', territory: 'Territory2', agency: 'Agency2' },
    { id: 3, invoiceNo: 'INV-2023-003', invoiceType: 'Agency', type: 'Actual', agencyCode: 'AG003', routeCode: 'RT003', shopCode: 'SH003', customer: 'Fresh Foods', source: 'Mobile', bookingValue: 1800, marketReturnValue: 150, goodReturnValue: 75, freeIssue: 25, discountPercentage: 8, actualValue: 1600, bookingDate: '2023-07-02', actualDate: '2023-07-04', channel: 'Bakery', subChannel: 'SubChannel1', region: 'Region1', area: 'Area1', territory: 'Territory1', agency: 'Agency1' },
    { id: 4, invoiceNo: 'INV-2023-004', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG001', routeCode: 'RT004', shopCode: 'SH004', customer: 'Mega Store', source: 'Web', bookingValue: 4200, marketReturnValue: 300, goodReturnValue: 120, freeIssue: 100, discountPercentage: 7, actualValue: 3680, bookingDate: '2023-07-03', actualDate: '2023-07-05', channel: 'Bakery', subChannel: 'SubChannel2', region: 'Region2', area: 'Area2', territory: 'Territory2', agency: 'Agency2' },
    { id: 5, invoiceNo: 'INV-2023-005', invoiceType: 'Agency', type: 'Booking', agencyCode: 'AG002', routeCode: 'RT005', shopCode: 'SH005', customer: 'Quick Buy', source: 'Mobile', bookingValue: 3100, marketReturnValue: 180, goodReturnValue: 90, freeIssue: 60, discountPercentage: 6, actualValue: 2770, bookingDate: '2023-07-04', actualDate: '2023-07-06', channel: 'National', subChannel: 'SubChannel1', region: 'Region1', area: 'Area1', territory: 'Territory1', agency: 'Agency1' },
  ]);

  // Invoice filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ColumnSort[]>([{ id: 'bookingDate', desc: true }]);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus = !statusFilter || item.type === statusFilter;
      const matchesInvoiceType = !invoiceTypeFilter || item.invoiceType === invoiceTypeFilter;
      const itemDate = new Date(item.bookingDate);
      const [from, to] = dateRange;
      const matchesDate = (!from || itemDate >= from) && (!to || itemDate <= to);

      // Agency filters (null means not selected, so do not filter)
      const matchesChannel = selectedChannel === null || item.channel === selectedChannel;
      const matchesSubChannel = selectedSubChannel === null || item.subChannel === selectedSubChannel;
      const matchesRegion = selectedRegion === null || item.region === selectedRegion;
      const matchesArea = selectedArea === null || item.area === selectedArea;
      const matchesTerritory = selectedTerritory === null || item.territory === selectedTerritory;
      const matchesAgency = selectedAgency === null || item.agency === selectedAgency;

      return (
        matchesStatus &&
        matchesInvoiceType &&
        matchesDate &&
        matchesChannel &&
        matchesSubChannel &&
        matchesRegion &&
        matchesArea &&
        matchesTerritory &&
        matchesAgency
      );
    });
  }, [
    data,
    statusFilter,
    invoiceTypeFilter,
    dateRange,
    selectedChannel,
    selectedSubChannel,
    selectedRegion,
    selectedArea,
    selectedTerritory,
    selectedAgency,
  ]);

  const handleView = (invoice: Invoice) => {
    navigate(`/Salesmenu/SalesInvoiceDetails/${invoice.id}`);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('₹', 'Rs. ');

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Invoice Type', accessorKey: 'invoiceType' },
    { header: 'Status', accessorKey: 'type' },
    { header: 'Agency Code', accessorKey: 'agencyCode' },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Shop Code', accessorKey: 'shopCode' },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Source', accessorKey: 'source' },
    { header: 'Booking Value', accessorKey: 'bookingValue' },
    { header: 'Market Return Value', accessorKey: 'marketReturnValue' },
    { header: 'Good Return Value', accessorKey: 'goodReturnValue' },
    { header: 'Free Issue', accessorKey: 'freeIssue' },
    { header: 'Discount %', accessorKey: 'discountPercentage' },
    { header: 'Actual Value', accessorKey: 'actualValue' },
    { header: 'Booking Date', accessorKey: 'bookingDate' },
    { header: 'Actual Date', accessorKey: 'actualDate' },
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
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">View Invoices</h2>
      {/* Agency Filter Card */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Agency Filter
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-channel"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Channel
      </label>
      <Select
        id="filter-channel"
        size="md"
        options={channelOptions}
        value={channelOptions.find((opt) => opt.value === selectedChannel) || null}
        onChange={(opt) => setSelectedChannel(opt?.value ?? null)}
        placeholder="Select Channel"
        isClearable
      />
    </div>

    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-subchannel"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Sub Channel
      </label>
      <Select
        id="filter-subchannel"
        size="md"
        options={subChannelOptions}
        value={subChannelOptions.find((opt) => opt.value === selectedSubChannel) || null}
        onChange={(opt) => setSelectedSubChannel(opt?.value ?? null)}
        placeholder="Select Sub Channel"
        isClearable
      />
    </div>

    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-region"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Region
      </label>
      <Select
        id="filter-region"
        size="md"
        options={regionOptions}
        value={regionOptions.find((opt) => opt.value === selectedRegion) || null}
        onChange={(opt) => setSelectedRegion(opt?.value ?? null)}
        placeholder="Select Region"
        isClearable
      />
    </div>

    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-area"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Area
      </label>
      <Select
        id="filter-area"
        size="md"
        options={areaOptions}
        value={areaOptions.find((opt) => opt.value === selectedArea) || null}
        onChange={(opt) => setSelectedArea(opt?.value ?? null)}
        placeholder="Select Area"
        isClearable
      />
    </div>

    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-territory"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Territory
      </label>
      <Select
        id="filter-territory"
        size="md"
        options={territoryOptions}
        value={territoryOptions.find((opt) => opt.value === selectedTerritory) || null}
        onChange={(opt) => setSelectedTerritory(opt?.value ?? null)}
        placeholder="Select Territory"
        isClearable
      />
    </div>

    <div className="min-h-[60px] flex flex-col justify-start">
      <label
        htmlFor="filter-agency"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Agency
      </label>
      <Select
        id="filter-agency"
        size="md"
        options={agencyOptions}
        value={agencyOptions.find((opt) => opt.value === selectedAgency) || null}
        onChange={(opt) => setSelectedAgency(opt?.value ?? null)}
        placeholder="Select Agency"
        isClearable
      />
    </div>
  </div>

  <div className="pt-6 flex flex-col sm:flex-row justify-end items-center gap-3">
    <Button
      
      className="px-6"
      onClick={() => {
        setSelectedChannel(null);
        setSelectedSubChannel(null);
        setSelectedRegion(null);
        setSelectedArea(null);
        setSelectedTerritory(null);
        setSelectedAgency(null);
      }}
    >
      Reset
    </Button>
    <Button
      variant="solid"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
      onClick={() => {
        // Add submit logic here if filtering is not reactive
      }}
    >
      Submit
    </Button>
  </div>
</Card>






      {/* Distributor Info Card */}
      <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 transition-all">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-16 h-16 flex items-center justify-center shadow-md border border-blue-200 dark:border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">{agencyName}</h5>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">Distributor</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{distributorName}</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">Territory</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{territory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>


      {/* Filters Card */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Select
                id="status-select"
                size="sm"
                placeholder="All"
                options={typeOptions}
                value={typeOptions.find(o => o.value === statusFilter)}
                onChange={o => setStatusFilter(o?.value ?? '')}
              />
            </div>
            {/* Invoice Type Filter */}
            <div>
              <label htmlFor="invoice-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Type
              </label>
              <Select
                id="invoice-type-select"
                size="sm"
                placeholder="All"
                options={invoiceTypeOptions}
                value={invoiceTypeOptions.find(o => o.value === invoiceTypeFilter)}
                onChange={o => setInvoiceTypeFilter(o?.value ?? '')}
              />
            </div>
            {/* Date Range Filter */}
            <div>
              <label htmlFor="date-range-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <DatePickerRange
                id="date-range-picker"
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
                clearable
                size="sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Counts Card */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Productive Calls</div>
            <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">0</div>
          </div>
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg border border-orange-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Unproductive Calls</div>
            <div className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">0</div>
          </div>
          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg border border-red-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Canceled Bills</div>
            <div className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">0</div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reversed Bills</div>
            <div className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
          </div>
          <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancel Bill Total</div>
            <div className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">Rs.0</div>
          </div>
          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Day Total</div>
            <div className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">Rs.0</div>
          </div>
        </div>
      </Card>

      {/* Main Table Card */}
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
                      className={header.column.getCanSort()
                        ? 'cursor-pointer select-none flex items-center gap-1'
                        : ''}
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
              const prevDate =
                index > 0
                  ? dayjs(table.getRowModel().rows[index - 1].original.bookingDate).format('YYYY-MM-DD')
                  : null;
              return (
                <React.Fragment key={row.id}>
                  {(index === 0 || currentDate !== prevDate) && (
                    <Tr className="bg-gray-100 dark:bg-gray-700 border-t-2 border-b-2 border-gray-200 dark:border-gray-600">
                      <Td colSpan={columns.length} className="text-center py-3 font-semibold">
                        {dayjs(currentDate).format('dddd, MMMM D, YYYY')}
                      </Td>
                    </Tr>
                  )}
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
              value={pageSizeOptions.find((option) => option.value === pageSize)}
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

export default SalesViewInvoices;

import React, { useMemo, useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Button } from '@/components/ui';
import { MdOutlineHistory } from 'react-icons/md';
import Dialog from '@/components/ui/Dialog';
import { toast, Alert } from '@/components/ui';

import DatePicker from '@/components/ui/DatePicker';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

type Invoice = {
  id: number;
  invoiceNo: string;
  route: string;
  shop: string;
  territoryCode: string;
  value: number;
  status: string;
  date: string;
};

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
  { value: 50, label: '50 / page' },
];

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

interface DebouncedInputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  placeholder?: string;
  className?: string;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  className,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <Input
      size="sm"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={className}
      {...props}
    />
  );
}

const ViewBills = () => {
  const [data] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-001', route: 'Route A', shop: 'Shop 1', territoryCode: 'T001', value: 1000, status: 'Actual', date: '2023-07-01' },
    { id: 2, invoiceNo: 'INV-002', route: 'Route B', shop: 'Shop 2', territoryCode: 'T002', value: 2000, status: 'Actual', date: '2023-07-02' },
    { id: 3, invoiceNo: 'INV-003', route: 'Route C', shop: 'Shop 3', territoryCode: 'T003', value: 1500, status: 'Actual', date: '2023-07-05' },
    { id: 4, invoiceNo: 'INV-004', route: 'Route D', shop: 'Shop 4', territoryCode: 'T004', value: 3000, status: 'Actual', date: '2023-07-06' },
  ]);

  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const [from, to] = dateRange;
      return (!from || itemDate >= from) && (!to || itemDate <= to);
    });
  }, [data, dateRange]);

  const handleReverseClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogIsOpen(true);
  };

  const handleDialogConfirm = async () => {
    setDialogIsOpen(false);

    toast.push(
      <Alert
        showIcon
        type="success"
        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
      >
        Invoice {selectedInvoice?.invoiceNo} reversed successfully!
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    );

    console.log('Invoice reversed:', selectedInvoice);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setSelectedInvoice(null);
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Route', accessorKey: 'route' },
    { header: 'Shop', accessorKey: 'shop' },
    { header: 'Territory Code', accessorKey: 'territoryCode' },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="font-semibold text-right pr-2">Rs. {getValue<number>().toLocaleString()}</div>
      )
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
      header: 'Status',
      accessorKey: 'status',
      cell: () => (
        <span className="text-blue-600 font-medium">Actual</span>
      )
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <button 
          className="text-red-600 hover:text-red-800 transition"
          onClick={() => handleReverseClick(row.original)}
        >
          <MdOutlineHistory className="text-xl" title="Reverse" />
        </button>
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
    <div className="p-6 space-y-6">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Example Agency</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Distributor
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Example Distributor</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Territory
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Central C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Actual Bills Reverse </h3>
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
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4"> Accept Reverse Invoice</h5>
        <p>
          Are you sure you want to reverse invoice <b>{selectedInvoice?.invoiceNo}</b>?
          
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
            color="red"
            onClick={handleDialogConfirm}
          >
            Confirm Reverse
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewBills;

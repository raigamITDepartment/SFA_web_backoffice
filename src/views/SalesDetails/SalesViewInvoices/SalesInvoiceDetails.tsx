import React, { useMemo, useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Input from '@/components/ui/Input';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

// ✅ Types for DebouncedInput props
type DebouncedInputProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  [key: string]: any;
};

// ✅ DebouncedInput component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
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
    <div className="flex justify-end">
      <div className="flex items-center mb-4">
        <span className="mr-2">Search:</span>
        <Input size="sm" {...props} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
}

const invoice = {
  InvoiceNumber: 'INV-2023-001',
  AgencyName: 'Sunlight Agency',
  DealerCode: 'SH001',
  OutletName: 'John Traders',
  Address: '123 Main Street, Colombo',
  ContactNumber: '0771234567',
  TotalValue: 1350,
  BookingDate: '2023-07-01',
  ActualDate: '2023-07-02',
  MarketReturnValue: 100,
  GoodReturnValue: 50,
  FreeIssueValue: 150,
  DiscountPercentage: 5,
  TotalDiscountValue: 67.5,
};

const items = [
  {
    itemCode: 'IT001',
    itemName: 'Sunlight Lemon 100g',
    unitPrice: 150,
    bookingQty: 15,
    cancelQty: 2,
    marketReturnQty: 1,
    goodReturnQty: 0,
    freeIssueQty: 3,
    lineDiscountPercentage: 7.5,
    actualQty: 13,
  },
  {
    itemCode: 'IT002',
    itemName: 'Sunlight Rose 200g',
    unitPrice: 99.5,
    bookingQty: 8,
    cancelQty: 0,
    marketReturnQty: 0,
    goodReturnQty: 1,
    freeIssueQty: 0,
    lineDiscountPercentage: 3,
    actualQty: 8,
  },
  {
    itemCode: 'IT003',
    itemName: 'Sunlight Jasmine 400g',
    unitPrice: 250,
    bookingQty: 6,
    cancelQty: 0,
    marketReturnQty: 0,
    goodReturnQty: 0,
    freeIssueQty: 2,
    lineDiscountPercentage: 10,
    actualQty: 6,
  },
  {
    itemCode: 'IT004',
    itemName: 'Sunlight Lavender 250g',
    unitPrice: 180,
    bookingQty: 10,
    cancelQty: 1,
    marketReturnQty: 0,
    goodReturnQty: 0,
    freeIssueQty: 1,
    lineDiscountPercentage: 5,
    actualQty: 9,
  },
  {
    itemCode: 'IT005',
    itemName: 'Sunlight Mint 300g',
    unitPrice: 210,
    bookingQty: 12,
    cancelQty: 0,
    marketReturnQty: 2,
    goodReturnQty: 0,
    freeIssueQty: 0,
    lineDiscountPercentage: 6,
    actualQty: 10,
  },
  {
    itemCode: 'IT006',
    itemName: 'Sunlight Orange 150g',
    unitPrice: 140,
    bookingQty: 7,
    cancelQty: 0,
    marketReturnQty: 1,
    goodReturnQty: 1,
    freeIssueQty: 0,
    lineDiscountPercentage: 4,
    actualQty: 6,
  },
  {
    itemCode: 'IT007',
    itemName: 'Sunlight Vanilla 200g',
    unitPrice: 170,
    bookingQty: 11,
    cancelQty: 0,
    marketReturnQty: 0,
    goodReturnQty: 0,
    freeIssueQty: 2,
    lineDiscountPercentage: 8,
    actualQty: 11,
  },
];


const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

function SalesInvoiceDetails() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
  ];

  const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const itemColumns = useMemo(
    () => [
      { header: 'Item Code', accessorKey: 'itemCode' },
      { header: 'Item Name', accessorKey: 'itemName' },
      {
        header: 'Unit Price',
        accessorKey: 'unitPrice',
        cell: ({ row }: any) => formatCurrency(row.original.unitPrice),
      },
      { header: 'Booking Qty', accessorKey: 'bookingQty' },
      { header: 'Cancel Qty', accessorKey: 'cancelQty' },
      { header: 'Market Return Qty', accessorKey: 'marketReturnQty' },
      { header: 'Good Return Qty', accessorKey: 'goodReturnQty' },
      { header: 'Free Issue Qty', accessorKey: 'freeIssueQty' },
      {
        header: 'Line Discount%',
        accessorKey: 'lineDiscountPercentage',
        cell: ({ row }: any) => `${row.original.lineDiscountPercentage}%`,
      },
      { header: 'Actual Qty', accessorKey: 'actualQty' },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns: itemColumns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    pageCount: Math.ceil(items.length / pageSize),
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  const onSelectChange = (
  newValue: { value: number; label: string } | null
) => {
  if (!newValue) return;
  const newSize = newValue.value;
  setPageSize(newSize);
  table.setPageSize(newSize);
};

  return (
    <>
      <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(invoice).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</p>
              <div className='bg-gray-200 dark:bg-gray-100 p-2 rounded-lg mt-1'>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                {typeof value === 'number' && key.toLowerCase().includes('value')
                  ? formatCurrency(value)
                  : key.toLowerCase().includes('date') && value
                  ? new Date(value).toLocaleDateString('en-GB')
                  : value ?? 'N/A'}
              </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mt-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Invoice Items</h2>
        <DebouncedInput
          value={globalFilter}
          className="mb-4 font-xs shadow border border-block"
          placeholder="Search items..."
          onChange={(value) => setGlobalFilter(value)}
        />
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder && (
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <Sorter sort={header.column.getIsSorted()} />
                      </div>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} className="py-1 text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={items.length}
            onChange={onPaginationChange}
          />
          <div style={{ minWidth: 130 }}>
            <Select
              size="sm"
              isSearchable={false}
              value={pageSizeOptions.find((opt) => opt.value === pageSize)}
              options={pageSizeOptions}
              onChange={onSelectChange}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

export default SalesInvoiceDetails;

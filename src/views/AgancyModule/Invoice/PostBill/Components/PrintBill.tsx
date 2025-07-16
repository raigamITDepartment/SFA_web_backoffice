import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { FaRegEdit } from "react-icons/fa";
import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import Tag from '@/components/ui/Tag';
import { Button, toast, Alert } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

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
  { value: 'Print', label: 'Print' },
  { value: 'Late Delivery', label: 'Late Delivery' },
  { value: 'Cancel', label: 'Cancel' },
];

function PrintBill() {
  const agencyName = "Example Agency";
  const distributorName = "Example Distributor";
  const territory = "Central";
  const navigate = useNavigate();

  const [data, setData] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-2023-001', route: 'Route A', shop: 'Shop 1', territoryCode: 'T001', value: 1500, status: 'Print', date: '2023-07-01' },
    { id: 2, invoiceNo: 'INV-2023-002', route: 'Route B', shop: 'Shop 2', territoryCode: 'T002', value: 2300, status: 'Late Delivery', date: '2023-07-03' },
    { id: 3, invoiceNo: 'INV-2023-003', route: 'Route C', shop: 'Shop 3', territoryCode: 'T003', value: 1750, status: 'Print', date: '2023-07-05' },
    { id: 4, invoiceNo: 'INV-2023-004', route: 'Route A', shop: 'Shop 4', territoryCode: 'T001', value: 4200, status: 'Cancel', date: '2023-07-01' },
    { id: 5, invoiceNo: 'INV-2023-005', route: 'Route D', shop: 'Shop 5', territoryCode: 'T002', value: 3100, status: 'Print', date: '2023-07-04' },
    { id: 6, invoiceNo: 'INV-2023-006', route: 'Route B', shop: 'Shop 6', territoryCode: 'T003', value: 1980, status: 'Late Delivery', date: '2023-07-05' },
    { id: 7, invoiceNo: 'INV-2023-007', route: 'Route E', shop: 'Shop 7', territoryCode: 'T001', value: 2750, status: 'Print', date: '2023-07-06' },
    { id: 8, invoiceNo: 'INV-2023-008', route: 'Route C', shop: 'Shop 8', territoryCode: 'T002', value: 3600, status: 'Cancel', date: '2023-07-06' },
  ]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [filterDate, setFilterDate] = useState('');

  const filteredData = useMemo(() => {
    return filterDate
      ? data.filter(invoice => invoice.date === filterDate)
      : data;
  }, [data, filterDate]);

  const handleStatusChange = (invoiceId: number, newStatus: string) => {
    setData(prevData =>
      prevData.map(invoice =>
        invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
      )
    );
  };

  const handleEdit = (invoice: Invoice) => {
    navigate(`/EditBill/${invoice.id}`);
  };

  const handleSubmit = () => {
    console.log('Submitting invoice data:', data);
    toast.push(
      <Alert showIcon type="success" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
        Invoice Data Submitted Successfully
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    );
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'Print': { color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100', text: 'Print' },
      'Late Delivery': { color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100', text: 'Late Delivery' },
      'Cancel': { color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100', text: 'Cancel' },
    };
    const statusInfo = statusMap[status] || { color: '', text: status };
    return <Tag className={`${statusInfo.color} border-0 rounded`}>{statusInfo.text}</Tag>;
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Route', accessorKey: 'route' },
    {
      header: 'Territory Code',
      accessorKey: 'territoryCode',
    },
    { header: 'Shop', accessorKey: 'shop' },

    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => <div className="font-medium">Rs. {getValue<number>().toLocaleString()}</div>
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
      cell: ({ row }) => (
        <Select
          size="sm"
          options={statusOptions}
          value={statusOptions.find(option => option.value === row.original.status)}
          onChange={(option) => handleStatusChange(row.original.id, option?.value || 'Print')}
          className="min-w-[120px]"
        />
      )
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <FaRegEdit
            onClick={() => handleEdit(row.original)}
            className="cursor-pointer text-primary-deep text-lg hover:text-blue-700 transition-colors"
          />
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  const onSelectChange = (value = 0) => {
    const newSize = Number(value);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6">
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

      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invoice List</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <DebouncedInput
              value={globalFilter ?? ''}
              placeholder="Search invoices..."
              onChange={(value) => setGlobalFilter(String(value))}
            />
            <Input
              type="date"
              size="sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <Table className="overflow-x-auto">
          <THead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>
                    <div
                      className={header.column.getCanSort()
                        ? 'cursor-pointer select-none flex items-center gap-1'
                        : 'flex items-center'}
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
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
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
            onChange={onPaginationChange}
          />
          <div className="min-w-[130px]">
            <Select
              size="sm"
              isSearchable={false}
              value={pageSizeOptions.find(option => option.value === pageSize)}
              options={pageSizeOptions}
              onChange={(option) => onSelectChange(option?.value)}
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
    </div>
  );
}

export default PrintBill;
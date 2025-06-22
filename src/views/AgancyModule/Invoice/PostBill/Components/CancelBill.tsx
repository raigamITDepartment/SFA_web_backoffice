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
  flexRender 
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import { Button,toast,Alert } from '@/components/ui'; 

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface Invoice {
  id: number;
  invoiceNo: string;
  route: string;
  shop: string;
  value: number;
  status: string;
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
    { id: 1, invoiceNo: 'INV-2023-001', route: 'Route A', shop: 'Shop 1', value: 1500, status: 'Cancel' },
    { id: 2, invoiceNo: 'INV-2023-002', route: 'Route B', shop: 'Shop 2', value: 2300, status: 'Cancel' },
    { id: 3, invoiceNo: 'INV-2023-003', route: 'Route C', shop: 'Shop 3', value: 1750, status: 'Cancel' },
    { id: 4, invoiceNo: 'INV-2023-004', route: 'Route A', shop: 'Shop 4', value: 4200, status: 'Cancel' },
    { id: 5, invoiceNo: 'INV-2023-005', route: 'Route D', shop: 'Shop 5', value: 3100, status: 'Cancel' },
  ]);
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const handleStatusChange = (invoiceId: number, newStatus: string) => {
    setData(prevData => 
      prevData.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
      )
    );
  };

  const handleSubmit = () => {
    console.log('Submitting late delivery data:', data);
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
  };

  

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No:', accessorKey: 'invoiceNo' },
    { header: 'Route', accessorKey: 'route' },
    { header: 'Shop', accessorKey: 'shop' },
    { 
      header: 'Value', 
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="font-medium">Rs. {getValue<number>().toLocaleString()}</div>
      )
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
    data,
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

  const totalData = data.length;

  return (
    <div className="p-6 w-full mx-auto">
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Canceled Invoices</h3>
          <div className="w-full sm:w-64">
            <DebouncedInput
              value={globalFilter ?? ''}
              placeholder="Search invoices..."
              onChange={(value) => setGlobalFilter(String(value))}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
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
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} className='py-3 px-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={totalData}
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

        <div className="flex justify-end mt-8 space-x-4">
          
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

export default CancelBill;
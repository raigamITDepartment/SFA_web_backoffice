import React, { useMemo, useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Button, Alert } from '@/components/ui';
import Dialog from '@/components/ui/Dialog';
import DatePicker from '@/components/ui/DatePicker';
import { MdCheckCircleOutline, MdCancel } from 'react-icons/md';
import { toast } from '@/components/ui';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

type ReverseRequest = {
  id: number;
  invoiceNo: string;
  invoiceType?: string;
  routeCode: string;
  shopCode: string;
  customer: string;
  agencyCode: string;
  agencyName: string;
  territory: string;
  value: number;
  source?: 'Web' | 'Mobile';
  remark: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  repRequested: boolean;
  agentRequested: boolean;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

function DebouncedInput({ value: initialValue, onChange, debounce = 500, placeholder, className }: any) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={className}
      size="sm"
    />
  );
}

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 50, label: '50 / page' },
];

function ReverseRequests() {
  const [data, setData] = useState<ReverseRequest[]>([
    {
      id: 1,
      invoiceNo: 'INV-001',
      invoiceType: 'Normal',
      routeCode: 'R101',
      shopCode: 'S10',
      customer: 'Shop A',
      agencyCode: 'AG01',
      agencyName: 'Metro Distributors',
      territory: 'Central C',
      value: 1000,
      source: 'Web',
      remark: 'Incorrect item',
      status: 'Pending',
      date: '2023-07-01',
      repRequested: true,
      agentRequested: false,
    },
    {
      id: 2,
      invoiceNo: 'INV-002',
      invoiceType: 'Agency',
      routeCode: 'R102',
      shopCode: 'S11',
      customer: 'Shop B',
      agencyCode: 'AG02',
      agencyName: 'City Traders',
      territory: 'North Zone',
      value: 1500,
      source: 'Mobile',
      remark: 'Duplicate entry',
      status: 'Pending',
      date: '2023-07-02',
      repRequested: true,
      agentRequested: true,
    },
    {
      id: 3,
      invoiceNo: 'INV-003',
      invoiceType: 'Company',
      routeCode: 'R103',
      shopCode: 'S12',
      customer: 'Shop C',
      agencyCode: 'AG03',
      agencyName: 'Regional Supply',
      territory: 'South Zone',
      value: 2000,
      source: 'Web',
      remark: 'Customer cancelled',
      status: 'Approved',
      date: '2023-07-03',
      repRequested: true,
      agentRequested: true,
    },
  ]);

  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReverseRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const d = new Date(item.date);
      const [from, to] = dateRange;
      return (!from || d >= from) && (!to || d <= to);
    });
  }, [data, dateRange]);

  const handleActionClick = (req: ReverseRequest, type: 'approve' | 'reject') => {
    const canApprove = req.repRequested && req.agentRequested;
    if (type === 'approve' && !canApprove) {
      toast.push(
        <Alert showIcon type="warning" className="w-72 dark:bg-gray-700">
          Both Rep and Agent must request before approval.
        </Alert>,
        { placement: 'top-end', offsetX: 5, offsetY: 100, block: false }
      );
      return;
    }

    setSelectedRequest(req);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedRequest || !actionType) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id
          ? { ...item, status: actionType === 'approve' ? 'Approved' : 'Rejected' }
          : item
      )
    );

    toast.push(
      <Alert showIcon type="success" className="w-72 dark:bg-gray-700">
        Revders requst for invoice <b>{selectedRequest.invoiceNo}</b> {actionType === 'approve' ? 'approved' : 'rejected'} successfully!
      </Alert>,
      { placement: 'top-end', offsetX: 5, offsetY: 100, block: false }
    );

    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const columns = useMemo<ColumnDef<ReverseRequest>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Invoice Type', accessorKey: 'invoiceType' },
    { header: 'Agency Code', accessorKey: 'agencyCode' },
    { header: 'Agency Name', accessorKey: 'agencyName' },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Shop Code', accessorKey: 'shopCode' },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Territory', accessorKey: 'territory' },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="text-right font-semibold pr-2">
          Rs. {getValue<number>().toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ getValue }) => {
        const source = getValue<'Web' | 'Mobile'>();
        return (
          <span className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-full text-xs font-medium ${source === 'Web'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
            <span>{source === 'Web' ? '🌐' : '📱'}</span>
            <span>{source}</span>
          </span>
        );
      },
    },
    {
      header: 'Remark',
      accessorKey: 'remark',
      cell: ({ getValue }) => <span className="whitespace-normal">{getValue<string>()}</span>,
    },
    {
  header: 'Requested By',
  accessorKey: 'requestedBy',
  cell: ({ row }) => {
    const { repRequested, agentRequested } = row.original;

    const renderRow = (label: string, status: boolean) => (
      <div className="flex items-center justify-between w-28 text-xs">
        <span className="font-medium">{label}</span>
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            status
              ? 'bg-green-100 text-green-600 dark:bg-green-800/40 dark:text-green-300'
              : 'bg-red-100 text-red-600 dark:bg-red-800/40 dark:text-red-300'
          }`}
        >
          {status ? '✔️' : '❌'}
        </span>
      </div>
    );

    return (
      <div className="space-y-1">
        {renderRow('Rep', repRequested)}
        {renderRow('Agent', agentRequested)}
      </div>
    );
  },
},
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const s = getValue<'Pending' | 'Approved' | 'Rejected'>();
        const color = s === 'Approved' ? 'text-green-600' : s === 'Rejected' ? 'text-red-600' : 'text-yellow-600';
        return <span className={`font-medium ${color}`}>{s}</span>;
      },
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => {
        const request = row.original;
        const canApprove = request.repRequested && request.agentRequested;
        if (request.status !== 'Pending') return null;
        return (
          <div className="flex gap-2 justify-center">
            <button
              className={`transition ${canApprove ? 'text-green-600 hover:text-green-800' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={() => handleActionClick(request, 'approve')}
              title={canApprove ? 'Approve' : 'Waiting for both requests'}
              disabled={!canApprove}
            >
              <MdCheckCircleOutline className="text-xl" />
            </button>
            <button
              className="text-red-600 hover:text-red-800 transition"
              onClick={() => handleActionClick(request, 'reject')}
              title="Decline"
            >
              <MdCancel className="text-xl" />
            </button>
          </div>
        );
      }
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
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Actual Reverse Requests</h3>
          <div className="flex gap-2 flex-col sm:flex-row items-center">
            <DebouncedInput
              value={globalFilter}
              onChange={(v: any) => setGlobalFilter(String(v))}
              placeholder="Search..."
              className="w-64"
            />
            <DatePickerRange
              value={dateRange}
              onChange={setDateRange}
              placeholder="Date Range"
              clearable
              size="sm"
            />
          </div>
        </div>

        <Table>
          <THead>
            {table.getHeaderGroups().map(hg => (
              <Tr key={hg.id}>
                {hg.headers.map(h => (
                  <Th key={h.id}>
                    <div
                      className={h.column.getCanSort() ? 'cursor-pointer flex items-center gap-1' : undefined}
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && <Sorter sort={h.column.getIsSorted()} />}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map(r => (
              <Tr key={r.id}>
                {r.getVisibleCells().map(c => (
                  <Td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={filteredData.length}
            onChange={(p) => table.setPageIndex(p - 1)}
          />
          <Select
            size="sm"
            isSearchable={false}
            value={pageSizeOptions.find(o => o.value === pageSize)}
            options={pageSizeOptions}
            onChange={(opt) => {
              const size = opt?.value ?? 10;
              setPageSize(size);
              table.setPageSize(size);
            }}
          />
        </div>
      </Card>

      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
        <h5 className="mb-4">{actionType === 'approve' ? 'Approve' : 'Reject'} Request</h5>
        <p>
          Are you sure you want to <b>{actionType}</b> invoice <b>{selectedRequest?.invoiceNo}</b>?
        </p>
        <div className="text-right mt-6">
          <Button className="mr-2" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="solid"
            color={actionType === 'approve' ? 'green' : 'red'}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default ReverseRequests;

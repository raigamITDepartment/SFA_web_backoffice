import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TbPencil, TbEye } from 'react-icons/tb';
import cloneDeep from 'lodash/cloneDeep';
import Tag from '@/components/ui/Tag';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import Input from '@/components/ui/Input';
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable';
import type { TableQueries } from '@/@types/common';

// API Service Functions
const outletService = {
  getOutlets: async (params: TableQueries): Promise<{ data: Outlet[]; total: number }> => {
    // In real app, replace with actual API call:
    // const response = await fetch(`/api/outlets?page=${params.pageIndex}&size=${params.pageSize}`);
    // return response.json();

    // Mock implementation
    return new Promise(resolve => {
      setTimeout(() => {
        const data = generateSampleOutlets(50);
        const pageIndex = params.pageIndex ?? 1;
        const pageSize = params.pageSize ?? 10;
        const paginatedData = data.slice(
          (pageIndex - 1) * pageSize,
          pageIndex * pageSize
        );
        resolve({ data: paginatedData, total: data.length });
      }, 500);
    });
  }
};

// Type Definitions
interface Outlet {
  id: string;
  name: string;
  outletId: string;
  category: string;
  route: string;
  range: string;
  address1: string;
  address2: string;
  address3: string;
  ownerName: string;
  mobileNumber: string;
  openTime: string;
  closeTime: string;
  latitude: string;
  longitude: string;
  outletSequence: string;
  isApproved: boolean;
  status: string;
}

// Constants
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
};

const CATEGORIES = ['Grocery', 'Food City', 'Bakery', 'Restaurant', 'Supermarket'];
const ROUTES = ['Route A', 'Route B', 'Route C', 'Route D'];
const RANGES = ['1-5km', '6-10km', '11-15km', '16-20km'];

// Helper Functions
const generateSampleOutlets = (count: number): Outlet[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `outlet-${i + 1}`,
    name: `Outlet ${i + 1}`,
    outletId: `OUT-${1000 + i}`,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    route: ROUTES[Math.floor(Math.random() * ROUTES.length)],
    range: RANGES[Math.floor(Math.random() * RANGES.length)],
    address1: `#${i * 10}, Main Street`,
    address2: `Block ${String.fromCharCode(65 + (i % 4))}`,
    address3: `City ${Math.ceil(i / 10)}`,
    ownerName: `Owner ${i + 1}`,
    mobileNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    openTime: `${8 + (i % 4)}:00 AM`,
    closeTime: `${8 + (i % 4) + 8}:00 PM`,
    latitude: `${37.77 + (i * 0.01)}`,
    longitude: `-${122.41 + (i * 0.01)}`,
    outletSequence: `${i + 1}`,
    isApproved: i % 4 !== 0,
    status: i % 5 === 0 ? 'blocked' : 'active'
  }));
};

// DebouncedInput Component
interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) {
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
        <Input
          size="sm"
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

// Components
const NameColumn = ({ row }: { row: Outlet }) => (
  <div className="flex items-center">
    <Link
      className="hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100"
      to={`/outlets/${row.id}`}
    >
      {row.name}
    </Link>
  </div>
);

const ActionColumn = ({ onEdit, onView }: { onEdit: () => void; onView: () => void }) => (
  <div className="flex items-center gap-3">
    <Tooltip title="Edit">
      <div className="text-xl cursor-pointer select-none font-semibold" onClick={onEdit}>
        <TbPencil />
      </div>
    </Tooltip>
    {/* <Tooltip title="View">
      <div className="text-xl cursor-pointer select-none font-semibold" onClick={onView}>
        <TbEye />
      </div>
    </Tooltip> */}
  </div>
);

// Main Component
const OutletListTable = () => {
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);
  const [totalOutlets, setTotalOutlets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);
  const [tableData, setTableData] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    sort: { key: '', order: '' },
  });
  const [search, setSearch] = useState('');

  // API Integration Point
  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const response = await outletService.getOutlets(tableData);
      setAllOutlets(response.data);
      setTotalOutlets(response.total);
    } catch (error) {
      console.error('Failed to fetch outlets:', error);
      // Handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
    // eslint-disable-next-line
  }, [tableData]);

  // Filter outlets by search
  useEffect(() => {
    if (!search) {
      setOutlets(allOutlets);
    } else {
      const lower = search.toLowerCase();
      setOutlets(
        allOutlets.filter(
          outlet =>
            outlet.name.toLowerCase().includes(lower) ||
            outlet.outletId.toLowerCase().includes(lower) ||
            outlet.category.toLowerCase().includes(lower) ||
            outlet.route.toLowerCase().includes(lower) ||
            outlet.range.toLowerCase().includes(lower) ||
            outlet.address1.toLowerCase().includes(lower) ||
            outlet.address2.toLowerCase().includes(lower) ||
            outlet.address3.toLowerCase().includes(lower) ||
            outlet.ownerName.toLowerCase().includes(lower) ||
            outlet.mobileNumber.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, allOutlets]);

  // Action Handlers
  // const handleEdit = (outlet: Outlet) => navigate(`/outlets/edit/${outlet.id}`);
  const handleEdit = (outlet: Outlet) =>
    navigate(`/outlets/edit/${outlet.id}`, { state: { outlet } });
  const handleView = (outlet: Outlet) => navigate(`/outlets/${outlet.id}`);
  const handleRowSelect = (checked: boolean, outlet: Outlet) => {
    setSelectedOutlets(prev =>
      checked ? [...prev, outlet] : prev.filter(o => o.id !== outlet.id)
    );
  };
  const handleAllSelect = (checked: boolean, rows: Row<Outlet>[]) => {
    setSelectedOutlets(checked ? rows.map(row => row.original) : []);
  };
  const handlePagination = (page: number) => updateTableData({ pageIndex: page });
  const handlePageSize = (size: number) => updateTableData({ pageIndex: 1, pageSize: size });
  const handleSort = (sort: OnSortParam) => updateTableData({ sort });

  const updateTableData = (update: Partial<TableQueries>) => {
    setTableData(prev => ({ ...prev, ...update }));
  };

  // Table Columns
  const columns = useMemo<ColumnDef<Outlet>[]>(() => [
    { header: 'Name', accessorKey: 'name', cell: ({ row }) => <NameColumn row={row.original} /> },
    { header: 'Outlet ID', accessorKey: 'outletId' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Route', accessorKey: 'route' },
    { header: 'Range', accessorKey: 'range' },
    { header: 'Address 1', accessorKey: 'address1' },
    { header: 'Address 2', accessorKey: 'address2' },
    { header: 'Address 3', accessorKey: 'address3' },
    { header: 'Owner Name', accessorKey: 'ownerName' },
    { header: 'Mobile', accessorKey: 'mobileNumber' },
    { header: 'Open Time', accessorKey: 'openTime' },
    { header: 'Close Time', accessorKey: 'closeTime' },
    { header: 'Latitude', accessorKey: 'latitude' },
    { header: 'Longitude', accessorKey: 'longitude' },
    { header: 'Sequence', accessorKey: 'outletSequence' },
    {
      header: 'Approved',
      accessorKey: 'isApproved',
      cell: ({ row }) => (
        <Tag className={row.original.isApproved
          ? 'bg-emerald-200 text-gray-900'
          : 'bg-red-200 text-gray-900'}>
          {row.original.isApproved ? 'Approved' : 'Not Approved'}
        </Tag>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Tag className={STATUS_COLORS[row.original.status]}>
          {row.original.status}
        </Tag>
      )
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <ActionColumn
          onEdit={() => handleEdit(row.original)}
          onView={() => handleView(row.original)}
        />
      )
    }
  ], []);

  return (
    <>
      <DebouncedInput
        value={search}
        onChange={setSearch}
        placeholder="Search all columns..."
      />
      <DataTable
        selectable
        columns={columns}
        data={outlets}
        loading={loading}
        pagingData={{
          total: totalOutlets,
          pageIndex: tableData.pageIndex as number,
          pageSize: tableData.pageSize as number,
        }}
        onPaginationChange={handlePagination}
        onSelectChange={handlePageSize}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllSelect}
        checkboxChecked={outlet => selectedOutlets.some(o => o.id === outlet.id)}
      />
    </>
  );
};

export default OutletListTable;
import React, { useMemo, useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Tag from '@/components/ui/Tag';

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import type { ChangeEvent } from 'react';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

interface Territory {
    channelCode: string;
    subChannelCode: string;
    regionCode: string;
    areaCode: string;
    range: string;
    territoryCode: string;
    territoryName: string;
    isActive: boolean;
}

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
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
                <Input size='sm' {...props} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        </div>
    );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
};

const Territory = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);

    const columns = useMemo<ColumnDef<Territory>[]>(() => [
        { header: 'Channel Code', accessorKey: 'channelCode' },
        { header: 'Sub-Channel Code', accessorKey: 'subChannelCode' },
        { header: 'Region Code', accessorKey: 'regionCode' },
        { header: 'Area Code', accessorKey: 'areaCode' },
        { header: 'Range', accessorKey: 'range' },
        { header: 'Territory Code', accessorKey: 'territoryCode' },
        { header: 'Territory Name', accessorKey: 'territoryName' },
        {
            header: 'Is Active',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <div className="mr-2 rtl:ml-2">
                    <Tag className={row.original.isActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded" : "text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0"}>
                        {row.original.isActive ? "Active" : "Inactive"}
                    </Tag>
                </div>
            ),
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }) => (
                <div className="flex ">
                    <FaRegEdit onClick={() => handleEdit(row.original)} className="cursor-pointer mr-4 text-primary-deep text-lg" />
                    <MdDeleteOutline onClick={() => handleDelete(row.original)} className="cursor-pointer text-red-600 text-xl" />
                </div>
            ),
        },
    ], []);

    const [data] = useState<Territory[]>([
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'C', territoryCode: 'T1', territoryName: 'Territory 1', isActive: true },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'C', territoryCode: 'T2', territoryName: 'Territory 2', isActive: false },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'C', territoryCode: 'T3', territoryName: 'Territory 3', isActive: true },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'C', territoryCode: 'T4', territoryName: 'Territory 4', isActive: false },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'C', territoryCode: 'T5', territoryName: 'Territory 5', isActive: true },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'D', territoryCode: 'T6', territoryName: 'Territory 6', isActive: false },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'D', territoryCode: 'T7', territoryName: 'Territory 7', isActive: true },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'D', territoryCode: 'T8', territoryName: 'Territory 8', isActive: false },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'D', territoryCode: 'T9', territoryName: 'Territory 9', isActive: true },
        { channelCode: '1', subChannelCode: 'R1A', regionCode: 'R1A', areaCode: 'A1', range: 'D', territoryCode: 'T10', territoryName: 'Territory 10', isActive: false },
    ]);

    const totalData = data.length;

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { columnFilters, globalFilter },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: pageSize } },
    });

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1);
    };

    const onSelectChange = (value = 0) => {
        const newSize = Number(value);
        setPageSize(newSize);
        table.setPageSize(newSize);
    };

    const onCheck = (value: boolean, e: ChangeEvent<HTMLInputElement>) => {
        console.log(value, e);
    };

    const handleEdit = (person: Territory) => {
        // Implement edit functionality here
        console.log('Edit:', person);
    };

    const handleDelete = (person: Territory) => {
        // Implement delete functionality here
        console.log('Delete:', person);
    };

    return (
        <div>
            <div className='flex flex-col lg:flex-row xl:flex-row gap-4'>
                {/* <div className='flex flex-col rounded-xl bg-white'></div> */}

                <Card bordered={false} className='lg:w-1/3 xl:w-1/3 h-1/2'>
                    <h5 className='mb-2'>Territory Creation</h5>
                    <div className='my-2'>
                        <Select size="sm" placeholder="Select Channel" />
                    </div>
                    <div className='my-2'>
                        <Select size="sm" placeholder="Select Sub-Channel" />
                    </div>
                    <div className='my-2'>
                        <Select size="sm" placeholder="Select Region" />
                    </div>
                    <div className='my-2'>
                        <Select size="sm" placeholder="Select Area" />
                    </div>
                    <div className='my-2'>
                        <Select size="sm" placeholder="Select Range" />
                    </div>
                    <div className='my-2'>
                        <Input size="sm" placeholder="Territory Name" />
                    </div>

                    <div>
                        <Checkbox defaultChecked onChange={onCheck} className='mt-3 mb-4'>
                            Active
                        </Checkbox>
                    </div>

                    <Button variant="solid" block>Create</Button>
                </Card>

                <Card bordered={false} className='lg:w-2/3 xl:w-2/3 overflow-auto'>
                    <div>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            className="font-xs shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(value) => setGlobalFilter(String(value))}
                        />
                        <Table className='overflow-auto'>
                            <THead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <Th key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder ? null : (
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
                                            <Td key={cell.id} className='py-1 text-xs'>
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
                                total={totalData}
                                onChange={onPaginationChange}
                            />
                            <div style={{ minWidth: 130 }}>
                                <Select
                                    size="sm"
                                    isSearchable={false}
                                    value={pageSizeOptions.find(option => option.value === pageSize)}
                                    options={pageSizeOptions}
                                    onChange={(option) => onSelectChange(option?.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Territory;
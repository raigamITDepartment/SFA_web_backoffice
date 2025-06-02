import { useState, useMemo, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import FilterForm from './FilterForm';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, TableMeta } from '@tanstack/react-table';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Tag from '@/components/ui/Tag';
import { Select } from '@/components/ui';
import Input from '@/components/ui/Input';

type Item = {
    itemName: string;
    itemCode: string;
    channelId: string;
    subChannelId: string;
    rangeId: string;
    mainCategorySeq: number;
    subCategorySeq: number;
    itemCategorySeq: number;
    isActive: boolean;
};

const { Tr, Th, Td, THead, TBody } = Table;

const staticData: Item[] = [
    {
        itemName: 'Item 1',
        itemCode: 'CODE1',
        channelId: 'Channel 1',
        subChannelId: 'SubChannel 1',
        rangeId: 'Range 1',
        mainCategorySeq: 1,
        subCategorySeq: 2,
        itemCategorySeq: 3,
        isActive: true,
    },
    {
        itemName: 'Item 2',
        itemCode: 'CODE2',
        channelId: 'Channel 2',
        subChannelId: 'SubChannel 2',
        rangeId: 'Range 2',
        mainCategorySeq: 2,
        subCategorySeq: 3,
        itemCategorySeq: 4,
        isActive: false,
    },
    {
        itemName: 'Item 3',
        itemCode: 'CODE3',
        channelId: 'Channel 3',
        subChannelId: 'SubChannel 3',
        rangeId: 'Range 3',
        mainCategorySeq: 3,
        subCategorySeq: 4,
        itemCategorySeq: 5,
        isActive: true,
    },
    {
        itemName: 'Item 4',
        itemCode: 'CODE4',
        channelId: 'Channel 4',
        subChannelId: 'SubChannel 4',
        rangeId: 'Range 4',
        mainCategorySeq: 4,
        subCategorySeq: 5,
        itemCategorySeq: 6,
        isActive: true,
    },
    {
        itemName: 'Item 5',
        itemCode: 'CODE5',
        channelId: 'Channel 5',
        subChannelId: 'SubChannel 5',
        rangeId: 'Range 5',
        mainCategorySeq: 5,
        subCategorySeq: 6,
        itemCategorySeq: 7,
        isActive: false,
    },
    {
        itemName: 'Item 6',
        itemCode: 'CODE6',
        channelId: 'Channel 6',
        subChannelId: 'SubChannel 6',
        rangeId: 'Range 6',
        mainCategorySeq: 6,
        subCategorySeq: 7,
        itemCategorySeq: 8,
        isActive: true,
    },
    {
        itemName: 'Item 7',
        itemCode: 'CODE7',
        channelId: 'Channel 7',
        subChannelId: 'SubChannel 7',
        rangeId: 'Range 7',
        mainCategorySeq: 7,
        subCategorySeq: 8,
        itemCategorySeq: 9,
        isActive: true,
    },
    {
        itemName: 'Item 8',
        itemCode: 'CODE8',
        channelId: 'Channel 8',
        subChannelId: 'SubChannel 8',
        rangeId: 'Range 8',
        mainCategorySeq: 8,
        subCategorySeq: 9,
        itemCategorySeq: 10,
        isActive: false,
    },
    {
        itemName: 'Item 9',
        itemCode: 'CODE9',
        channelId: 'Channel 9',
        subChannelId: 'SubChannel 9',
        rangeId: 'Range 9',
        mainCategorySeq: 9,
        subCategorySeq: 10,
        itemCategorySeq: 11,
        isActive: true,
    },
    {
        itemName: 'Item 10',
        itemCode: 'CODE10',
        channelId: 'Channel 10',
        subChannelId: 'SubChannel 10',
        rangeId: 'Range 10',
        mainCategorySeq: 10,
        subCategorySeq: 11,
        itemCategorySeq: 12,
        isActive: false,
    },
    {
        itemName: 'Item 11',
        itemCode: 'CODE11',
        channelId: 'Channel 11',
        subChannelId: 'SubChannel 11',
        rangeId: 'Range 11',
        mainCategorySeq: 11,
        subCategorySeq: 12,
        itemCategorySeq: 13,
        isActive: true,
    },
    {
        itemName: 'Item 12',
        itemCode: 'CODE12',
        channelId: 'Channel 12',
        subChannelId: 'SubChannel 12',
        rangeId: 'Range 12',
        mainCategorySeq: 12,
        subCategorySeq: 13,
        itemCategorySeq: 14,
        isActive: false,
    },
];

const totalData = staticData.length;

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

// Extend TableMeta to add updateData function
interface CustomMeta extends TableMeta<Item> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const SequenceTable = () => {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState(staticData);
    const [originalData] = useState(staticData);

    const handleDelete = (item: Item) => {
        setData(prevData => prevData.filter(d => d.itemCode !== item.itemCode));
    };

    // Editable cell renderer pattern
    const EditableNumberCell = ({ getValue, row, column, table, disabled }: any) => {
        const initialValue = getValue() as number;
        const [value, setValue] = useState(initialValue);

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        const onBlur = () => {
            const newValue = Number(value);
            if (!isNaN(newValue)) {
                table.options.meta?.updateData(row.index, column.id, newValue);
            }
        };

        return (
            <Input
                type="number"
                className="border-transparent bg-transparent hover:border-gray-300 focus:bg-white rounded px-1 py-0.5 w-full max-w-[80px]"
                size="sm"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                onBlur={onBlur}
                min={0}
                disabled={disabled} // Set the disabled prop
            />
        );
    };

    const columns = useMemo<ColumnDef<Item>[]>(
        () => [
            { header: 'Item Name', accessorKey: 'itemName', enableSorting: true },
            { header: 'Item Code', accessorKey: 'itemCode', enableSorting: true },
            { header: 'Channel', accessorKey: 'channelId', enableSorting: true },
            { header: 'Sub-channel', accessorKey: 'subChannelId', enableSorting: true },
            { header: 'Range', accessorKey: 'rangeId', enableSorting: true },
            { 
                header: 'Main Category Seq', 
                accessorKey: 'mainCategorySeq',
                cell: (props) => <EditableNumberCell {...props} disabled={true} />,
                enableSorting: true
            },
            { 
                header: 'Sub Category Seq', 
                accessorKey: 'subCategorySeq',
                cell: (props) => <EditableNumberCell {...props} disabled={true} />, 
                enableSorting: true
            },
            { 
                header: 'Item Seq',  
                accessorKey: 'itemCategorySeq',
                cell: EditableNumberCell,
                enableSorting: true
            },
            { 
                header: 'Is Active', 
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <div className="mr-2 rtl:ml-2">
                        <Tag className={row.original.isActive 
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded" 
                            : "text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0"}>
                            {row.original.isActive ? "Active" : "Inactive"}
                        </Tag>
                    </div>
                )
            },
            { 
                header: 'Action', 
                accessorKey: 'action',
                cell: ({ row }) => (
                    <div className="flex ">
                        <FaRegEdit 
                            onClick={() => console.log('Edit:', row.original)} 
                            className="cursor-pointer mr-4 text-primary-deep text-lg" 
                        />
                        <MdDeleteOutline 
                            onClick={() => handleDelete(row.original)} 
                            className="cursor-pointer text-red-600 text-xl" 
                        />
                    </div>
                )
            },
        ],
        []
    );

    const table = useReactTable<Item>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setData(old =>
                    old.map((row, index) => 
                        index === rowIndex ? { ...row, [columnId]: value } : row
                    )
                );
            },
        } as CustomMeta,
    });

    const onPaginationChange = (page: number) => table.setPageIndex(page - 1);

    const onSelectChange = (value = 0) => {
        const newSize = Number(value);
        setPageSize(newSize);
        table.setPageSize(newSize);
    };

    const onSubmit = (values: any) => {
        const filteredData = originalData.filter(item => {
            return (
                (values.itemName ? item.itemName.includes(values.itemName) : true) &&
                (values.itemCode ? item.itemCode.includes(values.itemCode) : true) &&
                (values.channelId ? item.channelId.includes(values.channelId) : true) &&
                (values.subChannelId ? item.subChannelId.includes(values.subChannelId) : true)
            );
        });
        setData(filteredData);
    };

    const onReset = () => {
        setData(originalData);
    };

    return (
        <div>
            <FilterForm onSubmit={onSubmit} onReset={onReset} />
            <Table>
                <THead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={`flex items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : 'text-gray-500'}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === 'asc' ? (
                                                <HiArrowUp className="ml-1" />
                                            ) : header.column.getIsSorted() === 'desc' ? (
                                                <HiArrowDown className="ml-1" />
                                            ) : null}
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map(row => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
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
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOption.find(option => option.value === pageSize)}
                        options={pageSizeOption}
                        onChange={option => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SequenceTable;

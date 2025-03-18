import React, { useMemo, useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Tag from '@/components/ui/Tag';
import { useForm, Controller } from 'react-hook-form';
import { FormItem, Form } from '@/components/ui/Form';

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

type FormSchema = {
    channel: string;
    subChannel: string;
    region: string;
    area: string;
    territory: string;
    agencyName: string;
    isActive: boolean;
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

interface FinalGeography {
    channelCode: string;
    channelName: string;
    subChannelCode: string;
    subChannelName: string;
    regionCode: string;
    regionName: string;
    areaCode: string;
    areaName: string;
    territoryId: string;
    territoryName: string;
    agencyName: string;
    isActive: boolean;
    updatedDateTime: string;
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

const FinalGeography = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [editData, setEditData] = useState<FinalGeography | null>(null);

    const columns = useMemo<ColumnDef<FinalGeography>[]>(() => [
        { header: 'Channel Code', accessorKey: 'channelCode' },
        { header: 'Channel Name', accessorKey: 'channelName' },
        { header: 'Sub-channel Code', accessorKey: 'subChannelCode' },
        { header: 'Sub-channel Name', accessorKey: 'subChannelName' },
        { header: 'Region Code', accessorKey: 'regionCode' },
        { header: 'Region Name', accessorKey: 'regionName' },
        { header: 'Area Code', accessorKey: 'areaCode' },
        { header: 'Area Name', accessorKey: 'areaName' },
        { header: 'Territory ID', accessorKey: 'territoryId' },
        { header: 'Territory Name', accessorKey: 'territoryName' },
        { header: 'Agency Name', accessorKey: 'agencyName' },
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
        { header: 'Updated Date & Time', accessorKey: 'updatedDateTime' },
    ], []);

    const [data, setData] = useState<FinalGeography[]>([
        { channelCode: '1', channelName: 'Channel 1', subChannelCode: 'R1A', subChannelName: 'Sub-channel 1', regionCode: 'R1A', regionName: 'Region 1', areaCode: 'A1', areaName: 'Area 1', territoryId: 'T1', territoryName: 'Territory 1', agencyName: 'Agency 1', isActive: true, updatedDateTime: '2025-03-17 10:00:00' },
        { channelCode: '2', channelName: 'Channel 1', subChannelCode: 'R1A', subChannelName: 'Sub-channel 1', regionCode: 'R1A', regionName: 'Region 1', areaCode: 'A1', areaName: 'Area 1', territoryId: 'T2', territoryName: 'Territory 2', agencyName: 'Agency 2', isActive: false, updatedDateTime: '2025-03-17 10:00:00' },
        // Add more sample data as needed
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

    const handleEdit = (finalGeography: FinalGeography) => {
        setEditData(finalGeography);
    };

    const handleDelete = (finalGeography: FinalGeography) => {
        setData(data.filter(item => item.territoryId !== finalGeography.territoryId));
    };

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            territory: '',
            agencyName: '',
            isActive: true,
        },
    });

    const onSubmit = async (values: FormSchema) => {
        if (editData) {
            // Update existing entry
            setData(data.map(item => (item.territoryId === editData.territoryId ? { ...item, ...values } : item)));
        } else {
            // Create new entry
            const newEntry = {
                ...values,
                territoryId: `T${data.length + 1}`, // Generate a new territory ID
                updatedDateTime: new Date().toISOString(),
            };
            setData([...data, newEntry]);
        }
        reset();
        setEditData(null);
    };

    useEffect(() => {
        if (editData) {
            reset(editData);
        }
    }, [editData, reset]);

    return (
        <div>
            <div className='flex flex-col lg:flex-row xl:flex-row gap-4'>
                <Card bordered={false} className='w-full h-full overflow-auto'>
                    <h5 className='mb-2'>Final Geography</h5>
                    <div>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            className="font-xs shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(value) => setGlobalFilter(String(value))}
                        />
                        <Table>
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
            {editData && (
                <Card bordered={false} className='w-full mt-4'>
                    <h5 className='mb-2'>Update Final Geography</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem invalid={Boolean(errors.channel)} errorMessage={errors.channel?.message}>
                            <Controller
                                name="channel"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        options={[
                                            { label: 'Channel 1', value: 'Channel 1' },
                                            { label: 'Channel 2', value: 'Channel 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Channel is required' }}
                            />
                        </FormItem>
                        <FormItem invalid={Boolean(errors.subChannel)} errorMessage={errors.subChannel?.message}>
                            <Controller
                                name="subChannel"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Sub-channel"
                                        options={[
                                            { label: 'Sub-channel 1', value: 'Sub-channel 1' },
                                            { label: 'Sub-channel 2', value: 'Sub-channel 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Sub-channel is required' }}
                            />
                        </FormItem>
                        <FormItem invalid={Boolean(errors.region)} errorMessage={errors.region?.message}>
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Region"
                                        options={[
                                            { label: 'Region 1', value: 'Region 1' },
                                            { label: 'Region 2', value: 'Region 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Region is required' }}
                            />
                        </FormItem>
                        <FormItem invalid={Boolean(errors.area)} errorMessage={errors.area?.message}>
                            <Controller
                                name="area"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Area"
                                        options={[
                                            { label: 'Area 1', value: 'Area 1' },
                                            { label: 'Area 2', value: 'Area 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Area is required' }}
                            />
                        </FormItem>
                        <FormItem invalid={Boolean(errors.territory)} errorMessage={errors.territory?.message}>
                            <Controller
                                name="territory"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Territory"
                                        options={[
                                            { label: 'Territory 1', value: 'Territory 1' },
                                            { label: 'Territory 2', value: 'Territory 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Territory is required' }}
                            />
                        </FormItem>
                        <FormItem invalid={Boolean(errors.agencyName)} errorMessage={errors.agencyName?.message}>
                            <Controller
                                name="agencyName"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Agency"
                                        options={[
                                            { label: 'Agency 1', value: 'Agency 1' },
                                            { label: 'Agency 2', value: 'Agency 2' },
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{ required: 'Agency is required' }}
                            />
                        </FormItem>
                        <FormItem>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) =>
                                    <Checkbox {...field} checked={field.value}>
                                        Is Active
                                    </Checkbox>
                                }
                            />
                        </FormItem>
                        <FormItem>
                            <Button variant="solid" block type="submit">{editData ? 'Update' : 'Create'}</Button>
                        </FormItem>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default FinalGeography;
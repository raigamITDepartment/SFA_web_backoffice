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
import { useNavigate } from 'react-router-dom';

type FormSchema = {
    MainCategoryCode: string;
    MainCategoryName: string;
    isActive: boolean;
    CategoryType?: string;
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

interface MainCategory {
    MainCategoryCode: string;
    MainCategoryName: string;
    isActive?: boolean;
    CategoryType?: string;
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

const MainCategory = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [channelName, setChannelName] = useState<string>('');
    const navigate = useNavigate();

    const columns = useMemo<ColumnDef<MainCategory>[]>(() => [
        { header: 'Main Category Code', accessorKey: 'MainCategoryCode' },
        { header: 'Main Category Name', accessorKey: 'MainCategoryName' },
        {
            header: 'Category Type',
            accessorKey: 'CategoryType',
            cell: ({ row }) => (
                <span>{row.original.CategoryType || '-'}</span>
            ),
        },
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
                    <FaRegEdit
                        onClick={() => handleEdit(row.original)}
                        className="cursor-pointer mr-4 text-primary-deep text-lg"
                    />
                    <MdDeleteOutline
                        onClick={() => handleDelete(row.original)}
                        className="cursor-pointer text-red-600 text-xl"
                    />
                </div>
            ),
        },
    ], []);

    const [data] = useState<MainCategory[]>([
        { MainCategoryCode: '1', MainCategoryName: 'Soya', isActive: true, CategoryType: 'Type 1' },
        { MainCategoryCode: '2', MainCategoryName: 'Dewani 1', isActive: false, CategoryType: 'Type 2' },
        { MainCategoryCode: '3', MainCategoryName: 'Aryaa', isActive: true, CategoryType: 'Type 1' },
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

    const handleEdit = (MainCategory: MainCategory) => {
        // Navigate to MainCategoryEdit page
        navigate('/Salesmenu/MainCategoryEdit');
    };

    const handleDelete = (MainCategory: MainCategory) => {
        // Implement delete functionality here
        console.log('Delete:', MainCategory);
    };

    const handleCreate = () => {
        setError(null);
        console.log('Create category:', { MainCategoryName: channelName });
    };

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            MainCategoryName: '',
            isActive: true,
            CategoryType: '',
        },
    });

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
    };

    return (
        <div>
            <div className='flex flex-col lg:flex-row xl:flex-row gap-4'>
                <div className='flex-row lg:w-1/3 xl:w-1/3 h-1/2'>
                    <Card bordered={false} className='mb-4'>
                        <h5 className='mb-2'>Category Creation</h5>
                        <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                            <FormItem
                                invalid={Boolean(errors.MainCategoryName)}
                                errorMessage={errors.MainCategoryName?.message}
                            >
                                <Controller
                                    name="MainCategoryName"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Category Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                invalid={Boolean(errors.CategoryType)}
                                errorMessage={errors.CategoryType?.message}
                            >
                                <Controller
                                    name="CategoryType"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Select
                                            size="md"
                                            placeholder="Category Type"
                                            options={[
                                                { label: 'Type 1', value: 'Type 1' } as any,
                                                { label: 'Type 2', value: 'Type 2' },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) =>
                                        <Checkbox {...field} checked={field.value}>
                                            IsActive
                                        </Checkbox>
                                    }
                                />
                            </FormItem>

                            <FormItem>
                                <Button variant="solid" block type="submit">Create</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </div>

                <Card bordered={false} className='lg:w-2/3 xl:w-2/3 overflow-auto'>
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
        </div>
    );
};

export default MainCategory;
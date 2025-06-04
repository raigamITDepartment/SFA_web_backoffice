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
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import DatePicker from '@/components/ui/DatePicker'
import { useRef } from 'react'
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
    range: string;
    territoryName: string;
    isActive: boolean;
    targetValue?: string;
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

const { DatePickerRange } = DatePicker

interface Territory {
    areaCode: string;
    territoryCode: string;
    territoryName: string;
    targetValue: string;
    pcTarget: string;
    dateRange: string;
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

const TerritoryWise = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [dialogData, setDialogData] = useState<FormSchema | null>(null)

    const columns = useMemo<ColumnDef<Territory>[]>(() => [
        { header: 'Area Code', accessorKey: 'areaCode' },
        { header: 'Territory Code', accessorKey: 'territoryCode' },
        { header: 'Territory Name', accessorKey: 'territoryName' },
        {
            header: 'Target Value',
            accessorKey: 'targetValue',
            cell: ({ row }) => (
                <span>{row.original.targetValue}</span>
            ),
        },
        {
            header: 'PC Target',
            accessorKey: 'pcTarget',
            cell: ({ row }) => (
                <span>{row.original.pcTarget}</span>
            ),
        },
        {
            header: 'Date Range',
            accessorKey: 'dateRange',
            cell: ({ row }) => (
                <span className="min-w-[160px] inline-block">{row.original.dateRange}</span>
            ),
        },
    ], []);

    // Use state for table data
    const [territories, setTerritories] = useState<Territory[]>([
        {
            areaCode: 'A01',
            territoryCode: 'T01',
            territoryName: 'Colombo North',
            targetValue: '100000',
            pcTarget: '500',
            dateRange: '2024-06-01 ~ 2024-06-30',
        },
        {
            areaCode: 'A02',
            territoryCode: 'T02',
            territoryName: 'Kandy Central',
            targetValue: '120000',
            pcTarget: '600',
            dateRange: '2024-06-01 ~ 2024-06-30',
        },
        {
            areaCode: 'A03',
            territoryCode: 'T03',
            territoryName: 'Galle South',
            targetValue: '90000',
            pcTarget: '400',
            dateRange: '2024-06-01 ~ 2024-06-30',
        },
    ]);

    const table = useReactTable({
        data: territories,
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

    const handleEdit = (territory: Territory) => {
        // Implement edit functionality here
        console.log('Edit:', territory);
    };

    const handleDelete = (territory: Territory) => {
        // Implement delete functionality here
        console.log('Delete:', territory);
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
            range: '',
            territoryName: '',
            isActive: true, // Set default value to true
        },
    });

    const onSubmit = async (values: FormSchema) => {
        setDialogData(values) // Optionally pass form data to dialog
        openDialog()
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        setIsOpen(false)
    }

    return (
        <div>
            <div className='flex flex-col gap-4'>

                <Card bordered={false} className='w-full h-1/2'>
                    <h5 className='mb-2'>Territory Wise Target</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <FormItem
                                invalid={Boolean(errors.channel)}
                                errorMessage={errors.channel?.message}
                            >
                                <Controller
                                    name="channel"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Channel"
                                            options={[
                                                { label: 'National Channel', value: 'National Channel' } as any,
                                                { label: 'Bakery Channel', value: 'Bakery Channel' },
                                            ]}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                        />
                                    }
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                if (!value) {
                                                    return 'Required';
                                                }
                                                return;
                                            }
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                invalid={Boolean(errors.subChannel)}
                                errorMessage={errors.subChannel?.message}
                            >
                                <Controller
                                    name="subChannel"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Sub-Channel"
                                            options={[
                                                { label: 'Sub-Channel 1', value: 'Sub-Channel 1' } as any,
                                                { label: 'Sub-Channel 2', value: 'Sub-Channel 2' },
                                            ]}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                        />
                                    }
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                if (!value) {
                                                    return 'Required';
                                                }
                                                return;
                                            }
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                invalid={Boolean(errors.region)}
                                errorMessage={errors.region?.message}
                            >
                                <Controller
                                    name="region"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Region"
                                            options={[
                                                { label: 'Region 1', value: 'Region 1' } as any,
                                                { label: 'Region 2', value: 'Region 2' },
                                            ]}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                        />
                                    }
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                if (!value) {
                                                    return 'Required';
                                                }
                                                return;
                                            }
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                invalid={Boolean(errors.area)}
                                errorMessage={errors.area?.message}
                            >
                                <Controller
                                    name="area"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Area"
                                            options={[
                                                { label: 'Area 1', value: 'Area 1' } as any,
                                                { label: 'Area 2', value: 'Area 2' },
                                            ]}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                        />
                                    }
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                if (!value) {
                                                    return 'Required';
                                                }
                                                return;
                                            }
                                        }
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                invalid={Boolean(errors.range)}
                                errorMessage={errors.range?.message}
                            >
                                <Controller
                                    name="range"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Range"
                                            options={[
                                                { label: 'Range 1', value: 'Range 1' } as any,
                                                { label: 'Range 2', value: 'Range 2' },
                                            ]}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                        />
                                    }
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                if (!value) {
                                                    return 'Required';
                                                }
                                                return;
                                            }
                                        }
                                    }}
                                />
                            </FormItem>

                        </div>
                        <FormItem>
                            <span className="font-bold ">Territory List:</span>
                            <div className="flex items-center gap-4 mt-6">

                                <FormItem className="mb-0">
                                    <Controller
                                        name="territoryName"
                                        control={control}
                                        render={({ field }) =>
                                            <Input
                                                disabled
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Territory Name"
                                                {...field}
                                            />
                                        }
                                    />
                                </FormItem>
                                <FormItem className="mb-0">
                                    <Controller
                                        name="targetValue"
                                        control={control}
                                        render={({ field }) =>
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Target Value"
                                                {...field}
                                            />
                                        }
                                    />
                                </FormItem>
                                <div>
                                    {/* <RangePicker /> */}
                                    <DatePickerRange placeholder="Select dates range" />
                                </div>
                            </div>
                        </FormItem>
                        <FormItem>
                            <div className="flex justify-center gap-4">
                                <Button
                                    className="lg:w-70 xl:w-70 sm:w-full"
                                    variant="solid"
                                    block
                                    type="submit"
                                >
                                    Submit
                                </Button>
                                <Button
                                    className="lg:w-70 xl:w-70 sm:w-full"
                                    type="button"
                                    block
                                    clickFeedback={false}
                                    customColorClass={({ active, unclickable }) =>
                                        [
                                            'hover:text-red-800 dark:hover:bg-red-600 border-0 hover:ring-0',
                                            active ? 'bg-red-200' : 'bg-red-100',
                                            unclickable && 'opacity-50 cursor-not-allowed',
                                            !active && !unclickable && 'hover:bg-red-200',
                                        ].filter(Boolean).join(' ')
                                    }
                                    onClick={() => {
                                        reset();
                                    }}
                                >
                                    Discard
                                </Button>
                            </div>
                        </FormItem>

                    </Form>
                </Card>

                <Card bordered={false} className='w-full overflow-auto'>
                    <div>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            className="font-xs shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(value) => setGlobalFilter(String(value))}
                        />

                        <div className="min-w-[900px]">
                            <Table>
                                <THead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <Th key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder ? null : (
                                                        <div>
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                                                <Td key={cell.id} className='py-1 px-0 text-sm break-words whitespace-normal'>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <Pagination
                                pageSize={table.getState().pagination.pageSize}
                                currentPage={table.getState().pagination.pageIndex + 1}
                                total={territories.length}
                                onChange={onPaginationChange}
                            />
                            <div style={{ minWidth: 130 }}>
                                <Select
                                    size="lg"
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

export default TerritoryWise;
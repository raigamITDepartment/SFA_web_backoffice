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
import DatePicker from '@/components/ui/DatePicker'
import { useNavigate } from 'react-router-dom'
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
import { Button, toast, Alert } from '@/components/ui';
import { HiCheckCircle } from 'react-icons/hi';

type FormSchema = {
    channel: string;
    subChannel: string;
    region: string;
    area: string;
    range: string;
    territoryName: string;
    isActive: boolean;
    targetValue?: string;
    dateRange?: [Date?, Date?];
};

const { Tr, Th, Td, THead, TBody } = Table;

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
    isActive?: boolean;
    channel?: string;
    subChannel?: string;
    region?: string;
    area?: string;
    range?: string;
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
    // Filter states for select options
    const [channelFilter, setChannelFilter] = useState('');
    const [subChannelFilter, setSubChannelFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState('');
    const [rangeFilter, setRangeFilter] = useState('');

    // Month filter state
    const [monthRange, setMonthRange] = useState<[Date | null, Date | null]>([null, null]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const navigate = useNavigate();

    const [territories, setTerritories] = useState<Territory[]>([
        {
            areaCode: 'A01',
            territoryCode: 'T01',
            territoryName: 'Colombo North',
            targetValue: '100000',
            pcTarget: '500',
            dateRange: '2024-06-01 ~ 2024-06-30',
            isActive: true,
            channel: 'National Channel',
            subChannel: 'Sub-Channel 1',
            region: 'Region 1',
            area: 'Area 1',
            range: 'Range 1',
        },
        {
            areaCode: 'A02',
            territoryCode: 'T02',
            territoryName: 'Kandy Central',
            targetValue: '120000',
            pcTarget: '600',
            dateRange: '2024-06-01 ~ 2024-06-30',
            isActive: false,
            channel: 'Bakery Channel',
            subChannel: 'Sub-Channel 2',
            region: 'Region 2',
            area: 'Area 2',
            range: 'Range 2',
        },
        {
            areaCode: 'A03',
            territoryCode: 'T03',
            territoryName: 'Galle South',
            targetValue: '90000',
            pcTarget: '400',
            dateRange: '2024-06-01 ~ 2024-06-30',
            isActive: true,
            channel: 'National Channel',
            subChannel: 'Sub-Channel 1',
            region: 'Region 1',
            area: 'Area 1',
            range: 'Range 2',
        },
    ]);

    // Filtered territories based on select filters and month filter
    const filteredTerritories = useMemo(() => {
        return territories.filter(t => {
            const baseFilter =
                (!channelFilter || t.channel === channelFilter) &&
                (!subChannelFilter || t.subChannel === subChannelFilter) &&
                (!regionFilter || t.region === regionFilter) &&
                (!areaFilter || t.area === areaFilter) &&
                (!rangeFilter || t.range === rangeFilter);

            if (!monthRange[0] || !monthRange[1]) return baseFilter;

            // Parse territory dateRange (format: "YYYY-MM-DD ~ YYYY-MM-DD")
            const [startStr, endStr] = (t.dateRange || '').split('~').map(s => s.trim());
            if (!startStr || !endStr) return false;
            const terrStart = new Date(startStr);
            const terrEnd = new Date(endStr);
            const filterStart = monthRange[0];
            const filterEnd = monthRange[1];

            // Check if ranges overlap
            const overlap = terrStart <= filterEnd && terrEnd >= filterStart;
            return baseFilter && overlap;
        });
    }, [territories, channelFilter, subChannelFilter, regionFilter, areaFilter, rangeFilter, monthRange]);

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
            header: 'Date Range',
            accessorKey: 'dateRange',
            cell: ({ row }) => (
                <span className="min-w-[160px] inline-block">{row.original.dateRange}</span>
            ),
        },
        {
            header: 'Is Active',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <div className="ml-4 rtl:ml-2">
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
                        className="cursor-pointer text-red-600 text-lg hover:text-red-800"
                        title="Delete"
                    />
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: filteredTerritories,
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

    const handleEdit = (territory: Territory) => {
        navigate('/Salesmenu/TerritoryWiseEdit');
    };

    // Delete logic with dialog and toast
    const handleDelete = (territory: Territory) => {
        setSelectedTerritory(territory);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setSelectedTerritory(null);
    };

    const handleDeleteDialogConfirm = () => {
        setDeleteDialogOpen(false);
        if (selectedTerritory) {
            setTerritories(prev =>
                prev.filter(t => t.territoryCode !== selectedTerritory.territoryCode)
            );
            toast.push(
                <Alert
                    showIcon
                    type="danger"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    Territory target for <b>{selectedTerritory.territoryName}</b> removed!
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                }
            );
            setSelectedTerritory(null);
        }
    };

    // Success dialog for create
    const handleSuccessDialogClose = () => {
        setSuccessDialog(false);
    };

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            range: '',
            territoryName: '',
            isActive: true,
            targetValue: '',
            dateRange: undefined,
        },
    });

    // Watch select values and update filter states
    useEffect(() => {
        setChannelFilter(watch('channel'));
        setSubChannelFilter(watch('subChannel'));
        setRegionFilter(watch('region'));
        setAreaFilter(watch('area'));
        setRangeFilter(watch('range'));
    }, [watch('channel'), watch('subChannel'), watch('region'), watch('area'), watch('range')]);

    const onSubmit = async (values: FormSchema) => {
        setTerritories(prev => [
            ...prev,
            {
                areaCode: 'A' + (prev.length + 1).toString().padStart(2, '0'),
                territoryCode: 'T' + (prev.length + 1).toString().padStart(2, '0'),
                territoryName: values.territoryName || `Territory ${prev.length + 1}`,
                targetValue: values.targetValue || '',
                pcTarget: '',
                dateRange: values.dateRange
                    ? `${values.dateRange[0]?.toLocaleDateString?.() ?? ''} ~ ${values.dateRange[1]?.toLocaleDateString?.() ?? ''}`
                    : '',
                isActive: values.isActive,
                channel: values.channel,
                subChannel: values.subChannel,
                region: values.region,
                area: values.area,
                range: values.range,
            },
        ]);
        setSuccessDialog(true);
        reset();
    };

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
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                setChannelFilter(selectedOption ?? '');
                                            }}
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
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                setSubChannelFilter(selectedOption ?? '');
                                            }}
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
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                setRegionFilter(selectedOption ?? '');
                                            }}
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
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                setAreaFilter(selectedOption ?? '');
                                            }}
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
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                setRangeFilter(selectedOption ?? '');
                                            }}
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
                            <div className="flex flex-col gap-2 mt-6">
                                {filteredTerritories.length === 0 && (
                                    <div className="text-gray-400 italic">No territories found.</div>
                                )}
                                {filteredTerritories.map((territory) => (
                                    <div key={territory.territoryCode} className="flex items-center gap-4">
                                        <Input
                                            disabled
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Territory Name"
                                            value={territory.territoryName}
                                            className="mb-0"
                                        />
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Target Value"
                                            value={territory.targetValue}
                                            className="mb-0"
                                        // onChange={...} // Add if you want to allow editing
                                        />
                                        <DatePickerRange
                                            placeholder="Select dates range"
                                            value={
                                                (() => {
                                                    if (!territory.dateRange) return [null, null];
                                                    const [start, end] = territory.dateRange.split('~').map(s => s.trim());
                                                    const startDate = start ? new Date(start) : null;
                                                    const endDate = end ? new Date(end) : null;
                                                    return [isNaN(startDate as any) ? null : startDate, isNaN(endDate as any) ? null : endDate];
                                                })()
                                            }
                                        // onChange={...} // Add if you want to allow editing
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="lg:w-25 xl:w-25 sm:w-full text-red-600 border-red-600 border-2 hover:border-3 hover:border-red-400 hover:ring-0 hover:text-red-600 hover:text-sm"
                                            onClick={() => {
                                                setTerritories(prev =>
                                                    prev.map(t =>
                                                        t.territoryCode === territory.territoryCode
                                                            ? { ...t, targetValue: '', dateRange: '' }
                                                            : t
                                                    )
                                                );
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                ))}
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                            <DebouncedInput
                                value={globalFilter ?? ''}
                                className="font-xs shadow border border-block"
                                placeholder="Search all columns..."
                                onChange={(value) => setGlobalFilter(String(value))}
                            />
                            <div>
                                <DatePickerRange
                                    placeholder="Filter by Date Range"
                                    value={monthRange}
                                    onChange={setMonthRange}
                                />
                            </div>
                        </div>
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
                                total={filteredTerritories.length}
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

                {/* Delete Confirmation Dialog */}
                <Dialog
                    isOpen={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onRequestClose={handleDeleteDialogClose}
                >
                    <h5 className="mb-4">Remove Territorywise Target</h5>
                    <p>
                        Are you sure you want to remove the territorywise target value for{' '}
                        <b>{selectedTerritory?.territoryName}</b>?
                    </p>
                    <div className="text-right mt-6">
                        <Button
                            className="mr-2 text-red-600 border-red-600 border-2 hover:border-red-800 hover:ring-0 hover:text-red-600"
                            clickFeedback={false}
                            onClick={handleDeleteDialogClose}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={handleDeleteDialogConfirm}>
                            Confirm
                        </Button>
                    </div>
                </Dialog>

                {/* Success Dialog for Create */}
                <Dialog
                    isOpen={successDialog}
                    onClose={handleSuccessDialogClose}
                    onRequestClose={handleSuccessDialogClose}
                >
                    <div className="flex flex-col items-center justify-center py-6">
                        <HiCheckCircle className="text-4xl text-emerald-500 mb-2" />
                        <div className="font-semibold text-lg mb-2">Territory Created!</div>
                        <div className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                            The new territory targets have been successfully added.
                        </div>
                        <Button
                            variant="solid"
                            onClick={handleSuccessDialogClose}
                        >
                            OK
                        </Button>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default TerritoryWise;
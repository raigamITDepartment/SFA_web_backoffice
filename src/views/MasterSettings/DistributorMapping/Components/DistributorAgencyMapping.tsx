import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { toast, Alert } from '@/components/ui';
import Dialog from '@/components/ui/Dialog';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';

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
    distributorName: string;
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

interface DistributorAgencyMapping {
    id: number;
    distributorName: string;
    agencyName: string;
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

const DistributorAgencyMapping = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [selectedMapping, setSelectedMapping] = useState<DistributorAgencyMapping | null>(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const showToastRef = useRef(false);
    const [data, setData] = useState<DistributorAgencyMapping[]>([
        { id: 1, distributorName: 'Distributor 1', agencyName: 'Agency 1', isActive: true },
        { id: 2, distributorName: 'Distributor 2', agencyName: 'Agency 2', isActive: false },
        { id: 3, distributorName: 'Distributor 3', agencyName: 'Agency 3', isActive: true },
        { id: 4, distributorName: 'Distributor 4', agencyName: 'Agency 4', isActive: false },
        { id: 5, distributorName: 'Distributor 5', agencyName: 'Agency 5', isActive: true },
    ]);
    const navigate = useNavigate();

    const columns = useMemo<ColumnDef<DistributorAgencyMapping>[]>(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Distributor Name', accessorKey: 'distributorName' },
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
    ], [data]);

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

    const handleEdit = (mapping: DistributorAgencyMapping) => {
        navigate(`/Master-menu-DistributorMapping/agency-edit/${mapping.id}`);
    };

    const handleDelete = (mapping: DistributorAgencyMapping) => {
        setSelectedMapping(mapping);
        setDialogIsOpen(true);
    };

    const handleDialogClose = () => {
        setDialogIsOpen(false);
        setSelectedMapping(null);
    };

    const handleDialogConfirm = () => {
        setDialogIsOpen(false);
        if (selectedMapping) {
            setData(prev => prev.filter(d => d.id !== selectedMapping.id));
            toast.push(
                <Alert
                    showIcon
                    type={selectedMapping.isActive ? 'danger' : 'success'}
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {selectedMapping.isActive ? 'Deactivating' : 'Activating'} Mapping
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                }
            );
            setSelectedMapping(null);
        }
    };

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            distributorName: '',
            agencyName: '',
            isActive: true,
        },
    });

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500));
        setData(prev => [
            ...prev,
            {
                ...values,
                id: prev.length ? Math.max(...prev.map(d => d.id)) + 1 : 1,
            }
        ]);
        setSuccessDialog(true);
        showToastRef.current = true;
        reset();
    };

    const handleSuccessDialogClose = () => {
        setSuccessDialog(false);
        if (showToastRef.current) {
            toast.push(
                <Alert
                    showIcon
                    type="success"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    Mapping created!...
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                }
            );
            showToastRef.current = false;
        }
    };

    return (
        <div>
            <div className='flex flex-col lg:flex-row xl:flex-row gap-4'>
                <Card bordered={false} className='lg:w-1/3 xl:w-1/3 h-1/2'>
                    <h5 className='mb-2'>Distributor Agency Mapping</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            invalid={Boolean(errors.distributorName)}
                            errorMessage={errors.distributorName?.message}
                        >
                            <Controller
                                name="distributorName"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Distributor"
                                        options={[
                                            { label: 'Distributor 1', value: 'Distributor 1' } as any,
                                            { label: 'Distributor 2', value: 'Distributor 2' },
                                            { label: 'Distributor 3', value: 'Distributor 3' },
                                            { label: 'Distributor 4', value: 'Distributor 4' },
                                            { label: 'Distributor 5', value: 'Distributor 5' },
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
                            invalid={Boolean(errors.agencyName)}
                            errorMessage={errors.agencyName?.message}
                        >
                            <Controller
                                name="agencyName"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Agency"
                                        options={[
                                            { label: 'Agency 1', value: 'Agency 1' } as any,
                                            { label: 'Agency 2', value: 'Agency 2' },
                                            { label: 'Agency 3', value: 'Agency 3' },
                                            { label: 'Agency 4', value: 'Agency 4' },
                                            { label: 'Agency 5', value: 'Agency 5' },
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

                <Card bordered={false} className='lg:w-2/3 xl:w-2/3 h-1/2 overflow-auto'>
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
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Remove Mapping</h5>
                <p>
                    Are you sure you want to {selectedMapping?.isActive ? 'Deactivate' : 'Activate'}{' '}
                    <b>{selectedMapping?.distributorName} - {selectedMapping?.agencyName}</b>?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="mr-2"
                        clickFeedback={false}
                        customColorClass={({ active, unclickable }) =>
                            [
                                'hover:text-red-600 border-red-600 border-2 hover:border-red-800 hover:ring-0 text-red-600 ',
                                unclickable && 'opacity-50 cursor-not-allowed',
                                !active && !unclickable,
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleDialogConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
            <Dialog isOpen={successDialog} onClose={handleSuccessDialogClose}>
                <div className="flex flex-col items-center p-6">
                    <HiCheckCircle className="text-green-500 mb-2" size={48} />
                    <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                        Mapping created successfully!
                    </div>
                    <Button className="mt-6" variant="solid" onClick={handleSuccessDialogClose}>
                        OK
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default DistributorAgencyMapping;
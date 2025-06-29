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
import { fetchAgencyDistributors, deleteAgencyDistributors, distributorOptions, mapAgency } from '@/services/DemarcationService'
import {MdBlock, MdCheckCircleOutline  } from 'react-icons/md'
import {fetchAgencies} from '@/services/singupDropdownService'
import CreatableSelect from 'react-select/creatable'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

export type MapAreaRegionFormSchema = {
    userId: number;
    agencyId: number[]; 
    distributorId: number | null;
    isActive: boolean;
};


const validationSchema: ZodType<MapAreaRegionFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'),
    agencyId: z.array(z.number()).min(1, 'Please select at least one agency'),
    distributorId: z.number({ required_error: 'Please select region' }).nullable(),
    isActive: z.boolean(),
});



const DistributorAgencyMapping = (props: MapAreaRegionFormSchema) => {
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const { disableSubmit = false, className, setMessage } = props
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [selectedMapping, setSelectedMapping] = useState<DistributorAgencyMapping | null>(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const showToastRef = useRef(false);
    const [distributorAgencies, setDistributorAgencies] = useState<DistributorAgencyMapping[]>([])
    const [agency, setAgency] = useState<any>([])
    const [selectedAgencies, setSelectedAgencies] = useState<number[]>([]);
    const [distributor, setDistributor] = useState<any>([])
    const navigate = useNavigate();

    const loadDistributorAgencies = async () => {
        try {
            const daOptions = await fetchAgencyDistributors();
            setDistributorAgencies(daOptions);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    useEffect(() => {
        loadDistributorAgencies();
    }, []);

    useEffect(() => {
            const loadAgencies = async () => {
                try {
                    const agencyOptions = await fetchAgencies()
                    setAgency(agencyOptions)
                } catch (error) {
                    setMessage?.('Failed to load channels.')
                }
            }
            loadAgencies()
    }, [setMessage]);

    useEffect(() => {
            const loadDistributors = async () => {
                try {
                    const distributorOption = await distributorOptions()
                    setDistributor(distributorOption)
                } catch (error) {
                    setMessage?.('Failed to load channels.')
                }
            }
            loadDistributors()
    }, [setMessage])

    const data = distributorAgencies

    const totalData = data.length;

    const columns = useMemo<ColumnDef<DistributorAgencyMapping>[]>(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Distributor Name', accessorKey: 'distributorName' },
        { header: 'Agency Name', accessorKey: 'agencyName' },
        {
                header: 'Is Active',
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <div className="mr-2 rtl:ml-2">
                        <Tag
                            className={
                                row.original.isActive
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded'
                                    : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                            }
                        >
                            {row.original.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </div>
                ),
            },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const ADode = row.original
                return (
                    <div className="flex space-x-2">
                        {ADode.isActive && (
                            <FaRegEdit
                                className="text-blue-500 text-base cursor-pointer"
                                title="Edit"
                                onClick={() => handleEditClick(ADode)}
                            />
                        )}
                        {ADode.isActive ? (
                            <MdBlock
                                className="text-red-500 text-lg cursor-pointer"
                                title="Deactivate Channel"
                                onClick={() => handleDeleteClick(ADode)}
                            />
                        ) : (
                            <MdCheckCircleOutline
                                className="text-green-500 text-lg cursor-pointer"
                                title="Activate User"
                                onClick={() => handleDeleteClick(ADode)}
                            />
                        )}
                    </div>
                )
            },
        }
    ], [data]);

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

    const handleEditClick = (mapping: DistributorAgencyMapping) => {
        navigate(`/Master-menu-DistributorMapping/agency-edit/${mapping.id}`);
    };

    const handleDeleteClick = (mapping: DistributorAgencyMapping) => {
        setSelectedMapping(mapping);
        setDialogIsOpen(true);
    };

    const handleDialogClose = () => {
        setDialogIsOpen(false);
        setSelectedMapping(null);
    };

    const handleDialogConfirm = async () => {
            setDialogIsOpen(false);
    
            if (selectedMapping) {
                const isDeactivating = selectedMapping?.isActive;
    
                toast.push(
                    <Alert
                        showIcon
                        type={isDeactivating ? 'danger' : 'success'}
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                    >
                        {isDeactivating ? 'Deactivating' : 'Activating'} Channel
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 100,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    }
                );
    
                try {
                    await deleteAgencyDistributors(selectedMapping.id);
                    await loadDistributorAgencies();
                } catch (error) {
                    console.error('Failed to delete Distributors:', error);
                } finally {
                    loadDistributorAgencies();
                }
            }
        };

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<MapAreaRegionFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber,
            agencyId: [], 
            distributorId: null,
            isActive: true,
        }
    });

    const onSubmit = async (values: MapAreaRegionFormSchema) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
        const payload = {
            agencyDistributorDTOList: values.agencyId.map((id) => ({
                userId: values.userId,
                agencyId: id,
                distributorId: values.distributorId,
                isActive: values.isActive,
            })),
        };

            const result = await mapAgency(payload);

            if (result?.status === 'failed') {
                setMessage?.(result.message);
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <HiCheckCircle className="text-green-500 mb-2" size={48} />
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            New Agency mapped successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 100,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    }
                );
                reset();
                await loadDistributorAgencies();
            }
        }catch (err: any) {
            let backendMessage = 'An error occurred during mapping agency. Please try again.';

            const response = err?.response;
            const data = response?.data;

            if (data) {
                if (typeof data.payload === 'string') {
                    backendMessage = data.payload;
                } else if (typeof data.message === 'string') {
                    backendMessage = data.message;
                }
            } else if (typeof err.message === 'string') {
                backendMessage = err.message;
            }

            toast.push(
                <Alert
                    showIcon
                    type="danger"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {backendMessage}
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            );
        }finally {
            setIsSubmitting(false);
        }
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
                            invalid={Boolean(errors.distributorId)}
                            errorMessage={errors.distributorId?.message}
                        >
                            <Controller
                                name="distributorId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Distributor"
                                        options={distributor}
                                        value={distributor.find(option => option.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value ?? null)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                                label="Multi Select Agencies"
                                invalid={Boolean(errors.agencyId)}
                                errorMessage={errors.agencyId?.message}
                            >
                                <Controller
                                    name="agencyId"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            isMulti
                                            componentAs={CreatableSelect}
                                            options={agency}
                                            value={agency.filter(
                                                (option: { value: number }) =>
                                                    Array.isArray(field.value)
                                                        ? field.value.includes(option.value)
                                                        : false
                                            )}
                                            onChange={(selected) => {
                                                const ids = Array.isArray(selected) ? selected.map((opt) => opt.value) : [];
                                                field.onChange(ids);
                                                setSelectedAgencies(ids);
                                            }}
                                        />
                                    }
                                />
                        </FormItem>

                        <FormItem>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>
                                        IsActive
                                    </Checkbox>
                                )}
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
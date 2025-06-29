import React, { useMemo, useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { FaRegEdit } from "react-icons/fa";
import Tag from '@/components/ui/Tag';
import { useForm, Controller } from 'react-hook-form';
import { FormItem, Form } from '@/components/ui/Form';
import { toast, Alert } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'
import {MdBlock, MdCheckCircleOutline  } from 'react-icons/md'
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
import Checkbox from '@/components/ui/Checkbox';;
import { useNavigate } from 'react-router-dom'
import { fetchDistributors, deleteDistributor, addNewDistributor } from '@/services/DemarcationService'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
];

interface Distributor {
    id: number;
    distributorName: string;
    address1: string;
    address2: string;
    address3: string;
    sapAgencyCode: string;
    mobile: string;
    email: string;
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

export type AddDistributorFormSchema = {
    userId: number;
    distributorName: string;
    email: string;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    mobileNo: string;
    isActive: boolean;
};



const validationSchema: ZodType<AddDistributorFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    distributorName: z.string({ required_error: 'Distributor name is required' }),
    email: z
    .string({ required_error: 'Please enter email' })
    .email('Invalid email address'),
    address1: z.string().default(''),
    address2: z.string().default(''),
    address3: z.string().default(''),
    mobileNo: z.string({ required_error: 'Mobile Number is required' }),
    isActive: z.boolean(),
});


const DistributorCreation = (props: AddDistributorFormSchema) => {
    const { disableSubmit = false, className, setMessage } = props
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const [distributors, setDistributors] =  useState<Distributor[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const navigate = useNavigate();

    const loadDistributors = async () => {
        try {
            const channelOptions = await fetchDistributors();
            setDistributors(channelOptions);
            console.log('Fetched distributors:', channelOptions);

        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    useEffect(() => {
        loadDistributors();
    }, []);

    const data = distributors

    const totalData = data.length;

    const columns = useMemo<ColumnDef<Distributor>[]>(() => [
        { header: 'Distributor Name', accessorKey: 'distributorName', cell: ({ getValue }) => getValue() ?? 'N/A'  },
        { header: 'Address 1', accessorKey: 'address1', cell: ({ getValue }) => getValue() ?? 'N/A'  },
        { header: 'Address 2', accessorKey: 'address2',   cell: ({ getValue }) => {
            const value = getValue();
            return value === null || value === undefined || value === '' ? 'N/A' : value;
        }  },
        { header: 'Address 3', accessorKey: 'address3',   cell: ({ getValue }) => {
            const value = getValue();
            return value === null || value === undefined || value === '' ? 'N/A' : value;
        }  },
        { header: 'Mobile', accessorKey: 'mobileNo', cell: ({ getValue }) => getValue() ?? 'N/A'  },
        { header: 'Email', accessorKey: 'email', cell: ({ getValue }) => getValue() ?? 'N/A'  },
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
                const DCode = row.original
                return (
                    <div className="flex space-x-2">
                        {DCode.isActive && (
                            <FaRegEdit
                                className="text-blue-500 text-base cursor-pointer"
                                title="Edit"
                                onClick={() => handleEditClick(DCode)}
                            />
                        )}
                        {DCode.isActive ? (
                            <MdBlock
                                className="text-red-500 text-lg cursor-pointer"
                                title="Deactivate Channel"
                                onClick={() => handleDeleteClick(DCode)}
                            />
                        ) : (
                            <MdCheckCircleOutline
                                className="text-green-500 text-lg cursor-pointer"
                                title="Activate User"
                                onClick={() => handleDeleteClick(DCode)}
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

    const handleEditClick = (distributor: Distributor) => {
        navigate(`/Master-menu-DistributorMapping/edit/${distributor.id}`);
    };

    const handleDeleteClick = (distributor: Distributor) => {
        setSelectedDistributor(distributor);
        setDialogIsOpen(true);
    };

    const handleDialogClose = () => {
        setDialogIsOpen(false);
        setSelectedDistributor(null);
    };

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false);

        if (selectedDistributor) {
            const isDeactivating = selectedDistributor?.isActive;

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
                await deleteDistributor(selectedDistributor.id);
                await loadDistributors();
            } catch (error) {
                console.error('Failed to delete Distributors:', error);
            } finally {
                setDistributors([]);
            }
        }
    };

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<AddDistributorFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber, 
            distributorName: '',
            address1: '',
            address2: '',
            address3: '',
            mobileNo: '',
            email: '',
            isActive: true,
        },
    });


    const onSubmit = async (values: AddDistributorFormSchema) => {
        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)
        try {
            const result = await addNewDistributor(values);

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            New Distributer added successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 30,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    },
                )
                reset();
                await loadDistributors();
            }
        }catch (err: any) {
        
                    let backendMessage = 'An error occurred during adding new Distributer. Please try again.';
        
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
                } finally {
            setIsSubmitting(false)
        }
    };
    

    return (
        <div>
            <div className='flex flex-col lg:flex-row xl:flex-row gap-4'>
                <Card bordered={false} className='lg:w-1/3 xl:w-1/3 h-1/2'>
                    <h5 className='mb-2'>Distributor Creation</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        
                        <FormItem
                            invalid={Boolean(errors.distributorName)}
                            errorMessage={errors.distributorName?.message}
                        >
                            <Controller
                                name="distributorName"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Distributor Name"
                                        {...field}
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
                            invalid={Boolean(errors.address1)}
                            errorMessage={errors.address1?.message}
                        >
                            <Controller
                                name="address1"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Address 1"
                                        {...field}
                                        value={field.value ?? ''}
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
                            invalid={Boolean(errors.address2)}
                            errorMessage={errors.address2?.message}
                        >
                            <Controller
                                name="address2"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Address 2"
                                        {...field}
                                        value={field.value ?? ''}
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
                            invalid={Boolean(errors.address3)}
                            errorMessage={errors.address3?.message}
                        >
                            <Controller
                                name="address3"
                                control={control}
                                render={({ field }) =>
                                <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Address 3"
                                {...field}
                                value={field.value ?? ''}
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
                            invalid={Boolean(errors.mobileNo)}
                            errorMessage={errors.mobileNo?.message}
                        >
                            <Controller
                                name="mobileNo"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Mobile"
                                        {...field}
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
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        type="email"
                                        autoComplete="off"
                                        placeholder="Email"
                                        {...field}
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
                <h5 className="mb-4">Remove Distributor</h5>
                <p>
                    Are you sure you want to {selectedDistributor?.isActive ? 'Deactivate' : 'Activate'}{' '}
                    <b>{selectedDistributor?.distributorName}</b>?
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
            <Dialog isOpen={successDialog} onClose={() => setSuccessDialog(false)}>
                <div className="flex flex-col items-center p-6">
                    <HiCheckCircle className="text-green-500 mb-2" size={48} />
                    <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                        Distributor created successfully!
                    </div>
                    <Button className="mt-6" variant="solid" onClick={() => setSuccessDialog(false)}>
                        OK
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default DistributorCreation;


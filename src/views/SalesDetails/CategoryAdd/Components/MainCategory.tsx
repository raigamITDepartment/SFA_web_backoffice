import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { FaRegEdit } from 'react-icons/fa'
import Dialog from '@/components/ui/Dialog'
import { MdBlock, MdCheckCircleOutline } from 'react-icons/md'
import Tag from '@/components/ui/Tag'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button, toast, Alert } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'

import { useNavigate } from 'react-router-dom'
import {
    fetchCategories,
    fetchMainCategoriesAll,
    addNewMainCategory,deleteMainCategory
} from '@/services/CategoryServices'

type MainCategoryFormSchema = {
    userId: number
    catTypeId: number | null
    itemMainCat: string
    isActive: boolean
}

interface MainCategoryProps {
    setMessage?: (message: string) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface MainCategoryData {
    id: string
    MainCategoryCode: string
    MainCategoryName: string
    isActive?: boolean
    CategoryType?: string
    catTypeId?: number
}

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value, onChange, debounce])

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
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const MainCategory = (props: MainCategoryProps) => {
    const { setMessage } = props
    //const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId')
    const userIdNumber = Number(userId)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
   // const [error, setError] = useState<string | null>(null)
   
    const navigate = useNavigate()
    const [categoryType, setCategoryType] = useState<any>([])
    const [selectedMainCategory, setSelectedMainCategory] = useState<
        MainCategoryData[]
    >([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    
    const [MainSelectCategory, setMainSelectCategory] = useState<MainCategoryData | null>(null)
     const [dialogIsOpen, setDialogIsOpen] = useState(false)

    useEffect(() => {
        const loadCategoryTypes = async () => {
            try {
                const categoryData = await fetchCategories()
                const categoryOptions = categoryData.map((category: any) => ({
                    label: category.categoryType,
                    value: category.id,
                }))
                setCategoryType(categoryOptions)
            } catch (error) {
                setMessage?.('Failed to load category types.')
            }
        }
        loadCategoryTypes()
    }, [setMessage])

    const loadMainCategory = async () => {
        try {
            const response = await fetchMainCategoriesAll() // Original API response
            const mapped: MainCategoryData[] = response.map((item: any) => ({
                id: String(item.id),
                MainCategoryCode: String(item.mainCatSeq),
                MainCategoryName: item.itemMainCat,
                CategoryType: item.categoryType,
                isActive: item.isActive,
                catTypeId: item.catTypeId,
            }))
            setSelectedMainCategory(mapped)
        } catch (err) {
            console.error('Failed to load categories:', err)
        }
    }

    useEffect(() => {
        loadMainCategory()
    }, [])

    const columns = useMemo<ColumnDef<MainCategoryData>[]>(
        () => [
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
                header: 'Action',
                accessorKey: 'action',
                cell: ({ row }) => {
                    const MainCatCode = row.original
                    return (
                        <div className="flex ">
                            <FaRegEdit
                                onClick={() => handleEdit(MainCatCode)}
                                className="cursor-pointer mr-4 text-primary-deep text-lg"
                            />
                            {MainCatCode.isActive ? (
                                <MdBlock
                                    className="text-red-500 text-lg cursor-pointer"
                                    title="Deactivate main category"
                                    onClick={() => handleDeleteClick(MainCatCode)}
                                />
                            ) : (
                                <MdCheckCircleOutline
                                    className="text-green-500 text-lg cursor-pointer"
                                    title="Activate Main Category"
                                    onClick={() => handleDeleteClick(MainCatCode)}
                                />
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const totalData = selectedMainCategory.length

    const table = useReactTable({
        data: selectedMainCategory,
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
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        setPageSize(newSize)
        table.setPageSize(newSize)
    }

    // const onCheck = (value: boolean, e: ChangeEvent<HTMLInputElement>) => {
    //     console.log(value, e);
    // };
  const handleDialogConfirm = async () => {
    setDialogIsOpen(false)
    if (MainSelectCategory) {
        const isDeactivating = MainSelectCategory?.isActive
        const actionText = isDeactivating ? 'Deactivated' : 'Activated'

        try {
            await deleteMainCategory(MainSelectCategory.id)
            await loadMainCategory() // This will refresh the table with the latest data

            toast.push(
                <Alert showIcon type="success">
                    Main Category {actionText} successfully!
                </Alert>,
            )
        } catch (error) {
            console.error(`Failed to ${actionText.toLowerCase()} main category:`, error)
            toast.push(
                <Alert showIcon type="danger">
                    {`Failed to ${actionText.toLowerCase()} main category.`}
                </Alert>,
            )
        } finally {
            setMainSelectCategory(null)
        }
    }
}
const handleEdit = (MainCategory: MainCategoryData) => {
        // Pass the id to MainCategoryEdit page
        navigate('/Salesmenu/MainCategoryEdit', {
            state: {
                id: MainCategory.id,
                MainCategoryName: MainCategory.MainCategoryName,
                CategoryType: MainCategory.CategoryType,
                catTypeId: MainCategory.catTypeId,
                isActive: MainCategory.isActive,
                mainCatSeq: MainCategory.MainCategoryCode, // Assuming MainCategoryCode is used for
            },
        })
    }

    // const handleDelete = (MainCategory: MainCategoryData) => {
    //     // Implement delete functionality here
    //     console.log('Delete:', MainCategory)
    // }

    const handleDeleteClick = (MainCatCode: MainCategoryData) => {
        setMainSelectCategory(MainCatCode)
        setDialogIsOpen(true)
    }


       const handleDialogClose = () => {
        setDialogIsOpen(false)
        setMainSelectCategory(null)
    }
    // const handleCreate = () => {
    //     setError(null);
    //     console.log('Create category:', { MainCategoryName: channelName });
    // };

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<MainCategoryFormSchema>({
        defaultValues: {
            userId: userIdNumber,
            catTypeId: null,
            itemMainCat: '',
            isActive: true,
        },
    })

    const onSubmit = async (values: MainCategoryFormSchema) => {
        const currentUserId = sessionStorage.getItem('userId')
        if (!currentUserId) {
            toast.push(
                <Alert type="danger" showIcon>
                    User session has expired. Please log in again.
                </Alert>,
            )
            return
        }

        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)
        try {
            const payload = {
                userId: Number(currentUserId),
                catTypeId: values.catTypeId,
                itemMainCat: values.itemMainCat,
                isActive: values.isActive,
            }
            const result = await addNewMainCategory(payload)

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <div className="mt-2 text-green-700 font-semibold text-md text-center">
                            New Category Type created successfully!
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
                reset()
                await loadMainCategory()
            }
        } catch (err: any) {
            let backendMessage =
                'An error occurred during creating new Category Type. Please try again.'

            const response = err?.response
            const data = response?.data

            if (data) {
                if (typeof data.payload === 'string') {
                    backendMessage = data.payload
                } else if (typeof data.message === 'string') {
                    backendMessage = data.message
                }
            } else if (typeof err.message === 'string') {
                backendMessage = err.message
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
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <div className="flex-row lg:w-1/3 xl:w-1/3 h-1/2">
                    <Card bordered={false} className="mb-4">
                        <h5 className="mb-2">Main Category Creation</h5>
                        <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                            <FormItem
                                invalid={Boolean(errors.catTypeId)}
                                errorMessage={errors.catTypeId?.message}
                            >
                                <Controller
                                    name="catTypeId"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            placeholder="Select Category Type"
                                            options={categoryType}
                                            value={
                                                categoryType.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                ) || null
                                            }
                                            onChange={(option) =>
                                                field.onChange(
                                                    option?.value ?? null,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                invalid={Boolean(errors.itemMainCat)}
                                errorMessage={errors.itemMainCat?.message}
                            >
                                <Controller
                                    name="itemMainCat"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Main Category Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                        >
                                            IsActive
                                        </Checkbox>
                                    )}
                                />
                            </FormItem>

                            <FormItem>
                                <Button variant="solid" block type="submit">
                                    Create
                                </Button>
                            </FormItem>
                        </Form>
                    </Card>
                </div>

                <Card
                    bordered={false}
                    className="lg:w-2/3 xl:w-2/3 overflow-auto"
                >
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
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : ''
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
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
                                            <Td
                                                key={cell.id}
                                                className="py-1 text-xs"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                        <div className="flex items-center justify-between mt-4">
                            <Pagination
                                pageSize={table.getState().pagination.pageSize}
                                currentPage={
                                    table.getState().pagination.pageIndex + 1
                                }
                                total={totalData}
                                onChange={onPaginationChange}
                            />
                            <div style={{ minWidth: 130 }}>
                                <Select
                                    size="sm"
                                    isSearchable={false}
                                    value={pageSizeOptions.find(
                                        (option) => option.value === pageSize,
                                    )}
                                    options={pageSizeOptions}
                                    onChange={(option) =>
                                        onSelectChange(option?.value)
                                    }
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
                <h5 className="mb-4">{MainSelectCategory?.isActive ? 'Deactivate' : 'Activate'} Main Category?</h5>
                            <p>
                                Are you sure you want to {MainSelectCategory?.isActive ? 'Deactivate' : 'Activate'} <b>{MainSelectCategory?.MainCategoryName}</b>?
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
        </div>
    )
}

export default MainCategory

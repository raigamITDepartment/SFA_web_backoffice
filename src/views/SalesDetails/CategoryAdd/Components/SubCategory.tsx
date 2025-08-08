// SubCategory.tsx

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
    fetchSubCategoriesAll,
    addNewSubCategory,
    deleteSubCategory,
    fetchMainCategoriesAll,
} from '@/services/CategoryServices'

type SubCategoryFormSchema = {
    userId: number
    SubCatId: number | null
    mainCatId: number | null
    subCatOneName: string
    isActive: boolean
}

interface SubCategoryProps {
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

interface SubCategoryData {
    id: string
    SubCategorySeq: string
    SubCategoryName: string
    isActive?: boolean
    CategoryType?: string
    MainCategoryType?: string
    catTypeId?: number
    mainCatId?: number
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

const SubCategory = (props: SubCategoryProps) => {
    const { setMessage } = props
    const userId = sessionStorage.getItem('userId')
    const userIdNumber = Number(userId)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)

    const navigate = useNavigate()
    const [mainCategoryOptions, setMainCategoryOptions] = useState<any>([])
    const [subCategories, setSubCategories] = useState<SubCategoryData[]>([])
    const [selectedSubCategory, setSelectedSubCategory] =
        useState<SubCategoryData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    useEffect(() => {
        const loadMainCategories = async () => {
            try {
                const MaincategoryData = await fetchMainCategoriesAll()
                const options = MaincategoryData.map((mainCategory: any) => ({
                    label: mainCategory.itemMainCat,
                    value: mainCategory.id,
                }))
                setMainCategoryOptions(options)
            } catch (error) {
                setMessage?.('Failed to load main categories.')
            }
        }
        loadMainCategories()
    }, [setMessage])

    const loadSubCategories = async () => {
        try {
            const response = await fetchSubCategoriesAll()
            const mapped: SubCategoryData[] = response.map((item: any) => ({
                id: String(item.id),
                CategoryType: item.categoryType, // This may be undefined if not in API response
                MainCategoryType: item.mainCatName,
                SubCategorySeq: String(item.subCatSeq),
                SubCategoryName: item.subCatOneName,
                isActive: item.isActive,
                catTypeId: item.catTypeId,
                mainCatId: item.mainCatId,
            }))
            setSubCategories(mapped)
        } catch (err) {
            console.error('Failed to load sub categories:', err)
        }
    }

    useEffect(() => {
        loadSubCategories()
    }, [])

    const columns = useMemo<ColumnDef<SubCategoryData>[]>(
        () => [
            {
                header: 'Category Type',
                accessorKey: 'CategoryType',
                cell: ({ row }) => (
                    <span>{row.original.CategoryType || '-'}</span>
                ),
            },
            {
                header: 'Main Category',
                accessorKey: 'MainCategoryType',
                cell: ({ row }) => (
                    <span>{row.original.MainCategoryType || '-'}</span>
                ),
            },
            { header: 'Sub Category Sequence', accessorKey: 'SubCategorySeq' },
            { header: 'Sub Category Name', accessorKey: 'SubCategoryName' },

            {
                header: 'Is Active',
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <Tag
                        className={
                            row.original.isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'text-red-600 bg-red-100'
                        }
                    >
                        {row.original.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                ),
            },
            {
                header: 'Action',
                accessorKey: 'action',
                cell: ({ row }) => {
                    const subCat = row.original
                    return (
                        <div className="flex">
                            <FaRegEdit
                                onClick={() => handleEdit(subCat)}
                                className="cursor-pointer mr-4 text-primary-deep text-lg"
                            />
                            {subCat.isActive ? (
                                <MdBlock
                                    className="text-red-500 text-lg cursor-pointer"
                                    title="Deactivate"
                                    onClick={() => handleDeleteClick(subCat)}
                                />
                            ) : (
                                <MdCheckCircleOutline
                                    className="text-green-500 text-lg cursor-pointer"
                                    title="Activate"
                                    onClick={() => handleDeleteClick(subCat)}
                                />
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const totalData = subCategories.length

    const table = useReactTable({
        data: subCategories,
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

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<SubCategoryFormSchema>({
        defaultValues: {
            userId: userIdNumber,
            SubCatId: null,
            mainCatId: null,
            subCatOneName: '',
            isActive: true,
        },
    })

    const onSubmit = async (values: SubCategoryFormSchema) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const payload = {
                userId: userIdNumber,
                subCatId: values.SubCatId, 
                subCatTwoName: values.subCatOneName, 
                isActive: values.isActive,
            }
            const result = await addNewSubCategory(payload)

            if (result?.status === 'failed') {
                setMessage?.(result.message)
                toast.push(
                    <Alert showIcon type="danger">
                        {result.message || 'Failed to create sub category.'}
                    </Alert>,
                )
            } else {
                toast.push(
                    <Alert showIcon type="success">
                        Sub Category created successfully!
                    </Alert>,
                )
                reset()
                await loadSubCategories()
            }
        } catch (err: any) {
            let backendMessage =
                'An error occurred while creating the sub category. Please try again.'

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
                <Alert showIcon type="danger">
                    {backendMessage}
                </Alert>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (SubCategory: SubCategoryData) => {
        navigate('/Salesmenu/SubCategoryEdit', {
            state: {
                MainCategoryName: SubCategory.MainCategoryType,
                id: SubCategory.id,
                SubcatTypeId: SubCategory.SubCategorySeq,
                subCatOneName: SubCategory.SubCategoryName,
                isActive: SubCategory.isActive,
                MainCatId: SubCategory.mainCatId,
                // Assuming MainCategoryCode is used for
            },
        })
    }

    const handleDeleteClick = (subCat: SubCategoryData) => {
        setSelectedSubCategory(subCat)
        setDialogIsOpen(true)
    }

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false)
        if (!selectedSubCategory) return

        const isDeactivating = selectedSubCategory?.isActive
        const actionText = isDeactivating ? 'Deactivated' : 'Activated'

        try {
            await deleteSubCategory(selectedSubCategory.id)
            await loadSubCategories() // This will refresh the table with the latest data

            toast.push(
                <Alert showIcon type="success">
                    Sub Category {actionText} successfully!
                </Alert>,
            )
        } catch (err) {
            console.error(err)
            toast.push(
                <Alert
                    showIcon
                    type="danger"
                >{`Failed to ${actionText.toLowerCase()} sub category.`}</Alert>,
            )
        } finally {
            setSelectedSubCategory(null)
        }
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelectedSubCategory(null)
    }

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        setPageSize(newSize)
        table.setPageSize(newSize)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <div className="flex-row lg:w-1/3 xl:w-1/3">
                    <Card>
                        <h5 className="mb-2">Sub Category Creation</h5>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormItem
                                invalid={Boolean(errors.mainCatId)}
                                errorMessage={errors.mainCatId?.message}
                            >
                                <Controller
                                    name="mainCatId"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select Main Category"
                                            options={mainCategoryOptions}
                                            value={
                                                mainCategoryOptions.find(
                                                    (opt) =>
                                                        opt.value ===
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
                                invalid={Boolean(errors.subCatOneName)}
                                errorMessage={errors.subCatOneName?.message}
                            >
                                <Controller
                                    name="subCatOneName"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="Sub Category Name"
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
                                            Is Active
                                        </Checkbox>
                                    )}
                                />
                            </FormItem>
                            <FormItem>
                                <Button type="submit" variant="solid" block>
                                    Create
                                </Button>
                            </FormItem>
                        </Form>
                    </Card>
                </div>
                <Card className="lg:w-2/3 xl:w-2/3">
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        placeholder="Search..."
                        onChange={(value) => setGlobalFilter(String(value))}
                    />
                    <Table>
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="cursor-pointer select-none"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
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
                </Card>
            </div>
            <Dialog isOpen={dialogIsOpen} onClose={handleDialogClose}>
                <h5 className="mb-4">
                    {selectedSubCategory?.isActive ? 'Deactivate' : 'Activate'}{' '}
                    Sub Category?
                </h5>
                <p>
                    Are you sure you want to{' '}
                    {selectedSubCategory?.isActive ? 'Deactivate' : 'Activate'}{' '}
                    <b>{selectedSubCategory?.SubCategoryName}</b>?
                </p>
                <div className="text-right mt-6">
                    <Button className="mr-2" onClick={handleDialogClose}>
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

export default SubCategory

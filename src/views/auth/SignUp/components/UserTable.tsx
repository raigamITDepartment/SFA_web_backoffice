import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import Pagination from '@/components/ui/Pagination'
import { rankItem } from '@tanstack/match-sorter-utils'
import { data10 } from './data'
import type { Person } from './data'
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import type { InputHTMLAttributes, ReactNode, CSSProperties, MouseEvent } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

export interface GroupBase<Option> {
    readonly options: readonly Option[];
    readonly label?: string;
}
export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
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

const { Tr, Th, Td, THead, TBody, Sorter } = Table

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const Filtering = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    // Dialog state
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Person | null>(null)

    const handleEdit = (user: Person) => {
        // Implement edit functionality here
        console.log('Edit:', user)
    }

    const handleDelete = (user: Person) => {
        setSelectedUser(user)
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        setIsOpen(false)
        setSelectedUser(null)
    }

    const onDialogConfirm = (e: MouseEvent) => {
        // Implement actual delete logic here, e.g., API call or state update
        console.log('Confirmed delete:', selectedUser)
        setIsOpen(false)
        setSelectedUser(null)
    }

    const columns = useMemo<ColumnDef<Person>[]>(() => [
        { header: 'Username', accessorKey: 'Username' },
        { header: 'First Name', accessorKey: 'firstName' },
        { header: 'Last Name', accessorKey: 'lastName' },
        { header: 'Role', accessorKey: 'Role' },
        { header: 'User Type', accessorKey: 'UserType' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }) => (
                <div className="flex">
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
    ], [])

    // Use your actual data10, which should include firstName and lastName fields
    const [data] = useState(() => data10)

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const totalData = data.length

    return (
        <div className="table-container" style={{ maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
            <div className="card" style={{ overflowX: 'auto' }}>
                <div className="card-body">
                    <>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            className="p-2 font-lg shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(value) => setGlobalFilter(String(value))}
                        />
                        <div style={{ minWidth: 900 }}>
                            <Table>
                                <THead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <Th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                    >
                                                        {header.isPlaceholder ? null : (
                                                            <div
                                                                {...{
                                                                    className:
                                                                        header.column.getCanSort()
                                                                            ? 'cursor-pointer select-none'
                                                                            : '',
                                                                    onClick:
                                                                        header.column.getToggleSortingHandler(),
                                                                }}
                                                            >
                                                                {flexRender(
                                                                    header.column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                                {
                                                                    <Sorter
                                                                        sort={header.column.getIsSorted()}
                                                                    />
                                                                }
                                                            </div>
                                                        )}
                                                    </Th>
                                                )
                                            })}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => {
                                        return (
                                            <Tr key={row.id}>
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => {
                                                        return (
                                                            <Td key={cell.id}>
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </Td>
                                                        )
                                                    })}
                                            </Tr>
                                        )
                                    })}
                                </TBody>
                            </Table>
                        </div>
                    </>
                    <div className="flex items-center justify-between mt-4">
                        <Pagination
                            pageSize={table.getState().pagination.pageSize}
                            currentPage={table.getState().pagination.pageIndex + 1}
                            total={totalData}
                            onChange={onPaginationChange}
                        />
                        <div style={{ minWidth: 130 }}>
                            {/* Page size select can go here */}
                        </div>
                    </div>
                    <Dialog
                        isOpen={dialogIsOpen}
                        onClose={onDialogClose}
                        onRequestClose={onDialogClose}
                    >
                        <h5 className="mb-4">Are you sure you want to delete?</h5>
                        <div className="text-right mt-6">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                onClick={onDialogClose}
                            >
                                Cancel
                            </Button>
                            <Button variant="solid" onClick={onDialogConfirm}>
                                Confirm
                            </Button>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
export default Filtering
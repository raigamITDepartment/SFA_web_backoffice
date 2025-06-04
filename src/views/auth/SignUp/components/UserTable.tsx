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
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import type { InputHTMLAttributes, ReactNode, CSSProperties } from 'react'
import { fetchUsers, deleteUser } from '@/services/singupDropdownService'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'

type Person = {
    id: number
    userName: string
    roleId: number | string
    email: string
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const Filtering = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [data, setData] = useState<Person[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Person | null>(null)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchUsers()
                setData(res)
            } catch (err) {
                console.error('Failed to load users:', err)
            }
        }
        loadUsers()
    }, [])

    const handleDeleteClick = (user: Person) => {
        setSelectedUser(user)
        setDialogIsOpen(true)
    }

const confirmDelete = async () => {
    if (selectedUser) {
        try {
            await deleteUser(selectedUser.id); 
            setData(prev => prev.filter(u => u.id !== selectedUser.id)); 
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setSelectedUser(null);
            setDialogIsOpen(false);
        }
    }
};


    const columns = useMemo<ColumnDef<Person>[]>(() => [
        { header: 'Username', accessorKey: 'userName' },
        { header: 'Role ID', accessorKey: 'roleId' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex space-x-2">
                        <FaRegEdit className="text-blue-500 cursor-pointer" title="Edit" />
                        <MdDeleteOutline
                            className="text-red-500 cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteClick(user)}
                        />
                    </div>
                )
            }
        }
    ], [])

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
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
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    return (
        <div className="table-container">
            <div className="card">
                <div className="card-body">
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        className="p-2 font-lg shadow border border-block"
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
                                        <Td key={cell.id}>
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
                            total={data.length}
                            onChange={onPaginationChange}
                        />
                    </div>
                </div>
            </div>

            <Dialog isOpen={dialogIsOpen} onClose={() => setDialogIsOpen(false)} title="Confirm Delete">
                <p>Are you sure you want to delete <strong>{selectedUser?.userName}</strong>?</p>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button onClick={() => setDialogIsOpen(false)} variant="secondary">Cancel</Button>
                    <Button onClick={confirmDelete} variant="danger">Delete</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Filtering

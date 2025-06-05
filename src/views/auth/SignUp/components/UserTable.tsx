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
import type { InputHTMLAttributes } from 'react'
import { fetchUsers, deleteUser } from '@/services/singupDropdownService'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { useNavigate } from 'react-router-dom'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'

type Person = {
    id: number
    userName: string
    roleId: number | string
    email: string
    firstName?: string
    lastName?: string
    role?: string
    userType?: string
    isActive?: boolean
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

// Sample data for initial render
const sampleData: Person[] = [
    {
        id: 1,
        userName: 'jdoe',
        roleId: 1,
        email: 'jdoe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        userType: 'Internal',
        isActive: true,
    },
    {
        id: 2,
        userName: 'asmith',
        roleId: 2,
        email: 'asmith@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'User',
        userType: 'External',
        isActive: false,
    },
]

const Filtering = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [data, setData] = useState<Person[]>(sampleData)
    const [selectedUser, setSelectedUser] = useState<Person | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchUsers()
                setData(res)
            } catch (err) {
                // If fetch fails, keep sample data
                console.error('Failed to load users:', err)
            }
        }
        loadUsers()
    }, [])

    const handleDeleteClick = (user: Person) => {
        setSelectedUser(user)
        blockAlert()
    }


    const blockAlert = () => {
        toast.push(
            <Alert
                showIcon
                type="danger"
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
            >
                Removing User...
            </Alert>,
            {
                offsetX: 5,         // 0 from the right edge
                offsetY: 100,        // 16px from the top
                transitionType: 'fade',
                block: false,       // allow stacking in the corner
                placement: 'top-end', // if your toast system supports it
            }
        )

    }

    const confirmDelete = async (user: Person) => {
        if (user) {
            try {
                await deleteUser(user.id)
                setData(prev => prev.filter(u => u.id !== user.id))
            } catch (error) {
                console.error('Failed to delete user:', error)
            } finally {
                setSelectedUser(null)
            }
        }
    }

    const handleEditClick = (user: Person) => {
        navigate(`/users/${user.id}/edit`)
    }

    const columns = useMemo<ColumnDef<Person>[]>(() => [
        { header: 'Username', accessorKey: 'userName' },
        { header: 'First Name', accessorKey: 'firstName' },
        { header: 'Last Name', accessorKey: 'lastName' },
        { header: 'Role', accessorKey: 'role' },
        { header: 'User Type', accessorKey: 'userType' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: ({ getValue }) => {
                const isActive = getValue();
                return (
                    <div className="mr-2 rtl:ml-2">
                        <Tag className={isActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded" : "text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0"}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex space-x-2 ">
                        <FaRegEdit
                            className="text-blue-500 text-base  cursor-pointer"
                            title="Edit"
                            onClick={() => handleEditClick(user)}
                        />
                        <MdDeleteOutline
                            className="text-red-500 text-lg cursor-pointer"
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
        </div>
    )
}

export default Filtering
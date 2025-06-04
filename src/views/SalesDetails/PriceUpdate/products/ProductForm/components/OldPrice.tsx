import { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { FaRegEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'

const { Tr, Th, Td, THead, TBody } = Table

type OldPriceRow = {
    itemName: string
    itemCode: string
    channel: string
    startDate: string
    endDate: string
    isActive: boolean
}

// Example options for Item Code, Year, and Month
const itemCodeOptions = [
    { value: 'ITM001', label: 'ITM001' },
    { value: 'ITM002', label: 'ITM002' },
    // Add more as needed
]

const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    // Add more as needed
]

const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
]

const initialData: OldPriceRow[] = [
    {
        itemName: 'Sample Item',
        itemCode: 'ITM001',
        channel: 'CH01',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        isActive: true,
    },
]

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const OldPrice = () => {
    const [data] = useState<OldPriceRow[]>(initialData)
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [itemCode, setItemCode] = useState<string | null>(null)
    const [year, setYear] = useState<string | null>(null)
    const [month, setMonth] = useState<string | null>(null)

    const columns = useMemo(
        () => [
            { header: 'Item Name', accessorKey: 'itemName' },
            { header: 'Item Code', accessorKey: 'itemCode' },
            { header: 'Channel', accessorKey: 'channel' },
            { header: 'Start Date', accessorKey: 'startDate' },
            { header: 'End Date', accessorKey: 'endDate' },
            {
                header: 'Is Active',
                accessorKey: 'isActive',
                cell: ({ row }: any) => (
                    <Tag className={row.original.isActive
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded"
                        : "text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0"}>
                        {row.original.isActive ? "Active" : "Inactive"}
                    </Tag>
                ),
            },
            {
                header: 'Action',
                cell: ({ row }: any) => (
                    <div className="flex">
                        <FaRegEdit className="cursor-pointer mr-4 text-primary-deep text-lg" />
                        <MdDeleteOutline className="cursor-pointer text-red-600 text-xl" />
                    </div>
                ),
            },
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase())
        },
        initialState: { pagination: { pageSize } },
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        setPageSize(newSize)
        table.setPageSize(newSize)
    }

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log({ itemCode, year, month });
    }

    return (
        <Card>
            <h4 className="mb-6">Old Prices</h4>
            <div>
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-row gap-2">
                        <div className="w-1/2">
                            <FormItem label="Item Code" asterisk>
                                <Select
                                    placeholder="Item Code"
                                    options={itemCodeOptions}
                                    value={itemCodeOptions.find(opt => opt.value === itemCode) || null}
                                    onChange={option => setItemCode(option?.value || null)}
                                />
                            </FormItem>
                        </div>
                        <div className="w-1/2">
                            <FormItem label="Year" asterisk>
                                <Select
                                    placeholder="Year"
                                    options={yearOptions}
                                    value={yearOptions.find(opt => opt.value === year) || null}
                                    onChange={option => setYear(option?.value || null)}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <FormItem label="Month" asterisk>
                            <Select
                                placeholder="Month"
                                options={monthOptions}
                                value={monthOptions.find(opt => opt.value === month) || null}
                                onChange={option => setMonth(option?.value || null)}
                            />
                        </FormItem>
                    </div>
                    <div className="w-full mt-2">
                        <Button variant="solid" type="button" className="btn-sm w-full" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>

                {/* Search input */}
                <div className="flex justify-end">
                    <div className="flex items-center mb-4">
                        <span className="mr-2">Search:</span>
                        <Input
                            size='sm'
                            className="font-xs shadow border border-block"
                            placeholder="Search all columns..."
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id} colSpan={header.colSpan}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                        total={data.length}
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
    )
}

export default OldPrice

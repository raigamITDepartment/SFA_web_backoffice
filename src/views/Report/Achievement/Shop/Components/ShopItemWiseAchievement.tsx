import React, { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Input from '@/components/ui/Input'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'

const { DatePickerRange } = DatePicker
const { Tr, Th, Td, THead, TBody, Sorter } = Table

function ShopItemWiseAchievement() {
    const [dateRange, setDateRange] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedItem, setSelectedItem] = useState(null)

    // Filter Options
    const rangeOptions = [
        { label: 'C', value: 'q1' },
        { label: 'D', value: 'q2' },
        { label: 'S', value: 'q3' },
    ]

    const mainCategoryOptions = [
        { label: 'Soya', value: 'beverages' },
        { label: 'Deveni 1', value: 'snacks' },
    ]

    const areaOptions = [
        { label: 'Western', value: 'western' },
        { label: 'Central', value: 'central' },
    ]

    const territoryOptions = [
        { label: 'Colombo', value: 'colombo' },
        { label: 'Kandy', value: 'kandy' },
        { label: 'Galle', value: 'galle' },
        { label: 'Matara', value: 'matara' },
    ]

    const routeOptions = [
        { label: 'Route 1', value: 'route1' },
        { label: 'Route 2', value: 'route2' },
    ]

    const shopOptions = [
        { label: 'Shop 1', value: 'shop1' },
        { label: 'Shop 2', value: 'shop2' },
    ]

    const itemOptions = [
        { label: 'Pepsi 500ml', value: 'pepsi' },
        { label: 'Lays Salted 50g', value: 'lays' },
        { label: 'Mirinda 1L', value: 'mirinda' },
        { label: 'Doritos 100g', value: 'doritos' },
    ]

    const pageSizeOptions = [
        { value: 5, label: '5 / page' },
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
    ]

    // Original full data
    const rawData = useMemo(
        () => [
            { name: 'Pepsi 500ml', qty: 1500, value: 675000 },
            { name: 'Lays Salted 50g', qty: 800, value: 320000 },
            { name: 'Mirinda 1L', qty: 600, value: 310000 },
            { name: 'Doritos 100g', qty: 500, value: 275000 },
        ],
        []
    )

    // Filtered data based on selectedItem
    const data = useMemo(() => {
        if (!selectedItem) return rawData
        const selectedLabel = itemOptions.find(i => i.value === selectedItem)?.label
        return rawData.filter(row => row.name === selectedLabel)
    }, [rawData, selectedItem])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Item Name',
            },
            {
                accessorKey: 'qty',
                header: 'Qty',
            },
            {
                accessorKey: 'value',
                header: 'Value (Rs.)',
            },
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        table.setPageSize(newSize)
    }

    const handleExport = () => {
        const rows = table.getFilteredRowModel().rows.map((row) => ({
            Name: row.original.name,
            Qty: row.original.qty,
            Value: row.original.value,
        }))

        const worksheet = XLSX.utils.json_to_sheet(rows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ItemWiseReport')
        XLSX.writeFile(workbook, 'ItemWiseAchievement.xlsx')
    }

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h3>Item Wise Achievement Report</h3>
                <h5 className='mb-6'>(Shop-wise)</h5>

                <div className="flex items-center mb-6 gap-2 text-gray-700 dark:text-gray-200">
                    <FiFilter className="text-xl" />
                    <h2 className="text-lg font-semibold">Filter Criteria</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select options={rangeOptions} placeholder="Select Range" />
                    <Select options={mainCategoryOptions} placeholder="Select Main Category" />
                    <Select options={areaOptions} placeholder="Select Area" />
                    <Select options={territoryOptions} placeholder="Select Territory" />
                    <Select options={routeOptions} placeholder="Select Route" />
                    <Select options={shopOptions} placeholder="Select Shop" />
                    <Select 
                        options={itemOptions} 
                        placeholder="Select Item"
                        
                    />
                    <DatePickerRange placeholder="Date Range" />
                </div>

                <div className="mt-6 flex xl:justify-end lg:justify-end md:justify-end sm:justify-center justify-center">
                    <Button type="submit" variant="solid" className="px-6 py-2 text-sm rounded-xl sm:w-full md:w-auto">
                        Apply Filters
                    </Button>
                </div>
            </Card>

            {/* Rest of your component remains the same */}
            {/* Report Table Section */}
            <Card className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100" />

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                            className="text-sm flex items-center gap-2"
                            onClick={handleExport}
                        >
                            <FaFileExcel className="text-green-600 text-lg" />
                            Export to Excel
                        </Button>

                        <div className="relative w-full sm:w-64">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 w-full"
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(String(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
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
                            {table.getRowModel().rows.length === 0 ? (
                                <Tr>
                                    <Td colSpan={columns.length} className="text-center text-gray-400 py-4">
                                        No data found.
                                    </Td>
                                </Tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Td key={cell.id} className="py-1">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Pagination
                        pageSize={table.getState().pagination.pageSize}
                        currentPage={table.getState().pagination.pageIndex + 1}
                        total={table.getFilteredRowModel().rows.length}
                        onChange={(page) => table.setPageIndex(page - 1)}
                    />
                    <div style={{ minWidth: 130 }}>
                        <Select
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find(
                                (option) => option.value === table.getState().pagination.pageSize
                            )}
                            options={pageSizeOptions}
                            onChange={(option) => onSelectChange(option?.value)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ShopItemWiseAchievement
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

const SUB_SUB_CATEGORY_OPTIONS = [
    { label: 'Cola Drinks', value: 'cola' },
    { label: 'Lemon-Lime Drinks', value: 'lemon-lime' },
    { label: 'Potato Chips', value: 'potato-chips' },
    { label: 'Tortilla Chips', value: 'tortilla-chips' },
]

const SUB_CATEGORY_OPTIONS = [
    { label: 'Carbonated Drinks', value: 'carbonated' },
    { label: 'Chips', value: 'chips' },
]

const TERRITORY_OPTIONS = [
    { label: 'Colombo', value: 'colombo' },
    { label: 'Kandy', value: 'kandy' },
    { label: 'Galle', value: 'galle' },
    { label: 'Matara', value: 'matara' },
]

const PAGE_SIZE_OPTIONS = [
    { value: 5, label: '5 / page' },
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
]

const TABLE_DATA = [
    { name: 'Cola Drinks', qty: 850, value: 380000 },
    { name: 'Lemon-Lime Drinks', qty: 350, value: 170000 },
    { name: 'Potato Chips', qty: 620, value: 290000 },
    { name: 'Tortilla Chips', qty: 360, value: 170000 },
    { name: 'Energy Drinks', qty: 280, value: 150000 },
    { name: 'Flavored Chips', qty: 190, value: 90000 },
]

const COLUMNS = [
    {
        accessorKey: 'name',
        header: 'Sub-Sub-Category',
    },
    {
        accessorKey: 'qty',
        header: 'Quantity Sold',
        
    },
    {
        accessorKey: 'value',
        header: 'Revenue (Rs.)',
        
    },
    
]

function SubSubCategoryAchievement() {
    const [dateRange, setDateRange] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('')
    const [selectedTerritory, setSelectedTerritory] = useState('')

    const table = useReactTable({
        data: TABLE_DATA,
        columns: COLUMNS,
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
            'Sub-Sub-Category': row.original.name,
            'Quantity Sold': row.original.qty,
            'Revenue (Rs.)': row.original.value,
            
        }))

        const worksheet = XLSX.utils.json_to_sheet(rows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SubSubCategoryReport')
        XLSX.writeFile(workbook, 'SubSubCategoryAchievement.xlsx')
    }

    const handleApplyFilters = () => {
        // Implement your filter logic here
        console.log('Filters applied:', {
            subCategory: selectedSubCategory,
            subSubCategory: selectedSubSubCategory,
            territory: selectedTerritory,
            dateRange,
        })
    }

    return (
        <div className="space-y-6">
            {/* Filter Card */}
            <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6 gap-2 text-gray-700 dark:text-gray-200">
                    <FiFilter className="text-xl" />
                    <h2 className="text-lg font-semibold">Filter Criteria</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                        options={SUB_CATEGORY_OPTIONS} 
                        placeholder="Select Sub Category" 
                        value={selectedSubCategory}
                        onChange={(value) => {
                            setSelectedSubCategory(value)
                            setSelectedSubSubCategory('') // Reset sub-sub-category when parent changes
                        }}
                    />
                    <Select 
                        options={SUB_SUB_CATEGORY_OPTIONS.filter(option => 
                            selectedSubCategory === 'carbonated' 
                                ? ['cola', 'lemon-lime', 'energy-drinks'].includes(option.value)
                                : ['potato-chips', 'tortilla-chips', 'flavored-chips'].includes(option.value)
                        )} 
                        placeholder="Select Sub-Sub-Category" 
                        value={selectedSubSubCategory}
                        onChange={setSelectedSubSubCategory}
                        disabled={!selectedSubCategory}
                    />
                    <Select 
                        options={TERRITORY_OPTIONS} 
                        placeholder="Select Territory" 
                        value={selectedTerritory}
                        onChange={setSelectedTerritory}
                    />
                    <DatePickerRange 
                        placeholder="Date Range" 
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </div>

                <div className="mt-6 flex xl:justify-end lg:justify-end md:justify-end sm:justify-center justify-center">
                    <Button 
                        type="button" 
                        variant="solid" 
                        className="px-6 py-2 text-sm rounded-xl sm:w-full md:w-auto"
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </Button>
                </div>
            </Card>

            {/* Report Card */}
            <Card className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                        Sub-Sub-Category Performance Report
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                            
                            icon={<FaFileExcel className="text-green-600 text-lg" />}
                            className="text-sm flex items-center gap-2"
                            onClick={handleExport}
                        >
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
                                    <Td colSpan={COLUMNS.length} className="text-center text-gray-400 py-4">
                                        No data found. Please adjust your filters.
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
                            value={PAGE_SIZE_OPTIONS.find(
                                (option) => option.value === table.getState().pagination.pageSize
                            )}
                            options={PAGE_SIZE_OPTIONS}
                            onChange={(option) => onSelectChange(option?.value)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SubSubCategoryAchievement
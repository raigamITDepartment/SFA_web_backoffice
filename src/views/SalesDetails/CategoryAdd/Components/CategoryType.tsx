import React, { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { FaRegEdit } from 'react-icons/fa';

import { Form, FormItem } from '@/components/ui/Form';
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
import { useNavigate } from 'react-router-dom';
import { fetchCategories, addNewCategory } from '@/services/CategoryServices';
import { Button, toast, Alert } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

type AddCategoryTypeFormSchema = {
  userId: number;
  categoryType: string;
   isActive: boolean;
};

interface CategoryTypeData {
  id: string;
  categoryTypeName: string;
  sequence: number;
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
        <Input size="sm" {...props} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const CategoryType = (props : AddCategoryTypeFormSchema) => {

      const { disableSubmit = false, className, setMessage } = props
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypeData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);



 const loadCategory = async () => {
  try {
    const response = await fetchCategories(); // Original API response
    const mapped = response.map((item: any) => ({
      id: item.id,
      categoryTypeName: item.categoryType, // Map to expected key
      sequence: item.catTypeSeq,           // Map to expected key
    }));
    setSelectedCategory(mapped);
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
};

    useEffect(() => {
        loadCategory();
    }, []);


  const columns = useMemo<ColumnDef<CategoryTypeData>[]>(() => [
    {
      header: 'Category Type Name',
      accessorKey: 'categoryTypeName',
    },
    {
      header: 'Sequence',
      accessorKey: 'sequence',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex">
          <FaRegEdit
            onClick={() => handleEdit(row.original)}
            className="cursor-pointer text-primary-deep text-lg"
          />
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: selectedCategory,
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

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryTypeFormSchema>({
    defaultValues: {
      userId: userIdNumber,
      categoryType: '',
 
      isActive: true,
    },
  });

  const onSubmit = async (values: AddCategoryTypeFormSchema) => {

        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)
        try {
            const result = await addNewCategory(values);

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
                reset();
                await loadCategory();
            }
                }catch (err: any) {

                    let backendMessage = 'An error occurred during creating new Category Type. Please try again.';

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


  

  const handleEdit = (category: CategoryTypeData) => {
  navigate('/Salesmenu/CategoryTypeEdit', {
    state: {
      id: category.id,
      CategoryTypeName: category.categoryTypeName,
      Sequence: category.sequence,
    },
  });
};
  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  // const onSelectChange = (value = 10) => {
  //   const newSize = Number(value);
  //   setPageSize(newSize);
  //   table.setPageSize(newSize);
  // };

  return (
    <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
      <div className="lg:w-1/3 xl:w-1/3">
        <Card bordered={false} className="mb-4">
          <h5 className="mb-2">Category Type Creation</h5>
          <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              invalid={Boolean(errors.categoryType)}
              errorMessage={errors.categoryType?.message}
            >
              <Controller
                name="categoryType"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Category Type Name"
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
                  <Checkbox {...field} checked={field.value}>
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

      <Card bordered={false} className="lg:w-2/3 xl:w-2/3 overflow-auto">
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
                  <Td key={cell.id} className="py-1 text-xs">
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
            total={selectedCategory.length}
            onChange={onPaginationChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default CategoryType;

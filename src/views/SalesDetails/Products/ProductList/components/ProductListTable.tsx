import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'

import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useProductList from '../hooks/useProductList'

import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { FiPackage } from 'react-icons/fi'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Product } from '../types'
import type { TableQueries } from '@/@types/common'

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={60}
                {...(row.img ? { src: row.img } : { icon: <FiPackage /> })}
            />
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onDelete,
}: {
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="Edit">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="Delete">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
        </div>
    )
}

const ProductListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (product: Product) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(product.id)
    }

    const handleEdit = (product: Product) => {
        navigate(`/SalesDetails/products/product-edit/${product.id}`)
    }

    const handleConfirmDelete = () => {
        const newProductList = productList.filter((product) => {
            return !(toDeleteId === product.id)
        })
        setSelectAllProduct([])
        mutate(
            {
                list: newProductList,
                total: productListTotal - selectedProduct.length,
            },
            false,
        )
        setDeleteConfirmationOpen(false)
        setToDeleteId('')
    }

    const {
        productList,
        productListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllProduct,
        setSelectedProduct,
        selectedProduct,
        mutate,
    } = useProductList()

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Image',
                accessorKey: 'Image',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'SAP Code',
                accessorKey: 'SAP',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.SAP}</span>
                },
            },
            {
                header: 'LN',
                accessorKey: 'LN',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.LN}</span>
                },
            },
            {
                header: 'Product Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Product}</span>
                },
            },
            {
                header: 'Range',
                accessorKey: 'Range',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Range}</span>
                },
            },
            {
                header: 'UMO',
                accessorKey: 'Umo',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.UMO}</span>
                },
            },
            {
                header: 'Size',
                accessorKey: 'size',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Size}</span>
                },
            },
            {
                header: 'Volume',
                accessorKey: 'volume',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Volume}</span>
                },
            },
            {
                header: 'Unit Value',
                accessorKey: 'unitValue',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.unitValue}</span>
                },
            },
            {
                header: 'Category Type',
                accessorKey: 'CategoryType',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.CategoryType}</span>
                },
            },
            {
                header: 'Sub-Category',
                accessorKey: 'Subcategory',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Subcategory}</span>
                },
            },
            {
                header: 'Sub-sub-category',
                accessorKey: 'Subsubcategory',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Subsubcategory}</span>
                },
            },
            {
                header: 'Flavor',
                accessorKey: 'Flavor',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-bold heading-text">{row.Flavor}</span>
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { price } = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            <NumericFormat
                                fixedDecimalScale
                                prefix="$"
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                thousandSeparator={true}
                            />
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedProduct.length > 0) {
            setSelectAllProduct([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Product) => {
        setSelectedProduct(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Product>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllProduct(originalRows)
        } else {
            setSelectAllProduct([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={productList}
                noData={!isLoading && productList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: productListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedProduct.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove products"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this product? This action cant be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductListTable
import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { MdDeleteOutline } from "react-icons/md";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Button, toast, Alert } from '@/components/ui';
import Dialog from '@/components/ui/Dialog';
import { useNavigate, useParams } from 'react-router-dom';

const { Tr, Th, Td, THead, TBody } = Table;

interface InvoiceItem {
  id: number;
  itemNo: string;
  description: string;
  qty: number;
  itemPrice: number;
  goodReturnQty: number;
  goodReturnPrice: number;
  goodReturnFree: number; // Added
  marketReturnQty: number;
  marketReturnPrice: number;
  marketReturnFree: number; // Added
  discountPercentage: number; // Added
  grandTotal: number;
  freeIssue: number;
}

function Editbill() {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InvoiceItem | null>(null);

  const invoiceData = {
    invoiceNo: 'INV-2023-001',
    distributorName: 'ABC Distributors',
    billType: 'Normal',
    shopName: 'SuperMart',
    shopCode: 'SM-001',
    route: 'Route C',
    territoryCode: 'T001'
  };

  const [itemsData, setItemsData] = useState<InvoiceItem[]>([
    {
      id: 1,
      itemNo: 'ITEM-001',
      description: 'Premium Product A',
      qty: 10,
      itemPrice: 150,
      goodReturnQty: 0,
      goodReturnPrice: 0,
      goodReturnFree: 0,
      marketReturnQty: 0,
      marketReturnPrice: 0,
      marketReturnFree: 0,
      discountPercentage: 0,
      grandTotal: 1500,
      freeIssue: 0
    },
    {
      id: 2,
      itemNo: 'ITEM-002',
      description: 'Standard Product B',
      qty: 5,
      itemPrice: 200,
      goodReturnQty: 1,
      goodReturnPrice: 200,
      goodReturnFree: 0,
      marketReturnQty: 0,
      marketReturnPrice: 0,
      marketReturnFree: 0,
      discountPercentage: 5,
      grandTotal: 800,
      freeIssue: 0
    },
    {
      id: 3,
      itemNo: 'ITEM-003',
      description: 'Economy Product C',
      qty: 20,
      itemPrice: 50,
      goodReturnQty: 0,
      goodReturnPrice: 0,
      goodReturnFree: 0,
      marketReturnQty: 2,
      marketReturnPrice: 100,
      marketReturnFree: 0,
      discountPercentage: 10,
      grandTotal: 900,
      freeIssue: 0
    }
  ]);

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setItemsData(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      toast.push(
        <Alert
          showIcon
          type="danger"
          className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
        >
          Item deleted successfully
        </Alert>,
        {
          offsetX: 5,
          offsetY: 100,
          transitionType: 'fade',
          block: false,
          placement: 'top-end',
        }
      );
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = (item: InvoiceItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleItemChange = (itemId: number, field: keyof InvoiceItem, value: string | number) => {
    setItemsData(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
          };

          // Corrected grand total calculation
          const grandTotal =
            (updatedItem.qty * updatedItem.itemPrice)

          const discountAmount = grandTotal * (updatedItem.discountPercentage / 100);

          // Calculate net values
          const netQty = updatedItem.qty - updatedItem.goodReturnQty - updatedItem.marketReturnQty;
          const netValue =
            (netQty * updatedItem.itemPrice) -
            (updatedItem.goodReturnQty * updatedItem.goodReturnPrice) -
            (updatedItem.marketReturnQty * updatedItem.marketReturnPrice) -
            discountAmount;

          return {
            ...updatedItem,
            grandTotal: grandTotal,
            grandTotal: Math.max(0, netValue) // Ensure grand total doesn't go negative
          };
        }
        return item;
      })
    );
  };

  const handleCancel = () => {
    navigate('/bills');
  };

  const handleAddItem = () => {
    navigate(`/AddItem/${invoiceId}`);
  };

  const handleUpdate = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    toast.push(
      <Alert
        showIcon
        type="warning"
        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
      >
        Invoice Updated Successfully
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    );

    setConfirmDialogOpen(false);

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const columns = useMemo<ColumnDef<InvoiceItem>[]>(() => [
    {
      header: 'Item No',
      accessorKey: 'itemNo',
      cell: ({ getValue }) => (
        <div className="text-center">{getValue<string>()}</div>
      )
    },
    {
      header: 'Item Name',
      accessorKey: 'itemName',
      cell: ({ row }) => (
        <div className="text-center font-medium text-gray-700 dark:text-gray-200">
          {`Item ${row.index + 1}`}
        </div>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <div className="text-center">{row.original.description}</div>
      )
    },
    {
      header: 'Qty',
      accessorKey: 'qty',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.qty}
            onChange={(e) => handleItemChange(row.original.id, 'qty', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Item Price',
      accessorKey: 'itemPrice',
      cell: ({ row }) => (
        <div className="text-right">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-24 p-1 border rounded text-right"
            value={row.original.itemPrice}
            onChange={(e) => handleItemChange(row.original.id, 'itemPrice', e.target.value)}
          />
        </div>
      )
    },


    {
      header: 'Good Return Qty',
      accessorKey: 'goodReturnQty',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.goodReturnQty}
            onChange={(e) => handleItemChange(row.original.id, 'goodReturnQty', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Good Return Price',
      accessorKey: 'goodReturnPrice',
      cell: ({ row }) => (
        <div className="text-right">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-24 p-1 border rounded text-right"
            value={row.original.goodReturnPrice}
            onChange={(e) => handleItemChange(row.original.id, 'goodReturnPrice', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Good Return Free',
      accessorKey: 'goodReturnFree',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.goodReturnFree}
            onChange={(e) => handleItemChange(row.original.id, 'goodReturnFree', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Market Return Qty',
      accessorKey: 'marketReturnQty',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.marketReturnQty}
            onChange={(e) => handleItemChange(row.original.id, 'marketReturnQty', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Market Return Price',
      accessorKey: 'marketReturnPrice',
      cell: ({ row }) => (
        <div className="text-right">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-24 p-1 border rounded text-right"
            value={row.original.marketReturnPrice}
            onChange={(e) => handleItemChange(row.original.id, 'marketReturnPrice', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Market Return Free',
      accessorKey: 'marketReturnFree',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.marketReturnFree}
            onChange={(e) => handleItemChange(row.original.id, 'marketReturnFree', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Free Issue',
      accessorKey: 'freeIssue',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            className="w-16 p-1 border rounded text-center"
            value={row.original.freeIssue}
            onChange={(e) => handleItemChange(row.original.id, 'freeIssue', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Discount (%)',
      accessorKey: 'discountPercentage',
      cell: ({ row }) => (
        <div className="text-center">
          <input
            type="number"
            min="0"
            max="100"
            className="w-16 p-1 border rounded text-center"
            value={row.original.discountPercentage}
            onChange={(e) => handleItemChange(row.original.id, 'discountPercentage', e.target.value)}
          />
        </div>
      )
    },
    {
      header: 'Total',
      accessorKey: 'grandTotal',
      cell: ({ row }) => (
        <div className="text-right font-semibold">
          {row.original.grandTotal.toFixed(2)}
        </div>
      )
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <MdDeleteOutline
            className="text-red-500 text-lg cursor-pointer hover:text-red-700 transition-colors"
            title="Delete"
            onClick={() => handleDeleteItem(row.original)}
          />
        </div>
      )
    }
  ], [itemsData]);

  const table = useReactTable({
    data: itemsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Invoice Details Card */}
      <Card className="rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Details</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Invoice No</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.invoiceNo}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Distributor Name</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.distributorName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Bill Type</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.billType}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Shop Name</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.shopName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Shop Code</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.shopCode}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Route</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.route}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Territory Code</label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{invoiceData.territoryCode}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Items Table Card */}
      <Card className="p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Items</h3>
          <Button
            variant="solid"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 shadow-md"
            onClick={handleAddItem}
          >
            + Add Item
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              {table.getHeaderGroups().map(headerGroup => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map(row => (
                <Tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id} className="py-3 px-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
          {/* Invoice Total Summary */}
          <div className="flex justify-end mt-4 pr-4">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl shadow-inner p-4 space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                  <span>Sub Total</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    Rs. {itemsData.reduce((sum, item) => sum + item.grandTotal, 0).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Rs. {itemsData.reduce((sum, item) => sum + item.grandTotal, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="default"
          className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
          onClick={handleUpdate}
        >
          Update
        </Button>
      </div>

      {/* Confirm Update Dialog */}
      <Dialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onRequestClose={() => setConfirmDialogOpen(false)}
      >
        <h5 className="mb-4">Confirm Update</h5>
        <p>Are you sure you want to update the invoice?</p>
        <div className="text-right mt-6">
          <Button className="mr-2" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="solid" onClick={handleConfirmUpdate}>Confirm</Button>
        </div>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onRequestClose={() => setDeleteDialogOpen(false)}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>Are you sure you want to delete this item?</p>
        <div className="text-right mt-6">
          <Button className="mr-2" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="solid" onClick={handleDeleteConfirm}>Delete</Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Editbill;
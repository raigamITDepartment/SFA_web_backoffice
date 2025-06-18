import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { MdDeleteOutline } from "react-icons/md";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui';
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
  marketReturnQty: number;
  marketReturnPrice: number;
  grandTotal: number;
}

function Editbill() {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  
  // Sample invoice data
  const invoiceData = {
    invoiceNo: 'INV-2023-001',
    distributorName: 'ABC Distributors',
    billType: 'Normal',
    shopName: 'SuperMart',
    shopCode: 'SM-001',
    route: 'Route C',
  };

  // State for invoice items
  const [itemsData, setItemsData] = useState<InvoiceItem[]>([
    {
      id: 1,
      itemNo: 'ITEM-001',
      description: 'Premium Product A',
      qty: 10,
      itemPrice: 150,
      goodReturnQty: 0,
      goodReturnPrice: 0,
      marketReturnQty: 0,
      marketReturnPrice: 0,
      grandTotal: 1500
    },
    {
      id: 2,
      itemNo: 'ITEM-002',
      description: 'Standard Product B',
      qty: 5,
      itemPrice: 200,
      goodReturnQty: 1,
      goodReturnPrice: 200,
      marketReturnQty: 0,
      marketReturnPrice: 0,
      grandTotal: 800
    },
    {
      id: 3,
      itemNo: 'ITEM-003',
      description: 'Economy Product C',
      qty: 20,
      itemPrice: 50,
      goodReturnQty: 0,
      goodReturnPrice: 0,
      marketReturnQty: 2,
      marketReturnPrice: 100,
      grandTotal: 900
    }
  ]);

  // Handle item deletion
  const handleDeleteItem = (itemId: number) => {
    setItemsData(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Handle item field changes
  const handleItemChange = (
    itemId: number, 
    field: keyof InvoiceItem, 
    value: string | number
  ) => {
    setItemsData(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          // Calculate grandTotal if any of the quantity/price fields change
          const updatedItem = { 
            ...item, 
            [field]: typeof value === 'string' ? parseFloat(value) || 0 : value 
          };
          
          // Recalculate grandTotal if relevant fields change
          if (field === 'qty' || field === 'itemPrice' || 
              field === 'goodReturnQty' || field === 'goodReturnPrice' ||
              field === 'marketReturnQty' || field === 'marketReturnPrice') {
            const netQty = updatedItem.qty - updatedItem.goodReturnQty - updatedItem.marketReturnQty;
            const netValue = 
              (updatedItem.qty * updatedItem.itemPrice) - 
              (updatedItem.goodReturnQty * updatedItem.goodReturnPrice) - 
              (updatedItem.marketReturnQty * updatedItem.marketReturnPrice);
            
            return { 
              ...updatedItem, 
              grandTotal: netValue
            };
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Button handlers
  const handleUpdate = () => {
    console.log('Updating invoice with data:', {
      invoiceId,
      itemsData
    });
    navigate('/bills');
  };

  const handleCancel = () => {
    console.log('Canceling changes for invoice:', invoiceId);
    navigate('/bills');
  };

  // Handle adding a new item
  const handleAddItem = () => {
    navigate(`/AddItem/${invoiceId}`);
  };

  // Define columns for the invoice items table
  const columns = useMemo<ColumnDef<InvoiceItem>[]>(() => [
    { 
      header: 'Item No', 
      accessorKey: 'itemNo',
      cell: ({ getValue }) => (
        <div className="text-center">{getValue<string>()}</div>
      )
    },
    { 
      header: 'Description', 
      accessorKey: 'description',
      cell: ({ row }) => (
        <input
          type="text"
          className="w-full p-1 border rounded"
          value={row.original.description}
          onChange={(e) => handleItemChange(row.original.id, 'description', e.target.value)}
        />
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
            onClick={() => handleDeleteItem(row.original.id)}
          />
        </div>
      ),
    },
  ], []);

  // Create table instance
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice Details
            </h1>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice No */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Invoice No
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.invoiceNo}
              </div>
            </div>
            
            {/* Distributor Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Distributor Name
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.distributorName}
              </div>
            </div>
            
            {/* Bill Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Bill Type
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.billType}
              </div>
            </div>
            
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Shop Name
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.shopName}
              </div>
            </div>
            
            {/* Shop Code */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Shop Code
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.shopCode}
              </div>
            </div>
            
            {/* Route */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Route
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {invoiceData.route}
              </div>
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
        
        <Table className="overflow-x-auto">
          <THead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>

      

      {/* Action buttons */}
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
    </div>
  );
}

export default Editbill;
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';

type Product = {
  id: number;
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  sellableQty: number;
  damageQty: number;
};

type GroupedProducts = {
  [category: string]: Product[];
};

const StockAdd = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [products, setProducts] = useState<Product[]>([
    // Soya Meat Products
    {
      id: 1,
      code: 'SM-001',
      name: 'Wild‑Meat Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 2,
      code: 'SM-002',
      name: 'Devilled Prawn Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 3,
      code: 'SM-003',
      name: 'Chicken Smart Pack Soya Meat',
      category: 'Soya Meat',
      unitPrice: 150,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 4,
      code: 'SM-004',
      name: 'Prawn Smart Pack Soya Meat',
      category: 'Soya Meat',
      unitPrice: 150,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 5,
      code: 'SM-005',
      name: 'Chicken Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 6,
      code: 'SM-006',
      name: 'Curry Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 7,
      code: 'SM-007',
      name: 'Cuttlefish Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 8,
      code: 'SM-008',
      name: 'Prawn Flavoured Soya Meat (Budget pack)',
      category: 'Soya Meat',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 9,
      code: 'SM-009',
      name: 'Chicken Chinese‑Style Soya Devilled',
      category: 'Soya Meat',
      unitPrice: 180,
      sellableQty: 0,
      damageQty: 0,
    },

    // Salt Products
    {
      id: 10,
      code: 'SL-001',
      name: 'Raigam Iodised Table Salt',
      category: 'Salt',
      unitPrice: 60,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 11,
      code: 'SL-002',
      name: 'Raigam Iodised Crystal Salt',
      category: 'Salt',
      unitPrice: 65,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 12,
      code: 'SL-003',
      name: 'Raigam ESI Pure Cooking Salt',
      category: 'Salt',
      unitPrice: 70,
      sellableQty: 0,
      damageQty: 0,
    },

    // Deveni Batha Products
    {
      id: 13,
      code: 'DB-001',
      name: 'White Rice Noodles (350g)',
      category: 'Deveni Batha',
      unitPrice: 180,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 14,
      code: 'DB-002',
      name: 'Red Rice Noodles (350g)',
      category: 'Deveni Batha',
      unitPrice: 190,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 15,
      code: 'DB-003',
      name: 'Kuruluthuda Noodles (350g)',
      category: 'Deveni Batha',
      unitPrice: 200,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 16,
      code: 'DB-004',
      name: 'Pachchaperumal Noodles (350g)',
      category: 'Deveni Batha',
      unitPrice: 200,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 17,
      code: 'DB-005',
      name: 'Bundi Full - Chicken (100g)',
      category: 'Deveni Batha',
      unitPrice: 100,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 18,
      code: 'DB-006',
      name: 'Bundi Full - Hot Masala Chicken (100g)',
      category: 'Deveni Batha',
      unitPrice: 110,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 19,
      code: 'DB-007',
      name: 'Bundi Full - Devilled Chicken (100g)',
      category: 'Deveni Batha',
      unitPrice: 110,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 20,
      code: 'DB-008',
      name: 'Bundi Full - Chicken Kottu (100g)',
      category: 'Deveni Batha',
      unitPrice: 120,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 21,
      code: 'DB-009',
      name: 'Bundi Full - Seafood (100g)',
      category: 'Deveni Batha',
      unitPrice: 130,
      sellableQty: 0,
      damageQty: 0,
    },
    {
      id: 22,
      code: 'DB-010',
      name: 'Bundi Full - Curry (100g)',
      category: 'Deveni Batha',
      unitPrice: 100,
      sellableQty: 0,
      damageQty: 0,
    },
  ]);

  const handleQuantityChange = (id: number, field: keyof Product, value: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filtered.reduce<GroupedProducts>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalItems = Object.values(grouped).flat().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedGrouped = paginatedProducts.reduce<GroupedProducts>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const calculateTotal = (product: Product) => {
    return product.sellableQty + product.damageQty;
  };

  const handleSubmit = () => {
    const stockData = {
      date: new Date().toISOString(),
      agency: 'Raigam Distributors Ltd.',
      items: products
        .filter(product => product.sellableQty > 0 || product.damageQty > 0)
        .map(product => ({
          id: product.id,
          code: product.code,
          name: product.name,
          sellableQty: product.sellableQty,
          damageQty: product.damageQty,
          total: calculateTotal(product)
        }))
    };
    console.log('Submitting stock:', stockData);
    // Add your submission logic here
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Entry</h2>
        
        {/* Header Card */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </div>
              <div className="font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Distributor Name
              </div>
              <div className="font-semibold">
                <select className="w-full p-2 border rounded-md bg-white dark:bg-gray-800">
                  <option>Agency 1</option>
                  <option>Agency 2</option>
                  <option>Agency 3</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6 flex justify-end">
          <Input
            type="text"
            placeholder="Search products or codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {Object.entries(paginatedGrouped).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{category}</h3>
              <Table>
                <thead>
                  <tr>
                    <th className="text-left">Product Code</th>
                    <th className="text-left">Product</th>
                    <th className="text-right">Unit Price (Rs.)</th>
                    <th className="text-right">Sellable Qty</th>
                    <th className="text-right">Damage Qty</th>
                    <th className="text-right">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="font-mono">{product.code}</td>
                      <td>{product.name}</td>
                      <td className="text-right">Rs. {product.unitPrice.toFixed(2)}</td>
                      <td className="text-right">
                        <Input
                          type="number"
                          value={product.sellableQty}
                          onChange={(e) => handleQuantityChange(product.id, 'sellableQty', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="text-right">
                        <Input
                          type="number"
                          value={product.damageQty}
                          onChange={(e) => handleQuantityChange(product.id, 'damageQty', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="text-right font-medium">
                        {calculateTotal(product)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {Math.min(filtered.length, itemsPerPage)} of{' '}
            {filtered.length} products
          </div>
          <Pagination
            currentPage={currentPage}
            total={filtered.length}
            pageSize={itemsPerPage}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="solid"
          className="px-8 rounded-xl"
          onClick={handleSubmit}
        >
          Submit Stock
        </Button>
      </div>
    </div>
  );
};

export default StockAdd;
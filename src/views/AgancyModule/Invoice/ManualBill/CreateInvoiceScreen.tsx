

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { setItem, getAllKeys, multiGet } from '@/utils/asyncStorageWeb';
import { ItemType } from './types';
import { FiChevronDown, FiChevronUp, FiSearch, FiFileText, FiTruck, FiTag, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface LocationState {
    customerId: string;
    customerName: string;
    invoiceType: string;
    invoiceMode: string;
}


const testItemNames: string[] = [
  'Esi Table Salt - 01Kg',
  'Esi PVD - 400g',
  'Esi Table Salt - 400g',
  'Esi PVD - 1Kg',
  'Esi Table Salt-100g',
  'Esi Table Salt - 200g',
  'PVD Salt- 200g',
  'CURRY CHICKEN SOYA 90G',
  'CHICKEN SOYA 90G',
  'NORMAL CURRY SOYA 90G',
  'PRAWN SOYA 90G',
  'POLOS AMBULA SOYA 90G',
  'MALDIVE FISH SOYA 105G',
  'RAIGAM X ORANGE 4KG',
  'RAIGAM X MANGO 4KG',
  'RAIGAM - X FALOODA - 4KG',
  'GANGO ORANGE 100G',
  'GANGO ORANGE 250G',
  'GANGO ORANGE 50G',
];

const categorizeItem = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('salt') || n.includes('pvd')) return 'Salt Items';
  if (n.includes('soya')) return 'Soya Items';
  if (n.includes('raigam') || n.includes('gango') || n.includes('falooda')) return 'Juice Powder Items';
  return 'Other Items';
};



export default function CreateInvoiceScreen() {
  
  const navigate = useNavigate();
  const location: Location<LocationState> = useLocation();
  const { 
   // customerId, 
    customerName = 'No Customer', 
    invoiceType = 'N/A', 
    invoiceMode = 'N/A' 
  } = location.state || {};

  const [billDiscount, setBillDiscount] = useState<string>('0');
  const [savedItems, setSavedItems] = useState<ItemType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadItems = async () => {
      const keys = await getAllKeys();
      const itemKeys = keys.filter(k => k.startsWith('item_'));
      const entries = await multiGet(itemKeys);
      const items: ItemType[] = entries.map(([, value]) => {
        try {
          const parsed = JSON.parse(value || '{}');
          // Ensure loaded items have a category
          if (parsed.itemName) {
            return { ...parsed, category: parsed.category || categorizeItem(parsed.itemName) };
          }
        } catch (e) { console.error("Failed to parse item from storage", e); }
        return null;
      }).filter((item): item is ItemType => item !== null);

      const existingItemNames = new Set(items.map(i => i.itemName));
      const newItems: ItemType[] = testItemNames
        .filter(name => !existingItemNames.has(name))
        .map(name => ({
          category: categorizeItem(name),
          itemName: name,
          quantity: '0',
          goodReturnQty: '0',
          goodReturnFreeQty: '0',
          marketReturnQty: '0',
          marketReturnFreeQty: '0',
          freeIssue: '0',
          lineTotal: '0.00',
          unitPrice: '100', // Assuming a default unit price
        }));
      
      const allItems = [...items, ...newItems];
      setSavedItems(allItems);

      // Auto-expand categories that have items with quantity
      const initialExpanded: Record<string, boolean> = {};
      items.forEach(item => {
        if (parseFloat(item.quantity) > 0) {
          initialExpanded[item.category] = true;
        }
      });
      setExpandedCategories(initialExpanded);
    };
    loadItems();
  }, []);

  const categorizedItems = useMemo((): Record<string, ItemType[]> => {
    const filtered = savedItems.filter(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered.reduce((acc: Record<string, ItemType[]>, item) => {
      const cat = item.category || 'Other Items';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [savedItems, searchQuery]);

  const invoiceSubtotal = useMemo(() =>
    savedItems.reduce((total, item) => total + (parseFloat(item.lineTotal) || 0), 0), [savedItems]);

  const billDiscountValue = useMemo(() => {
    const discountPercentage = parseFloat(billDiscount) || 0;
    return (invoiceSubtotal * discountPercentage) / 100;
  }, [invoiceSubtotal, billDiscount]);

  const invoiceNetValue = useMemo(() => invoiceSubtotal - billDiscountValue, [invoiceSubtotal, billDiscountValue]);

  const totalFreeIssue = useMemo(() =>
    savedItems.reduce((total, item) => total + (parseInt(item.freeIssue) || 0), 0), [savedItems]);

  const totalGoodReturns = useMemo(() =>
    savedItems.reduce((total, item) => total + (parseInt(item.goodReturnQty) || 0), 0), [savedItems]);

  const totalMarketReturns = useMemo(() =>
    savedItems.reduce((total, item) => total + (parseInt(item.marketReturnQty) || 0), 0), [savedItems]);

  const handleComplete = async () => {
    const invoiceData = {
      customerName,
      invoiceType,
      invoiceMode,
      items: savedItems,
      invoiceSubtotal,
      billDiscount: parseFloat(billDiscount) || 0,
      billDiscountValue,
      invoiceNetValue,
      totalFreeIssue,
      totalGoodReturns,
      totalMarketReturns,
      invoiceDate: new Date().toISOString(),
    };
    await setItem('latest_invoice', JSON.stringify(invoiceData));
    // Assuming a finish page, adjust if necessary
    navigate('/AgancyModule-Invoice-invoiceFinish', { state: { invoiceData } });
  };

  const handleCancel = () => {
    // Clean up any item data saved in localStorage for this invoice session
    // to prevent it from showing up on the next invoice.
    savedItems.forEach(item => {
      if (item.itemName) {
        localStorage.removeItem(`item_${item.itemName}`);
      }
    });
    // Navigate back to the initial invoice creation page.
    navigate('/AgancyModule-Invoice-ManualInvoice');

    console.log('Invoice creation cancelled, items cleared from localStorage');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Invoice</h1>
              <p className="text-gray-500 mt-1">For customer: <span className="font-semibold text-blue-600">{customerName}</span></p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><FiTag className="text-blue-500"/> Type: <span className="font-medium">{invoiceType}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><FiTruck className="text-blue-500"/> Mode: <span className="font-medium">{invoiceMode}</span></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="relative mb-4">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {Object.entries(categorizedItems).map(([category, items]) => (
                <div key={category} className="border border-gray-200 rounded-lg">
                  <button
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                  >
                    <h3 className="font-semibold text-gray-700">{category} ({items.length})</h3>
                    {expandedCategories[category] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedCategories[category] && (
                    <div className="p-4 space-y-3">
                      {items.map((item) => (
                        <div
                          className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                          key={item.itemName}
                          onClick={() => navigate('/AgancyModule-Invoice-ItemDetails', { state: { item, customerName } })}
                        >
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{item.itemName}</p>
                            <p className="text-xs text-gray-500">
                              Qty: <span className="font-semibold">{item.quantity}</span> | Free: <span className="font-semibold">{item.freeIssue}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Line Total</p>
                            <p className="font-bold text-green-600">Rs. {item.lineTotal}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2"><FiFileText /> Invoice Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">Rs. {invoiceSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center">
                  <span>Bill Discount %:</span>
                  <input
                    value={billDiscount}
                    onChange={(e) => setBillDiscount(e.target.value)}
                    type="number"
                    className="w-20 text-right border border-gray-300 rounded-md px-2 py-1"
                  />
                </div>
                <div className="flex justify-between text-red-600"><span>Discount Value:</span> <span className="font-medium">- Rs. {billDiscountValue.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Net Value:</span> <span className="text-green-600">Rs. {invoiceNetValue.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                onClick={handleComplete}>
                <FiCheckCircle /> Complete Invoice
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-500 font-bold py-3 px-4 rounded-lg hover:bg-red-50 transition-all"
                onClick={handleCancel}
              >
                <FiXCircle /> Cancel Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


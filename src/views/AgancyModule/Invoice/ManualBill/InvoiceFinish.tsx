import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type ItemType = {
  itemName: string;
  unitPrice?: string;
  specialDiscount?: string;
  quantity?: string;
  freeIssue?: string;
  lineTotal?: string;
  goodReturnQty?: string;
  marketReturnQty?: string;
  category?: string;
};


export default function InvoiceFinish() {


  const navigate = useNavigate();
  const location = useLocation();
  const invoiceData = location.state?.invoiceData;

  const {
    customerName,
    invoiceType,
    invoiceMode,
    items,
    invoiceSubtotal,
    billDiscount,
    billDiscountValue,
    invoiceNetValue,
    totalFreeIssue,
    totalGoodReturns,
    totalMarketReturns,
    invoiceDate,
  } = invoiceData || {};

  const displayDate = new Date(invoiceDate);
  const formattedDate = `${displayDate.toLocaleDateString()} ${displayDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const selectedItems = useMemo(
    () =>
      (items || []).filter(
        (item: ItemType) =>
          (parseInt(item.quantity || '0') || 0) > 0 ||
          (parseInt(item.goodReturnQty || '0') || 0) > 0 ||
          (parseInt(item.marketReturnQty || '0') || 0) > 0 ||
          (parseInt(item.freeIssue || '0') || 0) > 0
      ),
    [items]
  );

  const categorizedItems = useMemo(() => {
    return selectedItems.reduce((acc: Record<string, ItemType[]>, item: ItemType) => {
      const category = item.category || 'Selected Items';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [selectedItems]);

 

  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-500">← Back</button>
        <h1 className="text-2xl font-bold">Raigam</h1>
        <div></div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">Raigam Marketing Services</h2>
        <h3 className="text-xl font-semibold">{customerName}</h3>
        <p>Address: _________________________</p>
        <p>Vat Invoice Number: ______________</p>
        <p>Date: {formattedDate}</p>
        <p>Type: {invoiceType} | Mode: {invoiceMode}</p>
      </div>

      <div className="mb-4 text-sm">
        <p>Sale Rep: ________ | Territory: ________ | Distributor: ________</p>
        <p>Invoice No: ________ | Dealer Code: ________</p>
      </div>

      <div>
        {Object.entries(categorizedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-4">
            <h4 className="text-lg font-bold bg-gray-100 p-2 rounded">{category}</h4>
            {categoryItems.map((item, idx) => (
              <div key={idx} className="border-b py-2">
                <div className="font-medium">{item.itemName}</div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Price: {parseFloat(item.unitPrice || '0').toFixed(2)}</span>
                  <span>Disc: {parseFloat(item.specialDiscount || '0').toFixed(2)}%</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Free: {item.freeIssue}</span>
                  <span>
                    Value (Rs): {parseFloat(item.lineTotal || '0').toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="my-4 text-sm">
        <p>Gross: Rs. {invoiceSubtotal?.toFixed(2)}</p>
        <p>Bill Discount ({billDiscount?.toFixed(2)}%): Rs. {billDiscountValue?.toFixed(2)}</p>
        <p className="font-bold">Net Value: Rs. {invoiceNetValue?.toFixed(2)}</p>
        <div className="mt-2">
          <p>Total Free Issues: {totalFreeIssue}</p>
          <p>Total Good Returns: {totalGoodReturns}</p>
          <p>Total Market Returns: {totalMarketReturns}</p>
        </div>
      </div>

      <div className="text-center mt-10 text-sm text-gray-600">
        <p>_________________________</p>
        <p>Customer Seal and Signature</p>
        <p className="mt-8">---END---</p>
        <p>Solution by Raigam IT</p>
      </div>

      <div className="mt-6 flex justify-center gap-4 print:hidden">
  
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Sync & Finish
        </button>
      </div>
    </div>
  );
};



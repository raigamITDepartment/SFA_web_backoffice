// File: src/pages/ItemDetailsScreen.tsx

import React, { useEffect, useState } from 'react';
import './CSS/ItemDetailsScreen.css';
import { useNavigate, useLocation } from 'react-router-dom';

type ItemType = {
  itemName: string;
  unitPrice?: string;
  unitPriceGR?: string;
  unitPriceMR?: string;
  quantity?: string;
  specialDiscount?: string;
  freeIssue?: string;
  goodReturnQty?: string;
  goodReturnFreeQty?: string;
  marketReturnQty?: string;
  marketReturnFreeQty?: string;
  lineTotal?: string;
};

type LocationState = {
  customerName: string;
  item: ItemType;
};

type LabelInputProps = {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  editable?: boolean;
};

const LabelInput = ({ label, value, onChange, editable = true }: LabelInputProps) => (
  <div className="labelInput">
    <label>{label}</label>
    <input
      type="number"
      value={value || '0'}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={!editable}
    />
  </div>
);


export default function ItemDetailsScreen() {





  const navigate = useNavigate();
  const location = useLocation();
  const { customerName, item } = location.state as LocationState;

  const [unitPrice, setUnitPrice] = useState(item.unitPrice || '100.00');
  const [unitPriceGR, setUnitPriceGR] = useState(item.unitPriceGR || '0');
  const [unitPriceMR, setUnitPriceMR] = useState(item.unitPriceMR || '0');
  const [quantity, setQuantity] = useState(item.quantity || '0');
  const [specialDiscount, setSpecialDiscount] = useState(item.specialDiscount || '0');
  const [freeIssue, setFreeIssue] = useState(item.freeIssue || '0');
  const [showGoodReturn, setShowGoodReturn] = useState(false);
  const [showMarketReturn, setShowMarketReturn] = useState(false);
  const [goodReturnQty, setGoodReturnQty] = useState(item.goodReturnQty || '0');
  const [goodReturnFreeQty, setGoodReturnFreeQty] = useState(item.goodReturnFreeQty || '0');
  const [goodReturnTotal, setGoodReturnTotal] = useState('0');
  const [marketReturnQty, setMarketReturnQty] = useState(item.marketReturnQty || '0');
  const [marketReturnFreeQty, setMarketReturnFreeQty] = useState(item.marketReturnFreeQty || '0');
  const [marketReturnTotal, setMarketReturnTotal] = useState('0');
  const [lineTotal, setLineTotal] = useState(item.lineTotal || '0');

  useEffect(() => {
    const parse = (val: string) => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

    const unit = parse(unitPrice);
    const unitGR = parse(unitPriceGR);
    const unitMR = parse(unitPriceMR);
    const qty = parse(quantity);
    const free = parse(freeIssue);
    const discount = parse(specialDiscount);
    const goodQty = parse(goodReturnQty);
    const goodFree = parse(goodReturnFreeQty);
    const marketQty = parse(marketReturnQty);
    const marketFree = parse(marketReturnFreeQty);

    const goodTotal = unitGR * Math.max(goodQty - goodFree, 0);
    setGoodReturnTotal(goodTotal.toFixed(2));

    const marketTotal = unitMR * Math.max(marketQty - marketFree, 0);
    setMarketReturnTotal(marketTotal.toFixed(2));

    const baseAmount = unit * Math.max(qty - free, 0);
    const discountedAmount = baseAmount * (1 - discount / 100);
    const finalTotal = discountedAmount - goodTotal - marketTotal;

    setLineTotal(finalTotal.toFixed(2));
  }, [
    unitPrice,
    quantity,
    freeIssue,
    specialDiscount,
    goodReturnQty,
    unitPriceGR,
    goodReturnFreeQty,
    marketReturnQty,
    unitPriceMR,
    marketReturnFreeQty,
  ]);

  const handleSave = () => {
    const itemData = {
      itemName: item.itemName,
      unitPrice,
      quantity,
      specialDiscount,
      freeIssue,
      goodReturnQty,
      goodReturnFreeQty,
      marketReturnQty,
      marketReturnFreeQty,
      lineTotal,
      unitPriceGR,
      unitPriceMR,
    };

    localStorage.setItem(`item_${item.itemName}`, JSON.stringify(itemData));
    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Item Stock Details</h2>
      <h3>{customerName}</h3>
      <p><strong>Item name:</strong> {item.itemName}</p>
      <p><strong>Item code:</strong> 866543CF</p>

      <div className="inputGroup">
        <LabelInput label="Available Stock" value="10000" editable={false} />
        <LabelInput label="Unit of Measure" value="Pkt" editable={false} />
        <LabelInput label="Unit Price" value={unitPrice} onChange={setUnitPrice} />
        <LabelInput label="Adjusted Unit Price Rs." value={unitPrice} editable={false} />
        <LabelInput label="Quantity" value={quantity} onChange={setQuantity} />
        <LabelInput label="Special Discount (%)" value={specialDiscount} onChange={setSpecialDiscount} />
        <LabelInput label="Free Issue" value={freeIssue} onChange={setFreeIssue} />
      </div>

      <div className="accordion">
        <div className="accordionHeader" onClick={() => setShowGoodReturn(!showGoodReturn)}>
          <span>Good Return Details</span>
          <span>{showGoodReturn ? '▲' : '▼'}</span>
        </div>
        {showGoodReturn && (
          <div className="accordionContent">
            <LabelInput label="Unit Price GoodReturn" value={unitPriceGR} onChange={setUnitPriceGR} />
            <LabelInput label="Good Return Qty" value={goodReturnQty} onChange={setGoodReturnQty} />
            <LabelInput label="Good Return Free Qty" value={goodReturnFreeQty} onChange={setGoodReturnFreeQty} />
            <LabelInput label="Good Return Total" value={goodReturnTotal} editable={false} />
          </div>
        )}

        <div className="accordionHeader" onClick={() => setShowMarketReturn(!showMarketReturn)}>
          <span>Market Return Details</span>
          <span>{showMarketReturn ? '▲' : '▼'}</span>
        </div>
        {showMarketReturn && (
          <div className="accordionContent">
            <LabelInput label="Unit Price MarketReturn" value={unitPriceMR} onChange={setUnitPriceMR} />
            <LabelInput label="Market Return Qty" value={marketReturnQty} onChange={setMarketReturnQty} />
            <LabelInput label="Market Return Free Qty" value={marketReturnFreeQty} onChange={setMarketReturnFreeQty} />
            <LabelInput label="Market Return Total" value={marketReturnTotal} editable={false} />
          </div>
        )}
      </div>

      <LabelInput label="Line Total" value={lineTotal} editable={false} />

      <div className="buttonRow">
        <button className="btn cancel" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn ok" onClick={handleSave}>OK</button>
      </div>
    </div>
  );
};


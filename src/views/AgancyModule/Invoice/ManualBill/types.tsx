// types.ts

export interface ItemType {
  itemName: string;
  category: string;
  quantity: string;
  goodReturnQty: string;
  goodReturnFreeQty: string;
  marketReturnQty: string;
  marketReturnFreeQty: string;
  freeIssue: string;
  lineTotal: string;
  unitPrice?: string;
  unitPriceGR?: string;
  unitPriceMR?: string;
  specialDiscount?: string;
}

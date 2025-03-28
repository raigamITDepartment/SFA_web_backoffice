export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    category: string
    price: number
    stock: number
    Qty: number
    Damaged: number
    Rqty: number
    Iactual: number
    Iqty: number
    CIAccepted: number
    CIPeding: number
    status: number
    sales: number
    salesPercentage: number
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    productStatus: string
    productType: string[]
}

export type GetProductListResponse = {
    list: Product[]
    total: number
}

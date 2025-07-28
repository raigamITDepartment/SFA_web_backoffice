export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    category: string
    price: number
    stock: number
    status: number
    sales: number
    salesPercentage: number

    SAP: string
    LN: string
    Product: string
    Range: string
    UMO: string
    Size: string
    Volume: string
    unitValue: string
    CategoryType: string
    Subcategory: string
    Subsubcategory: string
    Flavor: string
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

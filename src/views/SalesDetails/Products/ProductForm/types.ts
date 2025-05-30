import type { Control, FieldErrors } from 'react-hook-form'

export type Product = {
    id: string
    name: string
    productCode: string
    SPAcode: string
    img: string
    imgList: {
        id: string
        name: string
        img: string
    }[]
    category: string
    Subcategory: string
    SubSubcategory: string
    Size: string
    Volume: string
    UnitValue: string
    price: number
    stock: number
    status: number

    tag: string[]
    brand: string
    vendor: string
    active: boolean
    sales: number
    salesPercentage: number
    description: string
}


export type MeasurementFields= {
    UOM: string
    Size: string
    Volume: string
    UnitValue: number | string
}


export type GeneralFields = {
    name: string
    productCode: string
    SAPcode: string
    channel: string
    description: string
}

export type PricingFields = {
    price: number | string
    costPerItem: number | string

}

export type ImageFields = {
    imgList: {
        id: string
        name: string
        img: string
    }[]
}

export type AttributeFields = {
    category: string
    Subcategory: string
    SubSubcategory: string
    Size: string
    Volume: string
    UnitValue: string
    tags?: { label: string; value: string }[]
    brand?: string
}

export type ProductFormSchema = GeneralFields &
    PricingFields &
    ImageFields &
    AttributeFields &
    MeasurementFields

export type FormSectionBaseProps = {
    control: Control<ProductFormSchema>
    errors: FieldErrors<ProductFormSchema>
}

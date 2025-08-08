import { useEffect, useState } from 'react'
import { useForm, Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'


import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'

import RichTextEditor from '@/components/shared/RichTextEditor'
import { Form, FormItem } from '@/components/ui/Form'

import {  HiPlus, HiMinus } from 'react-icons/hi'
import { PiImagesThin } from 'react-icons/pi'

// Types
type Image = {
    id: string
    name: string
    img: string
}

export type ProductFormSchema = {
    name: string
    productCode: string
    SAPcode: string
    description: string
    channel: string[]
    subchannel?: string[]
    LNcode?: string
    price: string
    costPerItem: string
    imgList: Image[]
    category: string
    Subcategory: string
    SubSubcategory: string
    flavor: string
    UOM: string
    UnitValue: string
    innerCount: string
    Size: string
    Volume: string
    Unitvolume: string
    Unitweight: string
    pricingRows: {
        channel: string
        price: string
    }[]
}

type ProductFormProps = {
    onFormSubmit: (values: ProductFormSchema) => void
    defaultValues?: ProductFormSchema
    newProduct?: boolean
    children?: React.ReactNode
}

const validationSchema = z.object({
    name: z.string().min(1, 'Product name required!'),
    productCode: z.string().min(1, 'Product code required!'),
    SAPcode: z.string().min(1, 'SAP code required!'),
    description: z.string().min(1, 'Description required!'),
    channel: z.array(z.string()).min(1, 'Channel required!'),
    subchannel: z.array(z.string()).min(1, 'Sub-channel required!'),
    LNcode: z.string().min(1, 'LN Code required!'),
    price: z.string().min(1, 'Price required!'),
    costPerItem: z.string().min(1, 'Cost required!'),
    imgList: z.array(z.object({ id: z.string(), name: z.string(), img: z.string() })).min(1, 'At least 1 image required!'),
    category: z.string().min(1, 'Category required!'),
    Subcategory: z.string().min(1, 'Subcategory required!'),
    SubSubcategory: z.string().min(1, 'SubSubcategory required!'),
    flavor: z.string().min(1, 'Flavor required!'),
    UOM: z.string().min(1, 'UOM required!'),
    UnitValue: z.string().min(1, 'Unit Value required!'),
    innerCount: z.string().optional(),
    Size: z.string().min(1, 'Size required!'),
    Volume: z.string().min(1, 'Volume required!'),
    Unitvolume: z.string().optional(),
    Unitweight: z.string().optional(),
    pricingRows: z.array(
        z.object({
            channel: z.string().min(1, 'Channel required!'),
            price: z.string().min(1, 'Price required!')
        })
    ).min(1, 'At least one pricing row required!')
})

// Options
const channelOptions = ['C', 'D', 'S', 'K', 'B', 'R'].map(v => ({ label: v, value: v }))

const categoryOptions = ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'].map(v => ({ label: v, value: v.toLowerCase() }))
const subCategoryOptions = ['Ravan', 'Cloths', 'Devices', 'Shoes', 'Watches'].map(v => ({ label: v, value: v.toLowerCase() }))
const subSubCategoryOptions = ['trend', 'unisex'].map(v => ({ label: v, value: v }))
const sizeOptions = ['Small', 'Meadium', 'Large'].map((v, i) => ({ label: v, value: `${i + 1}` }))
const volumeOptions = ['L/ML', 'G/KG'].map((v, i) => ({ label: v, value: `${i + 1}` }))
const uomOptions = ['Pack', 'Bottle', 'Box', 'Pack&Bundle', 'Each'].map((v, i) => ({ label: v, value: `${i + 1}` }))
const priceChannels = ['National Channel', 'Ch1', 'Ch2', 'Ch3'].map(v => ({ label: v, value: v }))

const ProductForm = ({ onFormSubmit, defaultValues, children }: ProductFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormSchema>({
        defaultValues,
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) reset(defaultValues)
    }, [JSON.stringify(defaultValues)])

    const [pricingRows, setPricingRows] = useState([0])

    const Volume = useWatch({ control, name: 'Volume' })
    const UOM = useWatch({ control, name: 'UOM' })

    const handleUpload = (onChange: any, original: Image[] = [], files: File[]) => {
        const id = `img-${original.length + 1}`
        const file = files[files.length - 1]
        const image: Image = {
            id,
            name: file.name,
            img: URL.createObjectURL(file),
        }
        onChange([...original, image])
    }

    const beforeUpload = (fileList: FileList | null) => {
        const allowed = ['image/jpeg', 'image/png']
        const maxSize = 500000
        if (!fileList) return true
        for (const file of fileList) {
            if (!allowed.includes(file.type)) return 'Please upload .jpeg or .png!'
            if (file.size > maxSize) return 'File too large (max 500KB)'
        }
        return true
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <Container>
                <h2 className="mb-2">Item Creation</h2>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        {/* GENERAL SECTION */}
                        <Card>
                            <h4 className="mb-6">Basic Info</h4>
                            {[
                                { name: 'name', label: 'Product name' },
                                { name: 'productCode', label: 'Product code' },
                                { name: 'SAPcode', label: 'SAP code' },
                                { name: 'LNcode', label: 'LN code' },
                            ].map(({ name, label }) => (
                                <FormItem key={name} label={label} invalid={Boolean(errors[name as keyof ProductFormSchema])} errorMessage={errors[name as keyof ProductFormSchema]?.message}>
                                    <Controller
                                        name={name as keyof ProductFormSchema}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                value={typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''}
                                            />
                                        )}
                                    />
                                </FormItem>
                            ))}
                            <FormItem label="Channel" invalid={Boolean(errors.channel)} errorMessage={errors.channel?.message}>
                                <Controller
                                    name="channel"
                                    control={control}
                                    render={({ field }) => (
                                        <Select isMulti options={channelOptions} value={channelOptions.filter(opt => field.value?.includes(opt.value))} onChange={(opts) => field.onChange(opts.map(opt => opt.value))} />
                                    )}
                                />
                            </FormItem>
                         
                            <FormItem label="Description" invalid={Boolean(errors.description)} errorMessage={errors.description?.message}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor content={field.value} onChange={({ html }) => field.onChange(html)} />
                                    )}
                                />
                            </FormItem>
                        </Card>

                        {/* PRICING SECTION */}
                        <Card>
                            <h4 className="mb-6">Pricing</h4>
                            {pricingRows.map(idx => (
                                <div key={idx} className="flex gap-4 items-end">
                                    <FormItem label="Channel" className="flex-1">
                                        <Controller
                                            name={`pricingRows.${idx}.channel`}
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Select options={priceChannels} value={priceChannels.find(c => c.value === field.value)} onChange={opt => field.onChange(opt?.value)} />
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem label="Price" className="flex-1">
                                        <Controller
                                            name={`pricingRows.${idx}.price`}
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Input type="number" prefix="Rs." {...field} />
                                            )}
                                        />
                                    </FormItem>
                                    <button type="button" className="text-red-500" onClick={() => setPricingRows(r => r.filter(i => i !== idx))}><HiMinus /></button>
                                </div>
                            ))}
                            <button type="button" className="text-primary mt-2" onClick={() => setPricingRows(r => [...r, r.length])}><HiPlus /> Add Price</button>
                        </Card>

                        {/* MEASUREMENT SECTION */}
                        <Card>
                            <h4 className="mb-6">Measurement</h4>
                            <FormItem label="UOM">
                                <Controller
                                    name="UOM"
                                    control={control}
                                    render={({ field }) => (
                                        <Select options={uomOptions} value={uomOptions.find(o => o.value === field.value)} onChange={opt => field.onChange(opt?.value)} />
                                    )}
                                />
                            </FormItem>
                            {UOM === '4' && (
                                <FormItem label="Inner Count">
                                    <Controller name="innerCount" control={control} render={({ field }) => <Input {...field} />} />
                                </FormItem>
                            )}
                            <FormItem label="Size">
                                <Controller name="Size" control={control} render={({ field }) => <Select options={sizeOptions} value={sizeOptions.find(o => o.value === field.value)} onChange={opt => field.onChange(opt?.value)} />} />
                            </FormItem>
                            <FormItem label="Volume">
                                <Controller name="Volume" control={control} render={({ field }) => <Select options={volumeOptions} value={volumeOptions.find(o => o.value === field.value)} onChange={opt => field.onChange(opt?.value)} />} />
                            </FormItem>
                            {Volume === '1' && (
                                <FormItem label="Unit Volume">
                                    <Controller name="Unitvolume" control={control} render={({ field }) => <Input {...field} />} />
                                </FormItem>
                            )}
                            {Volume === '2' && (
                                <FormItem label="Unit Weight">
                                    <Controller name="Unitweight" control={control} render={({ field }) => <Input {...field} />} />
                                </FormItem>
                            )}
                            
                        </Card>
                    </div>

                    {/* IMAGE + ATTRIBUTES */}
                    <div className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col">
                        <Card>
                            <h4 className="mb-2">Images</h4>
                            <Controller
                                name="imgList"
                                control={control}
                                render={({ field }) => (
                                    <Upload
                                        draggable
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        onChange={(files) => handleUpload(field.onChange, field.value, files)}
                                    >
                                        <div className="text-center">
                                            <PiImagesThin size={60} />
                                            <p>Click or drop image</p>
                                        </div>
                                    </Upload>
                                )}
                            />
                        </Card>

                        <Card>
                            <h4 className="mb-6">Attributes</h4>
                            {[
                                { name: 'category', label: 'Category', options: categoryOptions },
                                { name: 'Subcategory', label: 'Sub Category', options: subCategoryOptions },
                                { name: 'SubSubcategory', label: 'Sub-sub Category', options: subSubCategoryOptions },
                            ].map(({ name, label, options }) => (
                                <FormItem key={name} label={label}>
                                    <Controller name={name as keyof ProductFormSchema} control={control} render={({ field }) => (
                                        <Select options={options} value={options.find(o => o.value === field.value)} onChange={opt => field.onChange(opt?.value)} />
                                    )} />
                                </FormItem>
                            ))}
                            <FormItem label="Flavor">
                                <Controller name="flavor" control={control} render={({ field }) => <Input {...field} />} />
                            </FormItem>
                        </Card>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ProductForm

import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import PricingSection from './components/PricingSection'
import ImageSection from './components/ImageSection'
import AttributeSection from './components/AttributeSection'
import MeasurementSection from './components/MeasurementSection'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { ProductFormSchema } from './types'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type ProductFormProps = {
    onFormSubmit: (values: ProductFormSchema) => void
    defaultValues?: ProductFormSchema
    newProduct?: boolean
} & CommonProps

const validationSchema: ZodType<ProductFormSchema> = z.object({
    name: z.string().min(1, { message: 'Product name required!' }),
    productCode: z.string().min(1, { message: 'Product code required!' }),
    SAPcode: z.string().min(1, { message: 'SAP code required!' }),
    description: z.string().min(1, { message: 'Product description required!' }),
    channel: z.string().min(1, { message: 'Channel required!' }),
    

    price: z.string().min(1, { message: 'Price required!' }),
 
    costPerItem: z.string().min(1, { message: 'Cost required!' }),

    imgList: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                img: z.string(),
            }),
        )
        .min(1, { message: 'At least 1 image required!' }),
    category: z.string().min(1, { message: 'Product category required!' }),
    Subcategory: z.string().min(1, { message: 'Subcategory required!' }),
    SubSubcategory: z.string().min(1, { message: 'SubSubcategory required!' }),
    Size: z.string().min(1, { message: 'Size required!' }),
    Volume: z.string().min(1, { message: 'Volume required!' }),
    UnitValue: z.string().min(1, { message: 'Unit value required!' }),
    UOM: z.string().min(1, { message: 'UOM required!' }),

    pricingRows: z.array(
        z.object({
            channel: z.string().min(1, { message: 'Channel required!' }),
            price: z.string().min(1, { message: 'Price required!' }),
        })
    ).min(1, { message: 'At least one pricing row required!' }),
})



const ProductForm = (props: ProductFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {
            imgList: [],
            pricingRows: [
            { channel: '', price: '' },
            { channel: '', price: '' },
            { channel: '', price: '' },
        ],
        },
        children,
    } = props

    

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<ProductFormSchema>({
        defaultValues: {
            ...defaultValues,
        //     pricingRows: defaultValues.pricingRows ?? [
        //     { channel: '', price: '' },
        //     { channel: '', price: '' },
        //     { channel: '', price: '' },
        // ],
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: ProductFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <h2 className='mb-2'>Item Creation</h2>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <GeneralSection control={control} errors={errors} /> 
                        <PricingSection control={control} errors={errors} />
                        <MeasurementSection control={control} errors={errors} />
                    </div>
                    <div className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col">
                        <ImageSection control={control} errors={errors} />
                        <AttributeSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ProductForm

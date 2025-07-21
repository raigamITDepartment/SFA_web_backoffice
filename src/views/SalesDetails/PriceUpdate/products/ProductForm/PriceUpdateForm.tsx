import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import PricingSection from './components/PricingSection'

import OldPrice from './components/OldPrice'
import Button from '@/components/ui/Button'
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
    productCode: z.string().min(1, { message: 'Produc code required!' }),
    description: z.string().min(1, { message: 'Produc description required!' }),
    price: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Price required!' }),
    }),
    taxRate: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Tax rate required!' }),
    }),
    costPerItem: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Cost required!' }),
    }),
    bulkDiscountPrice: z.union([z.string(), z.number()], {
        errorMap: () => ({ message: 'Bulk discount price required!' }),
    }),
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
})

const ProductForm = (props: ProductFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {
            imgList: [],
            channel: '',
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
  className="flex flex-col w-full h-full"
  containerClassName="flex flex-col w-full justify-between"
  onSubmit={handleSubmit(onSubmit)}
>
  <Container className="w-full max-w-none p-2 sm:p-6">
    <div className="flex flex-col gap-6 lg:flex-row w-full">
      <div className="flex flex-col gap-4 w-full">
        <GeneralSection/>
        <PricingSection control={control} errors={errors} />
      </div>
      <div className="flex flex-col gap-4 w-full min-w-0">
        <OldPrice />
      </div>
    </div>
  </Container>
  <BottomStickyBar className="w-full px-2 sm:px-4">
    {children}
  </BottomStickyBar>
</Form>


    )
}

export default ProductForm

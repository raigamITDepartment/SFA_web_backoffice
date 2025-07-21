// pages/CreateInvoice.tsx
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import { FormItem, Form } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { HiOutlineArrowRight } from 'react-icons/hi'

const customers = [
    { value: 'customerA', label: 'Pathirana Super City' },
    { value: 'customerB', label: 'Customer B' },
    { value: 'customerC', label: 'Super K' },
]

const customerOptions = customers

const invoiceTypeOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Agency', label: 'Agency' },
    { value: 'Company', label: 'Company' },
]

const invoiceModeOptions = [
    { value: 'Booking', label: 'Booking' },
    { value: 'Actual', label: 'Actual' },
]

const formSchema = z.object({
    customerId: z.string().min(1, 'Please select a customer'),
    invoiceType: z.string().min(1, 'Please select an invoice type'),
    invoiceMode: z.string().min(1, 'Please select an invoice mode'),
})

type FormSchemaType = z.infer<typeof formSchema>

export default function CreateInvoice() {
    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // Validate on change to enable/disable button
        defaultValues: {
            customerId: '',
            invoiceType: '',
            invoiceMode: '',
        },
    })

    const onSubmit = (data: FormSchemaType) => {
        const customerName = customers.find(
            (c) => c.value === data.customerId,
        )?.label

        navigate('/AgancyModule-Invoice-CreateInvoiceScreen', {
            state: {
                customerId: data.customerId,
                customerName,
                invoiceType: data.invoiceType,
                invoiceMode: data.invoiceMode,
            },
        })
    }

    return (
        <Card
            className="w-full max-w-md p-8 shadow-lg mt-[10px] mx-auto"
            bordered={true}
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                Create New Invoice
            </h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Customer"
                    invalid={!!errors.customerId}
                    errorMessage={errors.customerId?.message}
                >
                    <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Customer"
                                options={customerOptions}
                                value={customerOptions.find(
                                    (c) => c.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Invoice Type"
                    invalid={!!errors.invoiceType}
                    errorMessage={errors.invoiceType?.message}
                >
                    <Controller
                        name="invoiceType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Type"
                                options={invoiceTypeOptions}
                                value={invoiceTypeOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Invoice Mode"
                    invalid={!!errors.invoiceMode}
                    errorMessage={errors.invoiceMode?.message}
                >
                    <Controller
                        name="invoiceMode"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Mode"
                                options={invoiceModeOptions}
                                value={invoiceModeOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <div className="mt-8">
                    <Button
                        block
                        variant="solid"
                        type="submit"
                        disabled={!isValid}
                        icon={<HiOutlineArrowRight />}
                    >
                        Proceed
                    </Button>
                </div>
            </Form>
        </Card>
    )
}

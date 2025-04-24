import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import DatePicker from '@/components/ui/DatePicker'
import { useState } from 'react'

type PricingSectionProps = FormSectionBaseProps




const PricingSection = ({ control, errors }: PricingSectionProps) => {


    const [date, setDate] = useState<Date | null>(new Date())
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(2022, 11, 1),
        new Date(2022, 11, 5),
    ])
    // const [dateTime, setDateTime] = useState<Date | null>(new Date())
    // const [dateTime, setDateTime] = (useState < Date) | (null > new Date())





    const handleRangePickerChange = (date: [Date | null, Date | null]) => {
        console.log('Selected range date', date)
        setDateRange(date)
    }




    return (
        <Card>
            <h4 className="mb-6">New Pricing</h4>
            <div>
                <FormItem
                    label="Price"
                    invalid={Boolean(errors.price)}
                    errorMessage={errors.price?.message}
                >
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                thousandSeparator
                                type="text"
                                inputPrefix="$"
                                autoComplete="off"
                                placeholder="0.00"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Cost price"
                    invalid={Boolean(errors.costPerItem)}
                    errorMessage={errors.costPerItem?.message}
                >
                    <Controller
                        name="costPerItem"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                thousandSeparator
                                type="text"
                                inputPrefix="$"
                                autoComplete="off"
                                placeholder="0.00"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="md:flex gap-4">
                <FormItem
                    label="Price Effective Date"
                    invalid={Boolean(errors.bulkDiscountPrice)}
                    errorMessage={errors.bulkDiscountPrice?.message}
                    className="w-full"
                >
                   <DatePicker.DatePickerRange
                placeholder="Select dates range"
                value={dateRange}
                onChange={handleRangePickerChange}
            />
                </FormItem>
               
            </div>
        </Card>
    )
}

export default PricingSection

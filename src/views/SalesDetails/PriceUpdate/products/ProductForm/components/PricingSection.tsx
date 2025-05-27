import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import DatePicker from '@/components/ui/DatePicker'
import { useState } from 'react'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

type PricingSectionProps = FormSectionBaseProps

const channelOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    // Add more or fetch from API
]


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

            <div className="mb-4">
                <FormItem
                    
                    label="Channel"
                    invalid={Boolean(errors.channel)}
                    errorMessage={errors.channel?.message}
                >
                    <Controller
                        name="channel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={channelOptions}
                                {...field}
                                value={channelOptions.find(option => option.value === field.value) || null}
                                onChange={option => field.onChange(option?.value)}
                                placeholder="Select channel"
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div>
                <FormItem
                    
                    label="Price"
                    invalid={Boolean(errors.price)}
                    errorMessage={errors.price?.message}
                >
                    <Controller
                        name="price"
                        disabled
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                thousandSeparator
                                type="text"
                                inputPrefix="Rs."
                                autoComplete="off"
                                placeholder="0.00"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>
            </div>
            
            <div>    
                <FormItem
                    label="New price"
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
                                inputPrefix="Rs."
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
            <div className="flex mt-6 w-full">
                <Button variant="solid" type="submit" className="w-full sm:w-auto">
                    Update
                </Button>
            </div>
        </Card>
    )
}

export default PricingSection

import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import type { FormSectionBaseProps } from '../types'

type PricingSectionProps = FormSectionBaseProps

const channelOptions = [
    { label: 'National Channel', value: 'National Channel' } as any,
    { label: 'Ch1', value: 'Ch1' },
    { label: 'Ch2', value: 'Ch2' },
    { label: 'Ch3', value: 'Ch3' },
]

const channelValidation = {
    validate: {
        required: (value: any) => {
            if (!value) {
                return 'Required'
            }
            return
        }
    }
}

const priceValidation = {
    validate: {
        required: (value: any) => {
            if (!value) {
                return 'Required'
            }
            return
        }
    }
}

// Maximum 3 pairs
const MAX_ROWS = 3

const PricingSection = ({ control }: PricingSectionProps) => {
    const [visibleRows, setVisibleRows] = useState(1)

    return (
        <Card>
            <h4 className="mb-6">Pricing</h4>
            <div className="flex flex-col gap-4">
                {[...Array(visibleRows)].map((_, idx) => (
                    <div key={idx} className="flex gap-4 items-end">
                        <FormItem
                            label="Channel"
                            className="flex-1"
                        >
                            <Controller
                                name={`pricingRows.${idx}.channel`}
                                control={control}
                                defaultValue="" // Set default value
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        options={channelOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                                rules={channelValidation}
                            />
                        </FormItem>
                        <FormItem
                            label="Price"
                            className="flex-1"
                        >
                            <Controller
                                name={`pricingRows.${idx}.price`}
                                control={control}
                                defaultValue="" // Set default value
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        prefix="$"
                                        autoComplete="off"
                                        placeholder="0.00"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                                rules={priceValidation}
                            />
                        </FormItem>
                    </div>
                ))}
                {visibleRows < MAX_ROWS && (
                    <button
                        type="button"
                        className="flex items-center gap-2 text-primary mt-2"
                        onClick={() => setVisibleRows(visibleRows + 1)}
                    >
                        <HiPlus className="text-lg" />
                        <span>Add another price</span>
                    </button>
                )}
            </div>
        </Card>
    )
}


export default PricingSection
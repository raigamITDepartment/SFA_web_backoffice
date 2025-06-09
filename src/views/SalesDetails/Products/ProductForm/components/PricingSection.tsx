import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import { HiPlus, HiMinus } from 'react-icons/hi'
import type { FormSectionBaseProps } from '../types'

type PricingSectionProps = FormSectionBaseProps

const channelOptions = [
    { label: 'National Channel', value: 'National Channel' } as any,
    { label: 'Ch1', value: 'Ch1' },
    { label: 'Ch2', value: 'Ch2' },
    { label: 'Ch3', value: 'Ch3' },
]

const subChannelOptions = [
    { label: 'Sub 1', value: 'Sub 1' },
    { label: 'Sub 2', value: 'Sub 2' },
    { label: 'Sub 3', value: 'Sub 3' },
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

const subChannelValidation = {
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

const PricingSection = ({ control }: PricingSectionProps) => {
    const [visibleRows, setVisibleRows] = useState([0])

    const handleAddRow = () => {
        setVisibleRows(prev => [...prev, prev.length > 0 ? prev[prev.length - 1] + 1 : 0])
    }

    const handleRemoveRow = (idx: number) => {
        setVisibleRows(prev => prev.length > 1 ? prev.filter(i => i !== idx) : prev)
    }

    return (
        <Card>
            <h4 className="mb-6">Pricing</h4>
            <div className="flex flex-col gap-4">
                {visibleRows.map((idx) => (
                    <div key={idx} className="flex gap-4 items-end">
                        <FormItem
                            label="Channel"
                            className="flex-1"
                        >
                            <Controller
                                name={`pricingRows.${idx}.channel`}
                                control={control}
                                defaultValue=""
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
                        {/* <FormItem
                            label="Sub-channel"
                            className="flex-1"
                        >
                            <Controller
                                name={`pricingRows.${idx}.subChannel`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Sub-channel"
                                        options={subChannelOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                                rules={subChannelValidation}
                            />
                        </FormItem> */}
                        <FormItem
                            label="Price"
                            className="flex-1"
                        >
                            <Controller
                                name={`pricingRows.${idx}.price`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        prefix="Rs."
                                        autoComplete="off"
                                        placeholder="0.00"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                                rules={priceValidation}
                            />
                        </FormItem>
                        <button
                            type="button"
                            className="mb-2 flex items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 shadow-sm transition w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleRemoveRow(idx)}
                            disabled={visibleRows.length === 1}
                            title="Remove row"
                        >
                            <HiMinus className="text-xl" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="flex items-center gap-2 text-primary mt-2"
                    onClick={handleAddRow}
                >
                    <HiPlus className="text-lg" />
                    <span>Add another price</span>
                </button>
            </div>
        </Card>
    )
}

export default PricingSection
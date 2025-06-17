import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import DatePicker from '@/components/ui/DatePicker'
import { Button } from '@/components/ui'
import axios from 'axios'

const { DatePickerRange } = DatePicker

const categoryOptions = [
    { label: 'Category 1', value: 'Category 1' }as any,
    { label: 'Category 2', value: 'Category 2' },
    { label: 'Category 3', value: 'Category 3' },
    { label: 'Category 4', value: 'Category 4' },
]

// Sample data for dropdowns
const channelOptions = [
    { label: 'National Channel', value: 'National Channel' } as any,
    { label: 'Bakery Channel', value: 'Bakery Channel' },
]
const subChannelOptions = [
    { label: 'Sub-Channel 1', value: 'Sub-Channel 1' }as any,
    { label: 'Sub-Channel 2', value: 'Sub-Channel 2' },
]
const regionOptions = [
    { label: 'Region 1', value: 'Region 1' }as any,
    { label: 'Region 2', value: 'Region 2' },
]
const areaOptions = [
    { label: 'Area 1', value: 'Area 1' }as any,
    { label: 'Area 2', value: 'Area 2' },
]
const rangeOptions = [
    { label: 'Range 1', value: 'Range 1' }as any,
    { label: 'Range 2', value: 'Range 2' },
]

type FormSchema = {
    channel: string
    subChannel: string
    region: string
    area: string
    range: string
    territoryName: string
    isActive: boolean
    dateRange?: [Date?, Date?]
    categories?: string[]
    categoryValues?: { [category: string]: string }
}

const TerritoryWiseCategory = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        watch,
    } = useForm<FormSchema>()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Watch selected categories and categoryValues
    const selectedCategories = watch('categories') || []
    const categoryValues = watch('categoryValues') || {}

    // Simulate API call
    const submitToApi = async (data: FormSchema) => {
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1000))
            // If using real API, uncomment below:
            // await axios.post('/api/territory-category', data)
            setSuccess(true)
        } catch (err: any) {
            setError('Submission failed')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (values: FormSchema) => {
        submitToApi(values)
    }

    return (
        <Card bordered={false} className="w-full h-1/2">
            <h5 className="mb-2">Territory Wise Category Target</h5>
            <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormItem
                        invalid={Boolean(errors.channel)}
                        errorMessage={errors.channel?.message}
                    >
                        <Controller
                            name="channel"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="md"
                                    placeholder="Select Channel"
                                    options={channelOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            rules={{
                                validate: {
                                    required: (value) => {
                                        if (!value) {
                                            return 'Required'
                                        }
                                        return
                                    }
                                }
                            }}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.subChannel)}
                        errorMessage={errors.subChannel?.message}
                    >
                        <Controller
                            name="subChannel"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="md"
                                    placeholder="Select Sub-Channel"
                                    options={subChannelOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            rules={{
                                validate: {
                                    required: (value) => {
                                        if (!value) {
                                            return 'Required'
                                        }
                                        return
                                    }
                                }
                            }}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.region)}
                        errorMessage={errors.region?.message}
                    >
                        <Controller
                            name="region"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="md"
                                    placeholder="Select Region"
                                    options={regionOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            rules={{
                                validate: {
                                    required: (value) => {
                                        if (!value) {
                                            return 'Required'
                                        }
                                        return
                                    }
                                }
                            }}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.area)}
                        errorMessage={errors.area?.message}
                    >
                        <Controller
                            name="area"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="md"
                                    placeholder="Select Area"
                                    options={areaOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            rules={{
                                validate: {
                                    required: (value) => {
                                        if (!value) {
                                            return 'Required'
                                        }
                                        return
                                    }
                                }
                            }}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.range)}
                        errorMessage={errors.range?.message}
                    >
                        <Controller
                            name="range"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="md"
                                    placeholder="Select Range"
                                    options={rangeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            }
                            rules={{
                                validate: {
                                    required: (value) => {
                                        if (!value) {
                                            return 'Required'
                                        }
                                        return
                                    }
                                }
                            }}
                        />
                    </FormItem>
                    {/* Multi Select Category */}
                    <FormItem
                        invalid={Boolean(errors.categories)}
                        errorMessage={errors.categories?.message}
                    >
                        <Controller
                            name="categories"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) =>
                                <Select
                                    isMulti
                                    size='md'
                                    placeholder="Select Category"
                                    options={categoryOptions}
                                    value={categoryOptions.filter(opt => field.value?.includes(opt.value))}
                                    onChange={(selected) => {
                                        const selectedValues = Array.isArray(selected)
                                            ? selected.map(opt => opt.value)
                                            : []
                                        const prev = categoryValues || {};
                                        const newVals: { [category: string]: string } = { ...prev };
                                        Object.keys(newVals).forEach(key => {
                                            if (!selectedValues.includes(key)) {
                                                delete newVals[key];
                                            }
                                        });
                                        setValue('categoryValues', newVals);
                                        field.onChange(selectedValues)
                                    }}
                                />
                            }
                        />
                    </FormItem>
                </div>
                <FormItem>
                    <span className="font-bold ">Territory List:</span>
                    <div className="flex items-center gap-4 mt-6 flex-wrap">
                        <FormItem className="mb-0">
                            <Controller
                                name="territoryName"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        disabled
                                        size='sm'
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Territory Name"
                                        {...field}
                                    />
                                }
                            />
                        </FormItem>
                        {/* Dynamically render input fields for each selected category */}
                        {selectedCategories.map((cat) => (
                            <FormItem className="mb-0" key={cat}>
                                <Controller
                                    name={`categoryValues.${cat}`}
                                    control={control}
                                    render={({ field }) =>
                                        <Input
                                            type="text"
                                            size='sm'
                                            autoComplete="off"
                                            placeholder={`${cat} Target`}
                                            {...field}
                                        />
                                    }
                                />
                            </FormItem>
                        ))}
                        <FormItem className="mb-0">
                            <Controller
                                name="dateRange"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerRange
                                        placeholder="Select date range"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </FormItem>
                        <Button
                            type="button"
                            size="sm"
                            className="lg:w-25 xl:w-25 sm:w-full text-red-600 border-red-600 border-2 hover:border-3 hover:border-red-400 hover:ring-0 hover:text-red-600 hover:text-sm"
                            onClick={() => {
                                setValue('dateRange', undefined);
                                setValue('categoryValues', {});
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </FormItem>
                <FormItem>
                    <div className="flex justify-center gap-4">
                        <Button
                            className="lg:w-70 xl:w-70 sm:w-full"
                            variant="solid"
                            block
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button
                            className="lg:w-70 xl:w-70 sm:w-full"
                            type="button"
                            block
                            clickFeedback={false}
                            onClick={() => {
                                reset();
                                setError(null)
                                setSuccess(false)
                            }}
                        >
                            Discard
                        </Button>
                    </div>
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                    {success && <div className="text-green-600 mt-2">Submitted successfully!</div>}
                </FormItem>
            </Form>
        </Card>
    )
}

export default TerritoryWiseCategory
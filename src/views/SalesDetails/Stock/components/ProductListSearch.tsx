import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import { Button } from '@/components/ui'

type ProductListSearchProps = {
    onInputChange: (value: string) => void
    area: string
    agency: string
    range: string
    category: string
    isActive: boolean
}

const ProductListSearch = (props: ProductListSearchProps) => {
    const { onInputChange } = props

    function handleDebounceFn(value: string) {
        onInputChange?.(value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ProductListSearchProps>({
        defaultValues: {
            area: '',
            agency: '',
            range: '',
            category: '',
            isActive: true,
        },
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit(() => { })}>
                <div className="flex flex-col space-y-4">
                    <div className="flex space-x-4">
                        <FormItem
                            invalid={Boolean(errors.area)}
                            errorMessage={errors.area?.message}
                        >
                            <Controller
                                name="area"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Area"
                                        options={[
                                            { label: 'All Island', value: 'All Island' } as any,
                                            { label: 'Central', value: 'Central' } as any,
                                            { label: 'Gampaha', value: 'Gampaha' } as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
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
                            invalid={Boolean(errors.agency)}
                            errorMessage={errors.agency?.message}
                        >
                            <Controller
                                name="agency"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Agency"
                                        options={[
                                            { label: 'All Island', value: 'All Island' } as any,
                                            { label: 'Gampaha', value: 'Gampaha' } as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
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
                                        size="sm"
                                        placeholder="Select Range"
                                        options={[
                                            { label: 'C', value: 'C' } as any,
                                            { label: 'D', value: 'D' } as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
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
                            invalid={Boolean(errors.category)}
                            errorMessage={errors.category?.message}
                        >
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Category"
                                        options={[
                                            { label: 'Category 1', value: 'Category 1' } as any,
                                            { label: 'Category 2', value: 'Category 2' } as any,
                                            { label: 'Category 3', value: 'Category 3' } as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
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

                        <Button
                            variant='solid'
                            size='sm'
                            onClick={() => onInputChange('')}
                        >
                            Filter
                        </Button>
                    </div>

                    <div>
                        
                    </div>

                    <div>
                        
                        <Input
                            id="search"
                            placeholder="Search"
                            suffix={<TbSearch className="text-lg" />}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default ProductListSearch


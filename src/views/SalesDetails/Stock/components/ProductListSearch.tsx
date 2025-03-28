import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'


import { useForm, Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'

type ProductListSearchProps = {
    onInputChange: (value: string) => void
    country: string;
    channelName: string;
    isActive: boolean;
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
            country: '',
            channelName: '',
            isActive: true, // Set default value to true
        },
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
    <div>
        <div className="flex flex-col space-y-4">
         
            <div className="flex space-x-4">
                           <Controller
                                name="country"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Area"
                                        options={[
                                            { label: 'All Island', value: 'All Island' }as any,
                                            { label: 'Central', value: 'Central' }as any,
                                            { label: 'Gampaha', value: 'Gampaha' }as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required';
                                            }
                                            return;
                                        }
                                    }
                                }}
                            />
                    
                            
            <div>
                         <Controller
                                name="country"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Agency"
                                        options={[
                                            { label: 'All Island', value: 'All Island' }as any,
                                            { label: 'Gampaha', value: 'Gampaha' }as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required';
                                            }
                                            return;
                                        }
                                    }
                                }}
                            />
            </div>
            <div>
                             <Controller
                                name="country"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        size="sm"
                                        placeholder="Select Range"
                                        options={[
                                            { label: 'C', value: 'C' }as any,
                                            { label: 'D', value: 'D' }as any,
                                        ]}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                }
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required';
                                            }
                                            return;
                                        }
                                    }
                                }}
                            />
            </div>
         
            <div>
                <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => onInputChange('')}
                >
                Search
                </button>
            </div>
            </div>


            <div>
            <label htmlFor="search">Search</label>
            <Input
                id="search"
                placeholder="Search"
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
            </div>
        </div>
       
    </div>




        
    )
}

export default ProductListSearch

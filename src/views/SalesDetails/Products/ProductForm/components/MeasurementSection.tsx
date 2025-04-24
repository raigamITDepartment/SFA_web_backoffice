import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Tooltip from '@/components/ui/Tooltip'
import { FormItem } from '@/components/ui/Form'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import { Controller } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import type { FormSectionBaseProps } from '../types'

type MeasurementSectionProps = FormSectionBaseProps

type Options = {
    label: string
    value: string
}[]

const Sizes: Options = [
    { label: 'Small', value: 'Small' },
    { label: 'Meadium', value: 'Meadium' },
    { label: 'Large', value: 'Large' },
   
]

const Volumes: Options = [
    { label: 'L', value: 'L' },
    { label: 'ML', value: 'ML' },
    { label: 'G', value: 'G' },
    { label: 'KG', value: 'KG' },
]


const  UOMs: Options = [
 
    { label: 'Bottle', value: 'Bottle' },
    { label: 'Box', value: 'Box' },
    { label: 'Carton', value: 'Carton' },
    { label: 'Each', value: 'Each' },
    { label: 'Pack', value: 'Pack' },
]


const MeasurementSection = ({ control, errors }: MeasurementSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6"> Unit of measurement </h4>

            <FormItem
                label="UOM"
                invalid={Boolean(errors.UOM)}
                errorMessage={errors.UOM?.message}
            >
                <Controller
                    name="UOM"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={UOMs}
                            value={UOMs.filter(
                                (UOM) => UOM.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Size"
                invalid={Boolean(errors.Size)}
                errorMessage={errors.Size?.message}
            >
                <Controller
                    name="Size"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={Sizes}
                            value={Sizes.filter(
                                (Size) => Size.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
         
            <FormItem
                label="Volume"
                invalid={Boolean(errors.Volume)}
                errorMessage={errors.Volume?.message}
            >
                <Controller
                    name="Volume"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={Volumes}
                            value={Volumes.filter(
                                (Volume) => Volume.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                    label="UnitValue"
                    invalid={Boolean(errors.UnitValue)}
                    errorMessage={errors.UnitValue?.message as string}
                >
                    <Controller
                        name="UnitValue"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Unit Value"
                                value={field.value as string || ''}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
           
         
        </Card>
    )
}

export default MeasurementSection

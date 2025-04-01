import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Tooltip from '@/components/ui/Tooltip'
import { FormItem } from '@/components/ui/Form'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import { Controller } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import type { FormSectionBaseProps } from '../types'

type AttributeSectionProps = FormSectionBaseProps

type Options = {
    label: string
    value: string
}[]

const categories: Options = [
    { label: 'Bags', value: 'bags' },
    { label: 'Cloths', value: 'cloths' },
    { label: 'Devices', value: 'devices' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Watches', value: 'watches' },
]


const Subcategories: Options = [
    { label: 'Ravan', value: 'bags' },
    { label: 'Cloths', value: 'cloths' },
    { label: 'Devices', value: 'devices' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Watches', value: 'watches' },
]
const SubSubcategories: Options = [
    { label: 'trend', value: 'trend' },
    { label: 'unisex', value: 'unisex' },
]

const AttributeSection = ({ control, errors }: AttributeSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Brand</h4>
            <FormItem
                label="Category"
                invalid={Boolean(errors.category)}
                errorMessage={errors.category?.message}
            >
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={categories}
                            value={categories.filter(
                                (category) => category.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Sub Category"
                invalid={Boolean(errors.Subcategory)}
                errorMessage={errors.Subcategory?.message}
            >
                <Controller
                    name="Subcategory"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={Subcategories}
                            value={Subcategories.filter(
                                (Subcategory) => Subcategory.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Sub-sub Category"
                invalid={Boolean(errors.SubSubcategory)}
                errorMessage={errors.SubSubcategory?.message}
            >
                <Controller
                    name="SubSubcategory"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={SubSubcategories}
                            value={SubSubcategories.filter(
                                (SubSubcategory) => SubSubcategory.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
         
        </Card>
    )
}

export default AttributeSection

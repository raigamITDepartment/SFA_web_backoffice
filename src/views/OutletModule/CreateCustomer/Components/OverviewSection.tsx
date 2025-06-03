import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'

type OverviewSectionProps = FormSectionBaseProps

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    return (
        <Card>
            <h4 className="mb-6">Update Outlet</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name" // Updated label
                    invalid={Boolean(errors.name)} // Updated error handling
                    errorMessage={errors.name?.message} // Updated error handling
                >
                    <Controller
                        name="name" // Updated field name
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Name" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                
                <FormItem
                    label="Category"
                    invalid={Boolean(errors.category)}
                    errorMessage={errors.category?.message}
                >
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) =>
                            <Select

                                placeholder="Select Category"
                                options={[
                                    { label: 'Category 1', value: 'Category 1' } as any,
                                    { label: 'Category 2', value: 'Category 2' },
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
                </FormItem>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Range"
                // invalid={Boolean(errors.range)}
                // errorMessage={errors.range?.message}
                >
                    <Controller
                        name="range"
                        control={control}
                        render={({ field }) => (
                            <Input
                                disabled
                                type="text"
                                placeholder="Range 1" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Route"
                    
                >
                    <Controller
                        name="route"
                        control={control}
                        render={({ field }) => (
                            <Input
                                disabled
                                type="text"
                                autoComplete="off"
                                placeholder="Route 1" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>


            </div>

            <div>
                <FormItem
                    label="Owner Name"
                    invalid={Boolean(errors.ownerName)}
                    errorMessage={errors.ownerName?.message}
                >
                    <Controller
                        name="ownerName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Owner Name" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Address 1"
                    invalid={Boolean(errors.address1)}
                    errorMessage={errors.address1?.message}
                >
                    <Controller
                        name="address1"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Address 1" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Address 2"
                    invalid={Boolean(errors.address1)}
                    errorMessage={errors.address1?.message}
                >
                    <Controller
                        name="address2"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Address 2" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Address 3"
                    invalid={Boolean(errors.address1)}
                    errorMessage={errors.address1?.message}
                >
                    <Controller
                        name="address3"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Address 3" // Updated placeholder
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                


            </div>






            <div className="flex items-end gap-4 w-full">
                <FormItem
                    invalid={
                        Boolean(errors.phoneNumber) || Boolean(errors.dialCode)
                    }
                >
                    <label className="form-label mb-2">Phone number</label>
                    <Controller
                        name="dialCode"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                options={dialCodeList}
                                {...field}
                                className="w-[150px]"
                                components={{
                                    Option: CustomSelectOption,
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={dialCodeList.filter(
                                    (option) => option.dialCode === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.dialCode)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    className="w-full"
                    invalid={
                        Boolean(errors.phoneNumber) || Boolean(errors.dialCode)
                    }
                    errorMessage={errors.phoneNumber?.message}
                >
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                autoComplete="off"
                                placeholder="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection

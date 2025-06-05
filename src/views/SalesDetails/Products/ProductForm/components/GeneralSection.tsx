import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'
import Select from '@/components/ui/Select'

type GeneralSectionProps = FormSectionBaseProps

const channelOptions = [
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'S', label: 'S' },
    { value: 'K', label: 'K' },
    { value: 'B', label: 'B' },
    { value: 'R', label: 'R' },
]

const subChannelOptions = [
    { value: 'SC1', label: 'Sub-channel 1' },
    { value: 'SC2', label: 'Sub-channel 2' },
    { value: 'SC3', label: 'Sub-channel 3' },
    // Add more sub-channel options as needed
]

const GeneralSection = ({ control, errors }: GeneralSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Basic Information</h4>
            <div>
                <FormItem
                    label="Product name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Product Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Product code"
                    invalid={Boolean(errors.productCode)}
                    errorMessage={errors.productCode?.message}
                >
                    <Controller
                        name="productCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Product Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="SAP code"
                    invalid={Boolean(errors.SAPcode)}
                    errorMessage={errors.SAPcode?.message}
                >
                    <Controller
                        name="SAPcode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="SAP Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
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
                                isMulti
                                placeholder="Select Channel(s)"
                                options={channelOptions}
                                value={channelOptions.filter(opt => Array.isArray(field.value) ? field.value.includes(opt.value) : false)}
                                onChange={options => field.onChange(options ? options.map(opt => opt.value) : [])}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Sub-channel"
                    invalid={Boolean(errors.subchannel)}
                    errorMessage={errors.subchannel?.message}
                >
                    <Controller
                        name="subchannel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti
                                placeholder="Select Sub-channel(s)"
                                options={subChannelOptions}
                                value={subChannelOptions.filter(opt => Array.isArray(field.value) ? field.value.includes(opt.value) : false)}
                                onChange={options => field.onChange(options ? options.map(opt => opt.value) : [])}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Description"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            content={field.value}
                            invalid={Boolean(errors.description)}
                            onChange={({ html }) => {
                                field.onChange(html)
                            }}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default GeneralSection
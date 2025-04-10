import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'

type GeneralSectionProps = FormSectionBaseProps

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
            </div>
         
        </Card>
    )
}

export default GeneralSection

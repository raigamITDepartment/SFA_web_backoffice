import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'

import Input from '@/components/ui/Input'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'

type PricingSectionProps = FormSectionBaseProps

const PricingSection = ({ control, errors }: PricingSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Pricing</h4>
            <div>
                <FormItem
                    label="Price"
                    invalid={Boolean(errors.price)}
                    errorMessage={errors.price?.message}
                >
                    <Controller
                        name="price"
                        control={control}
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
                    />
                </FormItem>
                <FormItem
                    label="Cost price"
                    invalid={Boolean(errors.costPerItem)}
                    errorMessage={errors.costPerItem?.message}
                >
                    <Controller
                        name="costPerItem"
                        control={control}
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
                    />
                </FormItem>

               





            </div>
            <div className="md:flex gap-4">
                
            </div>
        </Card>
    )
}

export default PricingSection

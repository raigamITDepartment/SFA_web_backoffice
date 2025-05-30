import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import type { FormSectionBaseProps } from '../types'

type GeneralSectionProps = FormSectionBaseProps & {
    name: string;
    productCode: string;
    onNameChange: (value: string) => void;
    onProductCodeChange: (value: string) => void;
}

const GeneralSection = ({ name, productCode, onNameChange, onProductCodeChange }: GeneralSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Basic Information</h4>
            <div>
                <FormItem label="Product name">
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                    />
                </FormItem>
                <FormItem label="Product code">
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Product Code"
                        value={productCode}
                        onChange={(e) => onProductCodeChange(e.target.value)}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default GeneralSection

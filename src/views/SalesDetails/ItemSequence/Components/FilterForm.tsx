import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormItem, Form, Select, Input, Button } from '@/components/ui';

const channelOptions = [
    { value: 'Channel 1', label: 'Channel 1' },
    { value: 'Channel 2', label: 'Channel 2' },
    { value: 'Channel 3', label: 'Channel 3' },
];

const subChannelOptions = [
    { value: 'SubChannel 1', label: 'SubChannel 1' },
    { value: 'SubChannel 2', label: 'SubChannel 2' },
    { value: 'SubChannel 3', label: 'SubChannel 3' },
];

type FilterFormValues = {
    itemName?: string;
    itemCode?: string;
    channel?: string;
    subChannel?: string;
};

interface FilterFormProps {
    onSubmit: (data: FilterFormValues) => void;
    onReset?: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            itemName: '',
            itemCode: '',
            channel: '',
            subChannel: '',
        },
        resolver: zodResolver(z.object({
            itemName: z.string().min(1, { message: 'Item Name is required' }).optional(),
            itemCode: z.string().min(1, { message: 'Item Code is required' }).optional(),
            channel: z.string().min(1, { message: 'Channel is required' }),
            subChannel: z.string().min(1, { message: 'Sub-channel is required' }),
        })),
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Item Name and Item Code */}
            <div className="flex flex-col sm:flex-row gap-6">
                <FormItem
                    label="Item Name"
                    invalid={Boolean(errors.itemName)}
                    errorMessage={errors.itemName?.message}
                    className="flex-1"
                >
                    <Controller
                        name="itemName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Item Name"
                                {...field}
                                className="w-full max-w-full sm:max-w-md"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Item Code"
                    invalid={Boolean(errors.itemCode)}
                    errorMessage={errors.itemCode?.message}
                    className="flex-1"
                >
                    <Controller
                        name="itemCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Item Code"
                                {...field}
                                className="w-full max-w-full sm:max-w-md"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Row 2: Channel and Sub-channel */}
            <div className="flex flex-col sm:flex-row gap-6">
                <FormItem
                    label="Channel"
                    invalid={Boolean(errors.channel)}
                    errorMessage={errors.channel?.message}
                    className="flex-1"
                >
                    <Controller
                        name="channel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={channelOptions}
                                {...field}
                                value={channelOptions.find(option => option.value === field.value)}
                                onChange={option => field.onChange(option?.value)}
                                className="w-full max-w-full sm:max-w-md"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Sub-channel"
                    invalid={Boolean(errors.subChannel)}
                    errorMessage={errors.subChannel?.message}
                    className="flex-1"
                >
                    <Controller
                        name="subChannel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={subChannelOptions}
                                {...field}
                                value={subChannelOptions.find(option => option.value === field.value)}
                                onChange={option => field.onChange(option?.value)}
                                className="w-full max-w-full sm:max-w-md"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Buttons row */}
            <FormItem className="flex flex-col sm:flex-row gap-4 justify-start">
                <Button
                    type="reset"
                    className="w-full sm:w-auto mr-2"
                    onClick={() => reset()}
                >
                    Reset
                </Button>
                <Button
                    variant="solid"
                    loading={isSubmitting}
                    type="submit"
                    className="w-full sm:w-auto"
                >
                    Submit
                </Button>
            </FormItem>
            
        </Form>
    );
};

export default FilterForm;
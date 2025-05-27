// FilterForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormItem,Form, Select, Input, Button } from '@/components/ui';

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
    channelId?: string;
    subChannelId?: string;
};

interface FilterFormProps {
    onSubmit: (data: FilterFormValues) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            itemName: '',
            itemCode: '',
            channelId: '',
            subChannelId: '',
        },
        resolver: zodResolver(z.object({
            itemName: z.string().optional(),
            itemCode: z.string().optional(),
            channelId: z.string().optional(),
            subChannelId: z.string().optional(),
        })),
    });


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
                label="Item Name"
                invalid={Boolean(errors.itemName)}
                errorMessage={errors.itemName?.message}
            >
                <Controller
                    name="itemName"
                    control={control}
                    render={({ field }) =>
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Item Name"
                            {...field}
                        />
                    }
                />
            </FormItem>
            <FormItem
                asterisk
                label="Item Code"
                invalid={Boolean(errors.itemCode)}
                errorMessage={errors.itemCode?.message}
            >
                <Controller
                    name="itemCode"
                    control={control}
                    render={({ field }) =>
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Item Code"
                            {...field}
                        />
                    }
                />
            </FormItem>
            <FormItem
                asterisk
                label="Channel ID"
                invalid={Boolean(errors.channelId)}
                errorMessage={errors.channelId?.message}
            >
                <Controller
                    name="channelId"
                    control={control}
                    render={({ field }) =>
                        <Select
                            options={channelOptions}
                            {...field}
                            value={channelOptions.find(option => option.value === field.value)}
                            onChange={option => field.onChange(option?.value)}
                        />
                    }
                />
            </FormItem>
            <FormItem
                asterisk
                label="Sub-channel ID"
                invalid={Boolean(errors.subChannelId)}
                errorMessage={errors.subChannelId?.message}
            >
                <Controller
                    name="subChannelId"
                    control={control}
                    render={({ field }) =>
                        <Select
                            options={subChannelOptions}
                            {...field}
                            value={subChannelOptions.find(option => option.value === field.value)}
                            onChange={option => field.onChange(option?.value)}
                        />
                    }
                />
            </FormItem>
            <FormItem>
                <Button
                    type="reset"
                    className="ltr:mr-2 rtl:ml-2"
                    onClick={() => reset()}
                >
                    Reset
                </Button>
                <Button variant="solid" loading={isSubmitting} type="submit">
                    Submit
                </Button>
            </FormItem>
        </Form>
    );
};


export default FilterForm;
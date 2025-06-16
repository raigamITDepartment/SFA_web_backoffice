import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormItem, Form, Select, Button, Card } from '@/components/ui';
import { useState } from 'react';
import { HiPlus, HiMinus } from 'react-icons/hi';

const itemNameOptions = [
    { value: 'Item 1', label: 'Item 1' },
    { value: 'Item 2', label: 'Item 2' },
    { value: 'Item 3', label: 'Item 3' },
];

const itemCodeOptions = [
    { value: 'Code 1', label: 'Code 1' },
    { value: 'Code 2', label: 'Code 2' },
    { value: 'Code 3', label: 'Code 3' },
];

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
    channels?: { channel: string; subChannel: string }[];
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
            channels: [{ channel: '', subChannel: '' }],
        },
        resolver: zodResolver(z.object({
            itemName: z.string().min(1, { message: 'Item Name is required' }).optional(),
            itemCode: z.string().min(1, { message: 'Item Code is required' }).optional(),
            channels: z.array(z.object({
                channel: z.string().min(1, { message: 'Channel is required' }),
                subChannel: z.string().min(1, { message: 'Sub-channel is required' }),
            })),
        })),
    });

    const [visibleRows, setVisibleRows] = useState([0]);

    const handleAddRow = () => {
        setVisibleRows(prev => [...prev, prev.length]);
    };

    const handleRemoveRow = (idx: number) => {
        setVisibleRows(prev => prev.length > 1 ? prev.filter(i => i !== idx) : prev);
    };

    return (
        <Card>
            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Row 1: Item Name and Item Code as dropdowns */}
                <div className="flex flex-col sm:flex-row gap-4">
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
                                <Select
                                    options={itemNameOptions}
                                    {...field}
                                    value={itemNameOptions.find(option => option.value === field.value)}
                                    onChange={option => field.onChange(option?.value)}
                                    className="w-full"
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
                                <Select
                                    options={itemCodeOptions}
                                    {...field}
                                    value={itemCodeOptions.find(option => option.value === field.value)}
                                    onChange={option => field.onChange(option?.value)}
                                    className="w-full"
                                />
                            )}
                        />
                    </FormItem>
                </div>

                {/* Row 2: Channels and Sub-channels */}
                <div className="flex flex-col gap-4">
                    {visibleRows.map((idx) => (
                        <div 
                            key={idx} 
                            className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
                        >
                            <FormItem
                                label="Channel"
                                invalid={Boolean(errors.channels?.[idx]?.channel)}
                                errorMessage={errors.channels?.[idx]?.channel?.message}
                                className="flex-1 w-full"
                            >
                                <Controller
                                    name={`channels.${idx}.channel`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            options={channelOptions}
                                            {...field}
                                            value={channelOptions.find(option => option.value === field.value)}
                                            onChange={option => field.onChange(option?.value)}
                                            className="w-full"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Sub-channel"
                                invalid={Boolean(errors.channels?.[idx]?.subChannel)}
                                errorMessage={errors.channels?.[idx]?.subChannel?.message}
                                className="flex-1 w-full"
                            >
                                <Controller
                                    name={`channels.${idx}.subChannel`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            options={subChannelOptions}
                                            {...field}
                                            value={subChannelOptions.find(option => option.value === field.value)}
                                            onChange={option => field.onChange(option?.value)}
                                            className="w-full"
                                        />
                                    )}
                                />
                            </FormItem>

                            <div className="mt-2 sm:mt-0 flex-shrink-0">
                                <button
                                    type="button"
                                    className="flex items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 shadow-sm transition w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleRemoveRow(idx)}
                                    disabled={visibleRows.length === 1}
                                    title="Remove row"
                                >
                                    <HiMinus className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="flex items-center gap-2 text-primary mb-8"
                        onClick={handleAddRow}
                    >
                        <HiPlus className="text-lg" />
                        <span>Add another</span>
                    </button>
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
        </Card>
    );
};

export default FilterForm;


import React from 'react';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';

export type FormSchema = {
    channel: string;
    subChannel: string;
    region: string;
    area: string;
    territory: string;
    route: string;
};

interface FilterFormProps {
    onSubmit: (data: FormSchema) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormSchema>({
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            territory: '',
            route: '',
        },
    });

    const internalSubmit = (data: FormSchema) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(internalSubmit)}>
            <h5 className="mb-4">Filter Options</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="channel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Channel"
                                options={[
                                    { label: 'National Channel', value: 'National Channel' } as any,
                                    { label: 'Bakery Channel', value: 'Bakery Channel' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Channel is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.channel && <span className="text-red-600">{errors.channel.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="subChannel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Sub-Channel"
                                options={[
                                    { label: 'Sub-Channel 1', value: 'Sub-Channel 1' } as any,
                                    { label: 'Sub-Channel 2', value: 'Sub-Channel 2' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Sub-Channel is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.subChannel && <span className="text-red-600">{errors.subChannel.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Region"
                                options={[
                                    { label: 'Region 1', value: 'Region 1' } as any,
                                    { label: 'Region 2', value: 'Region 2' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Region is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.region && <span className="text-red-600">{errors.region.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Area"
                                options={[
                                    { label: 'Area 1', value: 'Area 1' } as any,
                                    { label: 'Area 2', value: 'Area 2' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Area is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.area && <span className="text-red-600">{errors.area.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="territory"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Territory"
                                options={[
                                    { label: 'Territory 1', value: 'Territory 1' } as any,
                                    { label: 'Territory 2', value: 'Territory 2' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Territory is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.territory && <span className="text-red-600">{errors.territory.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="route"
                        control={control}
                        render={({ field }) => (
                            <Select
                                size="sm"
                                placeholder="Select Route"
                                options={[
                                    { label: 'Route 1', value: 'Route 1' } as any,
                                    { label: 'Route 2', value: 'Route 2' },
                                ]}
                                value={field.value}
                                onChange={(selectedOption) => field.onChange(selectedOption)}
                            />
                        )}
                        rules={{
                            validate: {
                                required: (value) => {
                                    if (!value) return 'Route is required';
                                    return;
                                }
                            }
                        }}
                    />
                    {errors.route && <span className="text-red-600">{errors.route.message}</span>}
                </div>
            </div>
            <div className="mt-6 flex justify-start sm:justify-start">
                <Button type="submit" variant="solid" className="w-full sm:w-auto">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default FilterForm;
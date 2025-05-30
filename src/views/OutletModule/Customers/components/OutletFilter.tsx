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

interface Option {
    label: string;
    value: string;
}

interface OutletFilterProps {
    channelOptions?: Option[];
    subChannelOptions?: Option[];
    regionOptions?: Option[];
    areaOptions?: Option[];
    territoryOptions?: Option[];
    routeOptions?: Option[];
    onSubmit: (data: FormSchema) => void;
}

const OutletFilter: React.FC<OutletFilterProps> = ({
    channelOptions = [],
    subChannelOptions = [],
    regionOptions = [],
    areaOptions = [],
    territoryOptions = [],
    routeOptions = [],
    onSubmit,
}) => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormSchema>();

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
                        rules={{ required: 'Channel is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Channel"
                                options={channelOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
                    />
                    {errors.channel && <span className="text-red-600">{errors.channel.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="subChannel"
                        control={control}
                        rules={{ required: 'Sub-Channel is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Sub-Channel"
                                options={subChannelOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
                    />
                    {errors.subChannel && <span className="text-red-600">{errors.subChannel.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="region"
                        control={control}
                        rules={{ required: 'Region is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Region"
                                options={regionOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
                    />
                    {errors.region && <span className="text-red-600">{errors.region.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="area"
                        control={control}
                        rules={{ required: 'Area is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Area"
                                options={areaOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
                    />
                    {errors.area && <span className="text-red-600">{errors.area.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="territory"
                        control={control}
                        rules={{ required: 'Territory is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Territory"
                                options={territoryOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
                    />
                    {errors.territory && <span className="text-red-600">{errors.territory.message}</span>}
                </div>
                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                    <Controller
                        name="route"
                        control={control}
                        rules={{ required: 'Route is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="sm"
                                placeholder="Select Route"
                                options={routeOptions as { label: string; value: string }[]} // Cast to expected type
                            />
                        )}
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

export default OutletFilter;

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, toast, Alert } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'

type FormSchema = {
    channel: string;
    subChannel: string;
    region: string;
    area: string;
    range: string;
    territoryName: string;
    isActive: boolean;
    targetValue?: string;
    dateRange?: [Date | null, Date | null];
}

const { DatePickerRange } = DatePicker

const TerritoryWiseEdit = () => {
    const [successDialog, setSuccessDialog] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            range: '',
            territoryName: '',
            isActive: true,
            targetValue: '',
            dateRange: [null, null],
        },
    });

    const onSubmit = (values: FormSchema) => {
        // Handle update logic here
        setSuccessDialog(true);
        toast.push(
            <Alert
                showIcon
                type="warning"
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
            >
                Territory target for <b>{values.territoryName || 'selected territory'}</b> updated!
            </Alert>,
            {
                offsetX: 5,
                offsetY: 100,
                transitionType: 'fade',
                block: false,
                placement: 'top-end',
            }
        );
    }

    const handleSuccessDialogClose = () => {
        setSuccessDialog(false);
    };

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <Card bordered={false} className='w-full h-1/2'>
                    <h5 className='mb-2'>Edit Territory Wise Target</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <FormItem
                                invalid={Boolean(errors.channel)}
                                errorMessage={errors.channel?.message}
                            >
                                <Controller
                                    name="channel"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Channel"
                                            options={[
                                                { label: 'National Channel', value: 'National Channel' } as any,
                                                { label: 'Bakery Channel', value: 'Bakery Channel' },
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
                            <FormItem
                                invalid={Boolean(errors.subChannel)}
                                errorMessage={errors.subChannel?.message}
                            >
                                <Controller
                                    name="subChannel"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Sub-Channel"
                                            options={[
                                                { label: 'Sub-Channel 1', value: 'Sub-Channel 1' } as any,
                                                { label: 'Sub-Channel 2', value: 'Sub-Channel 2' },
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
                            <FormItem
                                invalid={Boolean(errors.region)}
                                errorMessage={errors.region?.message}
                            >
                                <Controller
                                    name="region"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Region"
                                            options={[
                                                { label: 'Region 1', value: 'Region 1' } as any,
                                                { label: 'Region 2', value: 'Region 2' },
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
                            <FormItem
                                invalid={Boolean(errors.area)}
                                errorMessage={errors.area?.message}
                            >
                                <Controller
                                    name="area"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Area"
                                            options={[
                                                { label: 'Area 1', value: 'Area 1' } as any,
                                                { label: 'Area 2', value: 'Area 2' },
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
                            <FormItem
                                invalid={Boolean(errors.range)}
                                errorMessage={errors.range?.message}
                            >
                                <Controller
                                    name="range"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="md"
                                            placeholder="Select Range"
                                            options={[
                                                { label: 'Range 1', value: 'Range 1' } as any,
                                                { label: 'Range 2', value: 'Range 2' },
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
                        <FormItem>
                            <span className="font-bold ">Territory List:</span>
                            <div className="flex items-center gap-4 mt-6">
                                <FormItem className="mb-0">
                                    <Controller
                                        name="territoryName"
                                        control={control}
                                        render={({ field }) =>
                                            <Input
                                                disabled
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Territory Name"
                                                {...field}
                                            />
                                        }
                                    />
                                </FormItem>
                                <FormItem className="mb-0">
                                    <Controller
                                        name="targetValue"
                                        control={control}
                                        render={({ field }) =>
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Target Value"
                                                {...field}
                                            />
                                        }
                                    />
                                </FormItem>
                                <FormItem className="mb-0">
                                    <Controller
                                        name="dateRange"
                                        control={control}
                                        render={({ field }) =>
                                            <DatePickerRange
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select dates range"
                                            />
                                        }
                                    />
                                </FormItem>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="lg:w-25 xl:w-25 sm:w-full text-red-600 border-red-600 border-2 hover:border-3 hover:border-red-400 hover:ring-0 hover:text-red-600 hover:text-sm"
                                    onClick={() => {
                                        setValue('targetValue', '');
                                        setValue('dateRange', [null, null]);
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </FormItem>
                        <FormItem>
                            <div className="flex justify-center gap-4">
                                <Button
                                    className="lg:w-70 xl:w-70 sm:w-full"
                                    variant="solid"
                                    block
                                    type="submit"
                                >
                                    Update
                                </Button>
                                <Button
                                    className="lg:w-70 xl:w-70 sm:w-full text-red-600 border-red-600 border-2 hover:border-3 hover:border-red-400 hover:ring-0 hover:text-red-600 hover:text-sm"
                                    type="button"
                                    block
                                    clickFeedback={false}
                                    onClick={() => {
                                        reset();
                                    }}
                                >
                                    Discard
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </Card>

                {/* Success Dialog for Update */}
                <Dialog
                    isOpen={successDialog}
                    onClose={handleSuccessDialogClose}
                    onRequestClose={handleSuccessDialogClose}
                >
                    <div className="flex flex-col items-center justify-center py-6">
                        <HiCheckCircle className="text-4xl text-emerald-500 mb-2" />
                        <div className="font-semibold text-lg mb-2">Territory targtes Updated!</div>
                        <div className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                            The territory targets have been successfully updated.
                        </div>
                        <Button
                            variant="solid"
                            onClick={handleSuccessDialogClose}
                        >
                            OK
                        </Button>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default TerritoryWiseEdit
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import { useParams } from 'react-router-dom'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'

type FormSchema = {
    distributorName: string;
    agencyName: string;
    isActive: boolean;
}

function DistributorAgencyEdit() {
    const { id } = useParams();
    const [successDialog, setSuccessDialog] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            distributorName: '',
            agencyName: '',
            isActive: true,
        },
    })

    // Example: Fetch and set data by id (replace with your actual fetch logic)
    useEffect(() => {
        if (id) {
            // Simulate fetch
            // Replace with your API call
            const fetchData = async () => {
                // Example: fetched data
                const fetched = {
                    distributorName: 'Distributor 1',
                    agencyName: 'Agency 2',
                    isActive: true,
                }
                reset(fetched)
            }
            fetchData()
        }
    }, [id, reset])

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500))
        setSuccessDialog(true)
        reset(values)
    }

    const handleSuccessDialogClose = () => {
        setSuccessDialog(false);
        toast.push(
            <Alert
                showIcon
                type="warning"
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
            >
                Mapping updated!...
            </Alert>,
            {
                offsetX: 5,
                offsetY: 100,
                transitionType: 'fade',
                block: false,
                placement: 'top-end',
            }
        );
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card bordered={false} className='w-full max-w-lg'>
                <h5 className='mb-2'>Edit Distributor Agency Mapping</h5>
                <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        invalid={Boolean(errors.distributorName)}
                        errorMessage={errors.distributorName?.message}
                    >
                        <Controller
                            name="distributorName"
                            control={control}
                            render={({ field }) =>
                                <Select
                                    size="sm"
                                    placeholder="Select Distributor"
                                    options={[
                                        { label: 'Distributor 1', value: 'Distributor 1' },
                                        { label: 'Distributor 2', value: 'Distributor 2' },
                                        { label: 'Distributor 3', value: 'Distributor 3' },
                                        { label: 'Distributor 4', value: 'Distributor 4' },
                                        { label: 'Distributor 5', value: 'Distributor 5' },
                                    ]}
                                    value={
                                        [
                                            { label: 'Distributor 1', value: 'Distributor 1' },
                                            { label: 'Distributor 2', value: 'Distributor 2' },
                                            { label: 'Distributor 3', value: 'Distributor 3' },
                                            { label: 'Distributor 4', value: 'Distributor 4' },
                                            { label: 'Distributor 5', value: 'Distributor 5' },
                                        ].find(option => option.value === field.value) || null
                                    }
                                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
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
                        invalid={Boolean(errors.agencyName)}
                        errorMessage={errors.agencyName?.message}
                    >
                        <Controller
                            name="agencyName"
                            control={control}
                            render={({ field }) =>
                                <Select<{ label: string; value: string }>
                                    size="sm"
                                    placeholder="Select Agency"
                                    options={[
                                        { label: 'Agency 1', value: 'Agency 1' },
                                        { label: 'Agency 2', value: 'Agency 2' },
                                        { label: 'Agency 3', value: 'Agency 3' },
                                        { label: 'Agency 4', value: 'Agency 4' },
                                        { label: 'Agency 5', value: 'Agency 5' },
                                    ]}
                                    value={
                                        [
                                            { label: 'Agency 1', value: 'Agency 1' },
                                            { label: 'Agency 2', value: 'Agency 2' },
                                            { label: 'Agency 3', value: 'Agency 3' },
                                            { label: 'Agency 4', value: 'Agency 4' },
                                            { label: 'Agency 5', value: 'Agency 5' },
                                        ].find(option => option.value === field.value) || null
                                    }
                                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
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
                    <FormItem>
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) =>
                                <Checkbox {...field} checked={field.value}>
                                    IsActive
                                </Checkbox>
                            }
                        />
                    </FormItem>
                    <FormItem>
                        <Button variant="solid" block type="submit">Update</Button>
                    </FormItem>
                </Form>
            </Card>
            <Dialog isOpen={successDialog} onClose={handleSuccessDialogClose}>
                <div className="flex flex-col items-center p-6">
                    <HiCheckCircle className="text-green-500 mb-2" size={48} />
                    <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                        Mapping updated successfully!
                    </div>
                    <Button className="mt-6" variant="solid" onClick={handleSuccessDialogClose}>
                        OK
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default DistributorAgencyEdit
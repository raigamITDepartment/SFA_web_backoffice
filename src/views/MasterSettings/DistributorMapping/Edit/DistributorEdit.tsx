import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
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
    address1: string;
    address2: string;
    address3: string;
    mobile: string;
    email: string;
    isActive: boolean;
}

function DistributorEdit() {
    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            distributorName: '',
            address1: '',
            address2: '',
            address3: '',
            mobile: '',
            email: '',
            isActive: true,
        },
    })

    const { id } = useParams();
    const [successDialog, setSuccessDialog] = useState(false);

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500));
        setSuccessDialog(true);
        reset(values);
    }

    const handleSuccessDialogClose = () => {
        setSuccessDialog(false);
        toast.push(
            <Alert
                showIcon
                type="warning"
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
            >
                Distributor updating...
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
                <h5 className='mb-2'>Edit Distributor</h5>
                <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        invalid={Boolean(errors.distributorName)}
                        errorMessage={errors.distributorName?.message}
                    >
                        <Controller
                            name="distributorName"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Distributor Name"
                                    {...field}
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
                        invalid={Boolean(errors.address1)}
                        errorMessage={errors.address1?.message}
                    >
                        <Controller
                            name="address1"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Address 1"
                                    {...field}
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
                        invalid={Boolean(errors.address2)}
                        errorMessage={errors.address2?.message}
                    >
                        <Controller
                            name="address2"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Address 2"
                                    {...field}
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
                        invalid={Boolean(errors.address3)}
                        errorMessage={errors.address3?.message}
                    >
                        <Controller
                            name="address3"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Address 3"
                                    {...field}
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
                        invalid={Boolean(errors.mobile)}
                        errorMessage={errors.mobile?.message}
                    >
                        <Controller
                            name="mobile"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Mobile"
                                    {...field}
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
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) =>
                                <Input
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Email"
                                    {...field}
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
                        Distributor updated successfully!
                    </div>
                    <Button className="mt-6" variant="solid" onClick={handleSuccessDialogClose}>
                        OK
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default DistributorEdit
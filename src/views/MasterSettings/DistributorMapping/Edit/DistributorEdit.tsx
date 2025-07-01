import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import { useParams } from 'react-router-dom'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'
import { getDistributorById, updateDistributor } from '@/services/DemarcationService'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'


export type UpdateDistributorFormSchema = {
    userId: number;
    distributorName: string;
    email: string;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    mobileNo: string;
    isActive: boolean;
};

const validationSchema: ZodType<UpdateDistributorFormSchema> = z.object({
    userId: z.number(),
    distributorName: z.string().min(1, 'Distributor name is required'),
    email: z.string().email('Invalid email address'),
    address1: z.string().nullable().optional(),
    address2: z.string().nullable().optional(),
    address3: z.string().nullable().optional(),
    mobileNo: z.string().min(1, 'Mobile number is required'),
    isActive: z.boolean(),
});

function DistributorEdit(props: UpdateDistributorFormSchema) {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [distributorData, setDistributorData] = useState<any[]>([])
    const { disableSubmit = false, className, setMessage } = props
    const [successDialog, setSuccessDialog] = useState(false);

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }
        if (!id) {
            setMessage?.('No user ID found.');
            return;
        }

        const loadDistributorDetails = async () => {
            try {
                const distributorDetails = await getDistributorById(id);
                setDistributorData(distributorDetails);

                reset({
                    id: distributorDetails.id,
                    userId: distributorDetails.userId,
                    distributorName: distributorDetails.distributorName,
                    email: distributorDetails.email,
                    address1: distributorDetails.address1,
                    address2: distributorDetails.address2,
                    address3: distributorDetails.address3,
                    mobileNo: distributorDetails.mobileNo,
                    telNo: distributorDetails.telNo,
                    isActive: distributorDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load distributor data.');
            }
        };


        loadDistributorDetails()
    }, [token, id, setMessage]);

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<UpdateDistributorFormSchema>({
        defaultValues: {
            userId: userIdNumber,
            distributorName: '',
            email: '',
            address1: '',
            address2: '',
            address3: '',
            mobileNo: '',
            isActive: true,
        },
    })

   const onSubmit = async (values: UpdateDistributorFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: id,
                userId: userIdNumber,
                distributorName: values.distributorName,
                email: values.email,
                address1: values.address1,
                address2: values.address2,
                address3: values.address3,
                mobileNo: values.mobileNo,
                isActive: values.isActive,
            };

            await updateDistributor(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Distributor updated successfully!
                    </div>
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            );
            reset();
            navigate(-1);
        } catch (error: any) {
            console.error('Failed to update Distributor:', error);
            setMessage?.(error.message || 'Failed to update Distributor');
        }
    };

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
                        />
                    </FormItem>

                    <FormItem
                        invalid={Boolean(errors.mobileNo)}
                        errorMessage={errors.mobileNo?.message}
                    >
                        <Controller
                            name="mobileNo"
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

export default DistributorEdit;

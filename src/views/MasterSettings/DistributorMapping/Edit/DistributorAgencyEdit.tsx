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
import { findAgencyDistributorById, distributorOptions, updateDistributorAgency } from '@/services/DemarcationService'
import {fetchAgencies} from '@/services/singupDropdownService'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'

type FormSchema = {
    distributorName: string;
    agencyName: string;
    isActive: boolean;
}
export type UpdateDistributorAgencyFormSchema = {
    userId: number;
    agencyId: number[]; 
    distributorId: number | null;
    agencyCode:number | null;
    isActive: boolean;
};


const validationSchema: ZodType<UpdateDistributorAgencyFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'),
    agencyId: z.array(z.number()).min(1, 'Please select at least one agency'),
    distributorId: z.number({ required_error: 'Please select distributor' }).nullable(),
    agencyCode: z.number({ required_error: 'Please add agency code' }).nullable(),
    isActive: z.boolean(),
});

function DistributorAgencyEdit(props: UpdateDistributorAgencyFormSchema) {
    const { id } = useParams();
    const navigate = useNavigate()
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [distributorData, setDistributorData] = useState<any[]>([])
    const [agency, setAgency] = useState<any>([])
    const [distributor, setDistributor] = useState<any>([])
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
                const distributorDetails = await findAgencyDistributorById(id);
                setDistributorData(distributorDetails);

                reset({
                    id: distributorDetails.id,
                    userId: distributorDetails.userId,
                    distributorId: distributorDetails.distributorId,
                    agencyId: distributorDetails.agencyId,
                    agencyCode: distributorDetails.agencyCode,
                    isActive: distributorDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load distributor data.');
            }
        };


        loadDistributorDetails()
    }, [token, id, setMessage]);

    useEffect(() => {
            const loadAgencies = async () => {
                try {
                    const agencyOptions = await fetchAgencies()
                    setAgency(agencyOptions)
                } catch (error) {
                    setMessage?.('Failed to load channels.')
                }
            }
            loadAgencies()
    }, [setMessage]);

    useEffect(() => {
            const loadDistributors = async () => {
                try {
                    const distributorOption = await distributorOptions()
                    setDistributor(distributorOption)
                } catch (error) {
                    setMessage?.('Failed to load channels.')
                }
            }
            loadDistributors()
    }, [setMessage])

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<UpdateDistributorAgencyFormSchema>({
        defaultValues: {
            userId: userIdNumber,
            agencyId: [], 
            distributorId: null,
            agencyCode:1,
            isActive: true,
        },
    })

   const onSubmit = async (values: UpdateDistributorAgencyFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: id,
                userId: userIdNumber,
                agencyId: values.agencyId,
                distributorId: values.distributorId,
                agencyCode: 1,
                isActive: values.isActive,
            };

            await updateDistributorAgency(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Distributor-Agency updated successfully!
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
            console.error('Failed to update Distributor-Agency:', error);
            setMessage?.(error.message || 'Failed to update Distributor-Agency');
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
                        invalid={Boolean(errors.distributorId)}
                        errorMessage={errors.distributorId?.message}
                    >
                        <Controller
                            name="distributorId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Select Distributor"
                                    options={distributor}
                                    value={distributor.find(option => option.value === field.value) || null}
                                    onChange={(option) => field.onChange(option?.value ?? null)}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Select Agency"
                        invalid={Boolean(errors.agencyId)}
                        errorMessage={errors.agencyId?.message}
                        style={{ flex: 1, marginLeft: '10px' }}
                    >
                        <Controller
                            name="agencyId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    className="mb-4"
                                    placeholder="Please Select agency"
                                    options={agency}
                                    value={agency.find(
                                        (option: { value: number }) =>
                                            option.value ===
                                            Number(field.value),
                                    )}
                                    onChange={(
                                        option: {
                                            label: string
                                            value: number
                                        } | null,
                                    ) => field.onChange(option?.value)}
                                />
                            )}
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
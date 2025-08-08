import React, { useEffect } from 'react'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import { Button, Alert, toast } from '@/components/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import {

    updateSubCategory,
    type UpdateSubCategoryPayload,
} from '@/services/CategoryServices'

type FormSchema = {
    SubCategoryName: string
    isActive: boolean
    Sequence?: number | string
}

const SubCategoryEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        id,
        MainCategoryName,
        MainCatId,
        subCatOneName,
        SubcatTypeId,
        isActive,
    } = location.state || {}

    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId')
    const userIdNumber = Number(userId)

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            SubCategoryName: subCatOneName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            Sequence: SubcatTypeId || '',
        },
    })

    useEffect(() => {
        reset({
            SubCategoryName: subCatOneName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            Sequence: SubcatTypeId || '',
        })
    }, [subCatOneName, SubcatTypeId, isActive, reset])

    const onSubmit = async (values: FormSchema) => {
        if (!token) {
            toast.push(
                <Alert type="danger" showIcon>
                    Auth token not found.
                </Alert>,
            )
            return
        }

        try {
            const payload : UpdateSubCategoryPayload = {
                id: String(id),
                userId: userIdNumber,
                mainCatId: Number(MainCatId),
                subCatSeq: Number(values.Sequence),
                subCatOneName: values.SubCategoryName,
                isActive: values.isActive,
            }

            await updateSubCategory(payload, token)

            toast.push(
                <Alert
                    type="success"
                    showIcon
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                >
                    <div className="mt-2 text-green-600 font-semibold text-lg text-center">
                        Sub Category updated successfully!
                    </div>
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 30,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            )
            navigate(-1)
        } catch (error: any) {
            toast.push(
                <Alert type="danger" showIcon>
                    {error?.response?.data?.message ||
                        'Failed to update Sub Category'}
                </Alert>,
            )
        }
    }

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div className="flex justify-center mt-8">
            <Card bordered={false} className="w-full max-w-lg">
                <h5 className="mb-2">
                    Sub Category Edit {id ? `(ID: ${id})` : ''}
                </h5>
                <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                    {/* Display Main Category as read-only */}
                    <FormItem label="Main Category">
                        <Input value={MainCategoryName} readOnly />
                    </FormItem>

                    {/* Sub Category Name */}
                    <FormItem
                        invalid={Boolean(errors.SubCategoryName)}
                        errorMessage={errors.SubCategoryName?.message}
                    >
                        <Controller
                            name="SubCategoryName"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Sub Category Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* Sequence */}
                    <FormItem
                        invalid={Boolean(errors.Sequence)}
                        errorMessage={errors.Sequence?.message}
                    >
                        <Controller
                            name="Sequence"
                            control={control}
                            rules={{
                                required: 'Required',
                                min: { value: 1, message: 'Must be ≥ 1' },
                            }}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Sequence"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </FormItem>

                    {/* IsActive */}
                    <FormItem>
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Checkbox {...field} checked={field.value}>
                                    IsActive
                                </Checkbox>
                            )}
                        />
                    </FormItem>

                    {/* Action Buttons */}
                    <FormItem>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                style={{ width: '50%' }}
                            >
                                {isSubmitting
                                    ? 'Updating...'
                                    : 'Update Sub Category'}
                            </Button>
                            <Button
                                type="button"
                                className="w-1/2 py-2 border-2 border-red-500 text-red-600 rounded-lg bg-white font-medium transition-all duration-100 ease-in-out hover:bg-red-500 hover:text-white hover:shadow-lg"
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </Card>
        </div>
    )
}

export default SubCategoryEdit

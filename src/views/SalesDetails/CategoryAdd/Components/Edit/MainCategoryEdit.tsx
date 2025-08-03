import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import { Button, Alert, toast } from '@/components/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    fetchCategories,
    updateMainCategory,
    type UpdateMainCategoryPayload,
} from '@/services/CategoryServices'


type FormSchema = {
    MainCategoryName: string
    isActive: boolean
    catTypeId?: number | null
    Sequence?: number | string
}

const MainCategoryEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id, MainCategoryName, catTypeId, isActive, mainCatSeq } =
        location.state || {}
    const [categoryTypeOptions, setCategoryTypeOptions] = useState<
        { label: string; value: number }[]
    >([])

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
            MainCategoryName: MainCategoryName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            catTypeId: catTypeId || null,

            Sequence: mainCatSeq || '', // Assuming mainCatSeq is used for Sequence
        },
    })

    useEffect(() => {
        const loadCategoryTypes = async () => {
            try {
                const categoryData = await fetchCategories()
                const options = categoryData.map((category: any) => ({
                    label: category.categoryType,
                    value: category.id,
                }))
                setCategoryTypeOptions(options)
            } catch (error) {
                console.error('Failed to load category types:', error)
            }
        }
        loadCategoryTypes()
    }, [])

    useEffect(() => {
        reset({
            MainCategoryName: MainCategoryName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            catTypeId: catTypeId || null,
            Sequence: mainCatSeq || '',
        })
    }, [MainCategoryName, catTypeId, isActive, mainCatSeq, reset])

    const onSubmit = async (values: FormSchema) => {
        if (!token) {
            toast.push(
                <Alert type="danger" showIcon>
                    Auth token not found.
                </Alert>,
            )
            return
        }
        console.log('Submitting form with values:', values, 'and id:', id)
        try {
            const payload: UpdateMainCategoryPayload = {
                id: String(id),
                userId: userIdNumber,
                itemMainCat: values.MainCategoryName,
                catTypeId: values.catTypeId,
                mainCatSeq: String(values.Sequence),
                isActive: values.isActive,
            }

            await updateMainCategory(payload, token)
            console.log('Main Category updated successfully:', payload)
            toast.push(
                <Alert
                    type="success"
                    showIcon
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                >
                    <div className="mt-2 text-green-600 font-semibold text-lg text-center">
                        Main Category updated successfully!
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
                        'Failed to update Main Category'}
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
                    Category Edit {id ? `(ID: ${id})` : ''}
                </h5>
                <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        invalid={Boolean(errors.MainCategoryName)}
                        errorMessage={errors.MainCategoryName?.message}
                    >
                        <Controller
                            name="MainCategoryName"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Category Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.catTypeId)}
                        errorMessage={errors.catTypeId?.message}
                    >
                        <Controller
                            name="catTypeId"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Select Category Type"
                                    options={categoryTypeOptions}
                                    value={
                                        categoryTypeOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) || null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value ?? null)
                                    }
                                />
                            )}
                        />
                    </FormItem>

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
                                />
                            )}
                        />
                    </FormItem>

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

                    <FormItem>
                        <FormItem>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 16,
                                    marginTop: 24,
                                }}
                            >
                                <Button
                                    block
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    style={{ width: '50%' }}
                                >
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update Main Category'}
                                </Button>
                                <Button
                                    type="button"
                                    className="w-1/2 py-2 border-2 border-red-500 text-red-600 rounded-lg bg-white font-medium
                                                                                       transition-all duration-100 ease-in-out
                                                                                       hover:bg-red-500 hover:text-white hover:shadow-lg "
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                            </div>
                        </FormItem>
                    </FormItem>
                </Form>
            </Card>
        </div>
    )
}

export default MainCategoryEdit

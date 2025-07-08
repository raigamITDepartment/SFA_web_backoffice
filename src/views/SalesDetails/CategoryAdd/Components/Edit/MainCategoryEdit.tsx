import React, { useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { useForm, Controller } from 'react-hook-form';
import { FormItem, Form } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import { Button } from '@/components/ui';
import { useLocation } from 'react-router-dom';

type FormSchema = {
    MainCategoryName: string;
    isActive: boolean;
    CategoryType?: string;
};

const MainCategoryEdit = () => {
    const location = useLocation();
    const { id, MainCategoryName, CategoryType, isActive } = location.state || {};

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            MainCategoryName: MainCategoryName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            CategoryType: CategoryType || '',
        },
    });

    
    useEffect(() => {
        reset({
            MainCategoryName: MainCategoryName || '',
            isActive: typeof isActive === 'boolean' ? isActive : true,
            CategoryType: CategoryType || '',
        });
    }, [MainCategoryName, CategoryType, isActive, reset]);

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify({ id, ...values }, null, 2));
    };

    return (
        <div className='flex justify-center mt-8'>
            <Card bordered={false} className='w-full max-w-lg'>
                <h5 className='mb-2'>Category Edit {id ? `(ID: ${id})` : ''}</h5>
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
                        invalid={Boolean(errors.CategoryType)}
                        errorMessage={errors.CategoryType?.message}
                    >
                        <Controller
                            name="CategoryType"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) => (
                                <Select
                                    size="md"
                                    placeholder="Category Type"
                                    options={[
                                        { label: 'Type 1', value: 'Type 1' } as any,
                                        { label: 'Type 2', value: 'Type 2' },
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
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
        </div>
    );
};

export default MainCategoryEdit;
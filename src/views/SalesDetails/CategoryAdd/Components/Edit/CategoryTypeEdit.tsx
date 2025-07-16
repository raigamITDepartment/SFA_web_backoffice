import React, { useEffect } from 'react'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { Form, FormItem } from '@/components/ui/Form'
import { Button } from '@/components/ui'
import { useLocation } from 'react-router-dom'

type FormSchema = {
  CategoryTypeName: string
  Sequence: number | string
}

const CategoryTypeEdit = () => {
  const location = useLocation()
  const { id, CategoryTypeName, Sequence } = location.state || {}

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    defaultValues: {
      CategoryTypeName: CategoryTypeName || '',
      Sequence: Sequence ?? '',
    },
  })

  /* When the location state changes (e.g., page refresh) keep form synced */
  useEffect(() => {
    reset({
      CategoryTypeName: CategoryTypeName || '',
      Sequence: Sequence ?? '',
    })
  }, [CategoryTypeName, Sequence, reset])

  const onSubmit = async (values: FormSchema) => {
    await new Promise((r) => setTimeout(r, 500))
    alert(JSON.stringify({ id, ...values }, null, 2))
  }

  return (
    <div className="flex justify-center mt-8">
      <Card bordered={false} className="w-full max-w-lg">
        <h5 className="mb-2">
          Category Type Edit
        </h5>

        <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
          {/* Category Type Name */}
          <FormItem
            invalid={Boolean(errors.CategoryTypeName)}
            errorMessage={errors.CategoryTypeName?.message}
          >
            <Controller
            
              name="CategoryTypeName"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Category Type Name"
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
                />
              )}
            />
          </FormItem>

          {/* Submit */}
          <FormItem>
            <Button variant="solid" block type="submit">
              Update
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}

export default CategoryTypeEdit

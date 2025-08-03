import React, { useState } from 'react'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Alert, toast } from '@/components/ui'
import Card from '@/components/ui/Card'
import { Controller, useForm } from 'react-hook-form'
import { Form, FormItem } from '@/components/ui/Form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type FormValues = {
    channel: string
    subchannel: string
    region: string
    area: string
    territory: string
    quota: string
}

const schema = z.object({
    channel: z.string().min(1, { message: 'Channel is required' }),
    subchannel: z.string().min(1, { message: 'Sub Channel is required' }),
    region: z.string().min(1, { message: 'Region is required' }),
    area: z.string().min(1, { message: 'Area is required' }),
    territory: z.string().min(1, { message: 'Territory is required' }),
    quota: z.string().min(1, { message: 'Quota is required' }).refine(
        val => {
            const asNum = Number(val)
            return !isNaN(asNum) && asNum > 0
        },
        { message: 'Quota must be a positive number' }
    ),
})

const channelOptions = [
    { label: 'Channel 1', value: 'channel1' },
    { label: 'Channel 2', value: 'channel2' },
]
const subChannelOptions = [
    { label: 'Sub 1', value: 'sub1' },
    { label: 'Sub 2', value: 'sub2' },
]
const regionOptions = [
    { label: 'Western', value: 'western' },
    { label: 'Central', value: 'central' },
]
const areaOptions = [
    { label: 'Area 1', value: 'area1' },
    { label: 'Area 2', value: 'area2' },
]
const territoryOptions = [
    { label: 'Territory A', value: 'territoryA' },
    { label: 'Territory B', value: 'territoryB' },
]

const agencyName = 'ABC DISTRIBUTORS'

const ManualBillQuota: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pendingValues, setPendingValues] = useState<FormValues | null>(null)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            channel: '',
            subchannel: '',
            region: '',
            area: '',
            territory: '',
            quota: '',
        },
    })

    const onPreSubmit = (values: FormValues) => {
        setPendingValues(values)
        setDialogOpen(true)
    }

    const onConfirm = () => {
        setDialogOpen(false)
        toast.push(
            <Alert
                showIcon
                type="success"
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
            >
                <div className="mt-2 text-green-700 font-semibold text-md text-center">
                    Manual Bill Quota submitted successfully!
                </div>
            </Alert>,
            {
                offsetX: 5,
                offsetY: 40,
                transitionType: 'fade',
                block: false,
                placement: 'top-end',
            }
        )
        reset()
        setPendingValues(null)
    }

    return (
        <Form
            onSubmit={handleSubmit(onPreSubmit)}
            className="w-full max-w-3xl mx-auto mt-10"
            size="sm"
        >


            <div className="flex flex-col gap-6">
                {/* FILTERS CARD */}
                <Card className="w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                        Manual Bill Quota
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                        <FormItem invalid={!!errors.channel} errorMessage={errors.channel?.message}>
                            <label htmlFor="channel" className="text-sm font-semibold text-gray-600 dark:text-gray-300">Channel</label>
                            <Controller
                                name="channel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="channel"
                                        options={channelOptions}
                                        placeholder="Select Channel"
                                        isClearable
                                        value={channelOptions.find(option => option.value === field.value) || null}
                                        onChange={option => field.onChange(option?.value ?? '')}
                                        className={errors.channel ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem invalid={!!errors.subchannel} errorMessage={errors.subchannel?.message}>
                            <label htmlFor="subchannel" className="text-sm font-semibold text-gray-600 dark:text-gray-300">Sub Channel</label>
                            <Controller
                                name="subchannel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="subchannel"
                                        options={subChannelOptions}
                                        placeholder="Select Sub Channel"
                                        isClearable
                                        value={subChannelOptions.find(option => option.value === field.value) || null}
                                        onChange={option => field.onChange(option?.value ?? '')}
                                        className={errors.subchannel ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem invalid={!!errors.region} errorMessage={errors.region?.message}>
                            <label htmlFor="region" className="text-sm font-semibold text-gray-600 dark:text-gray-300">Region</label>
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="region"
                                        options={regionOptions}
                                        placeholder="Select Region"
                                        isClearable
                                        value={regionOptions.find(option => option.value === field.value) || null}
                                        onChange={option => field.onChange(option?.value ?? '')}
                                        className={errors.region ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem invalid={!!errors.area} errorMessage={errors.area?.message}>
                            <label htmlFor="area" className="text-sm font-semibold text-gray-600 dark:text-gray-300">Area</label>
                            <Controller
                                name="area"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="area"
                                        options={areaOptions}
                                        placeholder="Select Area"
                                        isClearable
                                        value={areaOptions.find(option => option.value === field.value) || null}
                                        onChange={option => field.onChange(option?.value ?? '')}
                                        className={errors.area ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem invalid={!!errors.territory} errorMessage={errors.territory?.message}>
                            <label htmlFor="territory" className="text-sm font-semibold text-gray-600 dark:text-gray-300">Territory</label>
                            <Controller
                                name="territory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="territory"
                                        options={territoryOptions}
                                        placeholder="Select Territory"
                                        isClearable
                                        value={territoryOptions.find(option => option.value === field.value) || null}
                                        onChange={option => field.onChange(option?.value ?? '')}
                                        className={errors.territory ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </Card>

                <Card className="w-full overflow-hidden rounded-2xl shadow-md bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                    {/* Agency Header Block */}
                    <div className="flex items-center gap-4 px-6 py-5 bg-sky-100/70 dark:bg-sky-900/30 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-300 uppercase tracking-wide">
                                Agency
                            </div>
                            <div className="text-xl font-bold text-gray-800 dark:text-white">
                                {agencyName}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
{/* Card Body - Quota Section */}
<div className="px-6 py-6">
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md mx-auto shadow-sm">
    <div className="mb-4">
      <label
        htmlFor="quota"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Enter Quota
      </label>
      <FormItem invalid={!!errors.quota} errorMessage={errors.quota?.message}>
        <Controller
          name="quota"
          control={control}
          render={({ field }) => (
            <Input
              id="quota"
              placeholder="Enter quota amount"
              type="number"
              className={`w-full px-4 py-2 rounded-lg border text-base dark:bg-gray-800 ${
                errors.quota
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-sky-500'
              } focus:outline-none focus:ring-2`}
              {...field}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </FormItem>
    </div>

    <Button
      type="submit"
      variant="solid"
      className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      Submit Quota
    </Button>
  </div>
</div>

                </Card>


            </div>

            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onRequestClose={() => setDialogOpen(false)}
            >
                <h5 className="mb-4">Confirm Submission</h5>
                <p>
                    Are you sure you want to submit this quota for agency&nbsp;
                    <b>{agencyName}</b>?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="mr-2"
                        clickFeedback={false}
                        customColorClass={({ active, unclickable }) =>
                            [
                                'hover:text-red-600 border-red-600 border-2 hover:border-red-800 hover:ring-0 text-red-600 ',
                                unclickable && 'opacity-50 cursor-not-allowed',
                                !active && !unclickable,
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        onClick={() => setDialogOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        loading={isSubmitting}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </Form>
    )
}

export default ManualBillQuota

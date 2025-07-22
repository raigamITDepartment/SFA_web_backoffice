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
    { label: 'Modern Trade', value: 'modern' },
    { label: 'General Trade', value: 'general' },
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

               <Card className="w-full p-0 overflow-hidden">
    {/* Agency Header Block */}
    <div className="bg-sky-50 dark:bg-gray-800/50 flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        {/* Example icon/avatar: can be replaced with your logo or initials */}
        <div className="bg-sky-200 text-sky-800 dark:bg-gray-600 dark:text-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
            {agencyName.split(' ').map(w => w[0]).join('').slice(0,2)} 
            {/* Just initials, e.g. AD for "ABC DISTRIBUTORS" */}
        </div>
        <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                Agency
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {agencyName}
            </div>
        </div>
    </div>
    {/* Card Body */}
    <div className="px-6 py-6 flex flex-col gap-4">
        <FormItem invalid={!!errors.quota} errorMessage={errors.quota?.message}>
            <label htmlFor="quota" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Quota
            </label>
            <Controller
                name="quota"
                control={control}
                render={({ field }) => (
                    <Input
                        id="quota"
                        placeholder="Enter quota"
                        type="number"
                        className={`w-full ${errors.quota ? 'border-red-500' : ''}`}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                    />
                )}
            />
        </FormItem>

        <Button
            type="submit"
            variant="solid"
            className="text-base  px-8 rounded-xl w-full sm:w-auto self-center"
            disabled={isSubmitting}
            loading={isSubmitting}
        >
            Submit Quota
        </Button>
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

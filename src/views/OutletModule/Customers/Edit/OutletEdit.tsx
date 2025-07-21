import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import { Button } from '@/components/ui';
import { Form, FormItem } from '@/components/ui/Form';
import Dialog from '@/components/ui/Dialog';
import { HiEye } from 'react-icons/hi';

const CATEGORIES = ['Grocery', 'Food City', 'Bakery', 'Restaurant', 'Supermarket'];
const ROUTES = ['Route A', 'Route B', 'Route C', 'Route D'];
const RANGES = ['1-5km', '6-10km', '11-15km', '16-20km'];
const STATUS_OPTIONS = ['Active', 'Blocked'];

type OutletForm = {
  name: string;
  outletId: string;
  category: string;
  route: string;
  range: string;
  address1: string;
  address2: string;
  address3: string;
  ownerName: string;
  mobileNumber: string;
  openTime: string;
  closeTime: string;
  latitude: string;
  longitude: string;
  outletSequence: string;
  isApproved: boolean;
  status: string;
  imgList?: { id: string; name: string; img: string }[];
};

const OutletEdit = () => {
  const { id } = useParams();
  const location = useLocation();

  const outletData: OutletForm | undefined = location.state?.outlet;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<OutletForm>({
    defaultValues: {
      name: '',
      outletId: '',
      category: '',
      route: '',
      range: '',
      address1: '',
      address2: '',
      address3: '',
      ownerName: '',
      mobileNumber: '',
      openTime: '',
      closeTime: '',
      latitude: '',
      longitude: '',
      outletSequence: '',
      isApproved: false,
      status: 'active',
      imgList: [],
    },
  });

  useEffect(() => {
    if (outletData) {
      reset(outletData);
    } else if (id) {
      reset({
        name: `Outlet ${id}`,
        outletId: `OUT-${1000 + Number(id?.replace(/\D/g, ''))}`,
        category: CATEGORIES[0],
        route: ROUTES[0],
        range: RANGES[0],
        address1: '123 Main St',
        address2: 'Block A',
        address3: 'City 1',
        ownerName: 'Owner Name',
        mobileNumber: '+11234567890',
        openTime: '8:00 AM',
        closeTime: '8:00 PM',
        latitude: '37.77',
        longitude: '-122.41',
        outletSequence: '1',
        isApproved: true,
        status: 'active',
        imgList: [],
      });
    }
  }, [outletData, id, reset]);

  const onSubmit = (values: OutletForm) => {
    alert('Updated Outlet:\n' + JSON.stringify(values, null, 2));
  };

  // Image view dialog state
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<{ id: string; name: string; img: string } | null>(null);

  // Only view image, no upload/delete
  const handleView = (img: { id: string; name: string; img: string }) => {
    setSelectedImg(img);
    setViewOpen(true);
  };

  const handleDialogClose = () => {
    setViewOpen(false);
    setTimeout(() => setSelectedImg(null), 300);
  };

  return (
    <div className="flex justify-center mt-8">
      <Card bordered={false} className="w-full max-w-3xl">
        <h5 className="mb-4">Edit Outlet {id ? `(ID: ${id})` : ''}</h5>
        {/* Stylish Image Section on Top */}
        <Controller
          name="imgList"
          control={control}
          render={({ field }) =>
            field.value && field.value.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {field.value.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col items-center transition-transform hover:scale-105"
                  >
                    <img
                      className="rounded-xl max-h-[220px] w-auto object-cover shadow-md border border-gray-100 dark:border-gray-700"
                      src={img.img}
                      alt={img.name}
                    />
                    <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        className="text-2xl text-gray-700 dark:text-gray-200 hover:text-primary"
                        onClick={() => handleView(img)}
                        title="View"
                      >
                        <HiEye />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 font-medium">{img.name}</div>
                  </div>
                ))}
                <Dialog
                  isOpen={viewOpen}
                  onClose={handleDialogClose}
                  onRequestClose={handleDialogClose}
                >
                  <h5 className="mb-4">{selectedImg?.name}</h5>
                  {selectedImg && (
                    <img className="w-full rounded-xl" src={selectedImg.img} alt={selectedImg.name} />
                  )}
                </Dialog>
              </div>
            ) : (
              <div className="flex flex-col items-center mb-8">
                <div className="rounded-xl bg-gray-100 dark:bg-gray-800 w-48 h-48 flex items-center justify-center text-gray-400 text-6xl">
                  <span>No image</span>
                </div>
                <span className="mt-2 text-gray-400 text-sm">No image available</span>
              </div>
            )
          }
        />
        <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem
              invalid={Boolean(errors.name)}
              errorMessage={errors.name?.message}
              label="Name"
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input placeholder="Outlet Name" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.outletId)}
              errorMessage={errors.outletId?.message}
              label="Outlet ID"
            >
              <Controller
                name="outletId"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input placeholder="Outlet ID" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.category)}
              errorMessage={errors.category?.message}
              label="Category"
            >
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select
                    options={CATEGORIES.map(c => ({ label: c, value: c }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Category"
                  />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.route)}
              errorMessage={errors.route?.message}
              label="Route"
            >
              <Controller
                name="route"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select
                    options={ROUTES.map(r => ({ label: r, value: r }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Route"
                  />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.range)}
              errorMessage={errors.range?.message}
              label="Range"
            >
              <Controller
                name="range"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select
                    options={RANGES.map(r => ({ label: r, value: r }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Range"
                  />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.address1)}
              errorMessage={errors.address1?.message}
              label="Address 1"
            >
              <Controller
                name="address1"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input placeholder="Address 1" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.address2)}
              errorMessage={errors.address2?.message}
              label="Address 2"
            >
              <Controller
                name="address2"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Address 2" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.address3)}
              errorMessage={errors.address3?.message}
              label="Address 3"
            >
              <Controller
                name="address3"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Address 3" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.ownerName)}
              errorMessage={errors.ownerName?.message}
              label="Owner Name"
            >
              <Controller
                name="ownerName"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input placeholder="Owner Name" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.mobileNumber)}
              errorMessage={errors.mobileNumber?.message}
              label="Mobile Number"
            >
              <Controller
                name="mobileNumber"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input placeholder="Mobile Number" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.openTime)}
              errorMessage={errors.openTime?.message}
              label="Open Time"
            >
              <Controller
                name="openTime"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Open Time" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.closeTime)}
              errorMessage={errors.closeTime?.message}
              label="Close Time"
            >
              <Controller
                name="closeTime"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Close Time" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.latitude)}
              errorMessage={errors.latitude?.message}
              label="Latitude"
            >
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Latitude" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.longitude)}
              errorMessage={errors.longitude?.message}
              label="Longitude"
            >
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Longitude" {...field} />
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.outletSequence)}
              errorMessage={errors.outletSequence?.message}
              label="Outlet Sequence"
            >
              <Controller
                name="outletSequence"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Outlet Sequence" {...field} />
                )}
              />
            </FormItem>
            <FormItem label="Is Approved">
              <Controller
                name="isApproved"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Approved
                  </Checkbox>
                )}
              />
            </FormItem>
            <FormItem
              invalid={Boolean(errors.status)}
              errorMessage={errors.status?.message}
              label="Status"
            >
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select
                    options={STATUS_OPTIONS.map(s => ({ label: s, value: s.toLowerCase() }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Status"
                  />
                )}
              />
            </FormItem>
          </div>
          <div className="mt-6">
            <Button variant="solid" block type="submit">
              Update Outlet
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OutletEdit;
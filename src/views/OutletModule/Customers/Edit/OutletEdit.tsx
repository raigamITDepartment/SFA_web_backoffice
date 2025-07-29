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
import { FaMapMarkedAlt } from 'react-icons/fa';
import { HiEye } from 'react-icons/hi';
import { Outlet as OutletData } from '../components/CustomerListTable';

const OutletEdit = () => {
  const { id } = useParams();
  const location = useLocation();
  const outletData: OutletData | undefined = location.state?.outlet;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      outletId: '',
      category: null,
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
      vatNum: '',
      imgList: [],
    },
  });

  const [mapOpen, setMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: '', lng: '' });
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const handleView = (img) => {
    setSelectedImg(img);
    setViewOpen(true);
  };

  const handleDialogClose = () => {
    setViewOpen(false);
    setSelectedImg(null);
  };

  useEffect(() => {
    // Sample category data; replace with fetch API if needed
    const sampleCategoryData = [
      { id: 1, outletCategoryName: 'Grocery', isActive: true },
      { id: 2, outletCategoryName: 'Pharmacy', isActive: true },
    ];
    setCategoryOptions(sampleCategoryData);
  }, []);

  useEffect(() => {
    if (outletData && categoryOptions.length > 0) {
      const matchedCategory = categoryOptions.find(
        (cat) => cat.outletCategoryName.toLowerCase() === outletData.outletCategoryName.toLowerCase()
      );

      reset({
        name: outletData.outletName,
        outletId: outletData.uniqueCode,
        category: matchedCategory || null,
        route: outletData.routeName,
        range: outletData.rangeName,
        address1: outletData.address1,
        address2: outletData.address2,
        address3: outletData.address3,
        ownerName: outletData.ownerName,
        mobileNumber: outletData.mobileNo,
        openTime: outletData.openTime,
        closeTime: outletData.closeTime,
        latitude: String(outletData.latitude),
        longitude: String(outletData.longitude),
        outletSequence: String(outletData.outletSequence),
        isApproved: outletData.isApproved,
        status: outletData.isClose ? 'blocked' : 'active',
        vatNum: outletData.vatNum,
        imgList: outletData.imgList || [],
      });
      setMapCoords({ lat: String(outletData.latitude), lng: String(outletData.longitude) });
    }
  }, [outletData, categoryOptions, reset]);

  const onSubmit = (values) => {
    alert('Updated Outlet:\n' + JSON.stringify(values, null, 2));
  };

  return (
    <div className="flex justify-center mt-8">
      <Card bordered={false} className="w-full max-w-5xl">
        <h5 className="mb-4 flex justify-between items-center">
          Edit Outlet {id ? `(ID: ${id})` : ''}
          {mapCoords.lat && mapCoords.lng && (
            <FaMapMarkedAlt
              className="text-blue-600 text-xl cursor-pointer"
              onClick={() => setMapOpen(true)}
              title="View on Google Map"
            />
          )}
        </h5>
        <Form size="sm" onSubmit={handleSubmit(onSubmit)}>


<Controller
  name="imgList"
  control={control}
  render={({ field }) =>
    field.value && field.value.length > 0 ? (
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {field.value.map((img: { id: string; name: string; img: string }) => (
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
            <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
              {img.name}
            </div>
          </div>
        ))}
        <Dialog
          isOpen={viewOpen}
          onClose={handleDialogClose}
          onRequestClose={handleDialogClose}
        >
          <h5 className="mb-4">{selectedImg?.name}</h5>
          {selectedImg && (
            <img
              className="w-full rounded-xl"
              src={selectedImg.img}
              alt={selectedImg.name}
            />
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



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem label="Outlet Name">
              <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Unique Code">
              <Controller name="outletId" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Mobile No">
              <Controller name="mobileNumber" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Address 1">
              <Controller name="address1" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Address 2">
              <Controller name="address2" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Address 3">
              <Controller name="address3" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Category">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? { label: field.value.outletCategoryName, value: field.value } : null}
                    options={categoryOptions.map((cat) => ({
                      label: cat.outletCategoryName,
                      value: cat,
                    }))}
                    onChange={(val) => field.onChange(val?.value || null)}
                    placeholder="Select Category"
                  />
                )}
              />
            </FormItem>
            <FormItem label="Route">
              <Controller name="route" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Range">
              <Controller name="range" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Open Time">
              <Controller name="openTime" control={control} render={({ field }) => <Input type="time" {...field} />} />
            </FormItem>
            <FormItem label="Close Time">
              <Controller name="closeTime" control={control} render={({ field }) => <Input type="time" {...field} />} />
            </FormItem>
            <FormItem label="Latitude">
              <Controller name="latitude" control={control} render={({ field }) => <Input {...field} onBlur={(e) => setMapCoords((prev) => ({ ...prev, lat: e.target.value }))} />} />
            </FormItem>
            <FormItem label="Longitude">
              <Controller name="longitude" control={control} render={({ field }) => <Input {...field} onBlur={(e) => setMapCoords((prev) => ({ ...prev, lng: e.target.value }))} />} />
            </FormItem>
            <FormItem label="VAT Number">
              <Controller name="vatNum" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
            <FormItem label="Is Approved">
              <Controller name="isApproved" control={control} render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange}>Approved</Checkbox>} />
            </FormItem>
            <FormItem label="Status">
              <Controller name="status" control={control} render={({ field }) => <Input {...field} />} />
            </FormItem>
          </div>
          <div className="mt-6">
            <Button variant="solid" block type="submit">
              Update Outlet
            </Button>
          </div>
        </Form>
      </Card>
      <Dialog isOpen={mapOpen} onClose={() => setMapOpen(false)}>
        <h5 className="mb-2">Google Map Location</h5>
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          className="rounded"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&hl=es;z=14&output=embed`}
        ></iframe>
      </Dialog>
      <Dialog isOpen={viewOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">{selectedImg?.name}</h5>
        {selectedImg && <img className="w-full rounded-xl" src={selectedImg.img} alt={selectedImg.name} />}
      </Dialog>
    </div>
  );
};

export default OutletEdit;

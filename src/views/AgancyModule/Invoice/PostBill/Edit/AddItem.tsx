import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { Button, toast, Alert, Form, FormItem } from '@/components/ui';

interface AddItemFormData {
  itemNo: string;
  itemName: string;
  qty: number;
  itemPrice: number;
  goodReturnQty: number;
  goodReturnPrice: number;
  marketReturnQty: number;
  marketReturnPrice: number;
  goodReturnFree: number;
  marketReturnFree: number;
  freeIssue: number;
  discount: number;
}

const schema = z.object({
  itemNo: z.string().min(1, 'Item No is required'),
  itemName: z.string().min(1, 'Item Name is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  itemPrice: z.number().min(0, 'Item Price must be 0 or more'),
  goodReturnQty: z.number().min(0, 'Good Return Qty must be 0 or more'),
  goodReturnPrice: z.number().min(0, 'Good Return Price must be 0 or more'),
  marketReturnQty: z.number().min(0, 'Market Return Qty must be 0 or more'),
  marketReturnPrice: z.number().min(0, 'Market Return Price must be 0 or more'),
  goodReturnFree: z.number().min(0, 'Good Return Free must be 0 or more'),
  marketReturnFree: z.number().min(0, 'Market Return Free must be 0 or more'),
  freeIssue: z.number().min(0, 'Free Issue must be 0 or more'),
  discount: z.number().min(0, 'Discount must be 0 or more'),
});

const itemNameOptions = [
  { value: 'Item A', label: 'Item A' },
  { value: 'Item B', label: 'Item B' },
  { value: 'Item C', label: 'Item C' },
];

const itemDetailsMap: Record<string, { itemNo: string; itemPrice: number }> = {
  'Item A': { itemNo: 'ITEM-001', itemPrice: 10.0 },
  'Item B': { itemNo: 'ITEM-002', itemPrice: 15.5 },
  'Item C': { itemNo: 'ITEM-003', itemPrice: 20.0 },
};

<<<<<<<<< Temporary merge branch 1
const AddItem = () => {
=========


  function AddItem() {
>>>>>>>>> Temporary merge branch 2
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      itemNo: '',
      itemName: '',
      qty: 1,
      itemPrice: 0,
      goodReturnQty: 0,
      goodReturnPrice: 0,
      marketReturnQty: 0,
      marketReturnPrice: 0,
      goodReturnFree: 0,
      marketReturnFree: 0,
      freeIssue: 0,
      discount: 0,
    },
  });

  const selectedItemName = watch('itemName');

  useEffect(() => {
    if (selectedItemName && itemDetailsMap[selectedItemName]) {
      setValue('itemNo', itemDetailsMap[selectedItemName].itemNo);
      setValue('itemPrice', itemDetailsMap[selectedItemName].itemPrice);
    } else {
      setValue('itemNo', '');
      setValue('itemPrice', 0);
    }
  }, [selectedItemName, setValue]);

  const onSubmit = (data: AddItemFormData) => {
    toast.push(
      <Alert showIcon type="success" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
        Item Added Successfully!
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    );
    console.log('Form Data:', data);
    setTimeout(() => navigate(-1), 1000);
  };

  return (
    <Card bordered={false} className="max-w-4xl mx-auto p-10 shadow-xl bg-white dark:bg-gray-900 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Add Item</h2>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Item Name - full width */}
        <div className="mb-8">
          <FormItem label="Item Name" invalid={!!errors.itemName} errorMessage={errors.itemName?.message}>
            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <Select
                  options={itemNameOptions}
                  value={itemNameOptions.find(opt => opt.value === field.value) || null}
                  onChange={opt => field.onChange(opt?.value)}
                  placeholder="Select Item"
                  isClearable
                  className="w-full"
                />
              )}
            />
          </FormItem>
        </div>

        {/* Unified Grid for All Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormItem label="Item Code" invalid={!!errors.itemNo} errorMessage={errors.itemNo?.message}>
            <Controller
              name="itemNo"
              control={control}
              render={({ field }) => (
                <Input {...field} readOnly className="bg-gray-100 dark:bg-gray-700" />
              )}
            />
          </FormItem>

          <FormItem label="Quantity" invalid={!!errors.qty} errorMessage={errors.qty?.message}>
            <Controller
              name="qty"
              control={control}
              render={({ field }) => (
                <Input type="number" min={1} {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Item Price" invalid={!!errors.itemPrice} errorMessage={errors.itemPrice?.message}>
            <Controller
              name="itemPrice"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} readOnly className="bg-gray-100 dark:bg-gray-700" />
              )}
            />
          </FormItem>

          <FormItem label="Discount" invalid={!!errors.discount} errorMessage={errors.discount?.message}>
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <Input type="number" min={0} {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Free Issue" invalid={!!errors.freeIssue} errorMessage={errors.freeIssue?.message}>
            <Controller
              name="freeIssue"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Good Return Qty" invalid={!!errors.goodReturnQty} errorMessage={errors.goodReturnQty?.message}>
            <Controller
              name="goodReturnQty"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Good Return Price" invalid={!!errors.goodReturnPrice} errorMessage={errors.goodReturnPrice?.message}>
            <Controller
              name="goodReturnPrice"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Good Return Free" invalid={!!errors.goodReturnFree} errorMessage={errors.goodReturnFree?.message}>
            <Controller
              name="goodReturnFree"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Market Return Qty" invalid={!!errors.marketReturnQty} errorMessage={errors.marketReturnQty?.message}>
            <Controller
              name="marketReturnQty"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Market Return Price" invalid={!!errors.marketReturnPrice} errorMessage={errors.marketReturnPrice?.message}>
            <Controller
              name="marketReturnPrice"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>

          <FormItem label="Market Return Free" invalid={!!errors.marketReturnFree} errorMessage={errors.marketReturnFree?.message}>
            <Controller
              name="marketReturnFree"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )}
            />
          </FormItem>
        </div>

        

        {/* Action Buttons */}
        <div className="flex justify-end mt-10 gap-4">
          <Button type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="solid">
            Add Item
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddItem;

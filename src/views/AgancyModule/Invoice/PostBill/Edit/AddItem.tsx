import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { Button, toast, Alert } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

// Interface
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

// Validation schema
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

// Sample dropdown options
const itemNameOptions = [
  { value: 'Item A', label: 'Item A' },
  { value: 'Item B', label: 'Item B' },
  { value: 'Item C', label: 'Item C' },
];

// Optional mapping
const itemDetailsMap: Record<string, { itemNo: string; itemPrice: number }> = {
  'Item A': { itemNo: 'ITEM-001', itemPrice: 10.0 },
  'Item B': { itemNo: 'ITEM-002', itemPrice: 15.5 },
  'Item C': { itemNo: 'ITEM-003', itemPrice: 20.0 },
};

const Form: React.FC = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
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

  React.useEffect(() => {
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

  const onDiscard = () => navigate(-1);

  return (
    <Card bordered={false} className="max-w-3xl mx-auto p-8 shadow-md">
      <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        Add New Item
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* All Input Fields */}
          {[
            { name: 'itemName', label: 'Item Name', isSelect: true, required: true },
            { name: 'itemNo', label: 'Item No', disabled: true },
            { name: 'qty', label: 'Quantity', required: true },
            { name: 'itemPrice', label: 'Item Price', disabled: true },
            { name: 'goodReturnQty', label: 'Good Return Quantity' },
            { name: 'goodReturnPrice', label: 'Good Return Price' },
            { name: 'marketReturnQty', label: 'Market Return Quantity' },
            { name: 'marketReturnPrice', label: 'Market Return Price' },
            { name: 'goodReturnFree', label: 'Good Return Free' },
            { name: 'marketReturnFree', label: 'Market Return Free' },
            { name: 'freeIssue', label: 'Free Issue' },
            { name: 'discount', label: 'Discount' },
          ].map(({ name, label, isSelect, disabled, required }) => (
            <div key={name}>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-600">*</span>}
              </label>
              <Controller
                name={name as keyof AddItemFormData}
                control={control}
                render={({ field }) =>
                  isSelect ? (
                    <Select
                      options={itemNameOptions}
                      value={itemNameOptions.find(opt => opt.value === field.value) || null}
                      onChange={option => field.onChange(option?.value)}
                      placeholder="Select Item"
                      isClearable
                    />
                  ) : (
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder={label}
                      disabled={disabled}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  )
                }
              />
              {errors[name as keyof AddItemFormData] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors[name as keyof AddItemFormData]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8 gap-4">
          <Button type="button" onClick={onDiscard} className="flex-1">
            Discard
          </Button>
          <Button variant="solid" type="submit" className="flex-1">
            Add Item
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Form;

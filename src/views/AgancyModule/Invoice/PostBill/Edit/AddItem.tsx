import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { Button, toast, Alert } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface AddItemFormData {
  itemNo: string;
  itemName: string;
  qty: number;
  itemPrice: number;
  goodReturnQty: number;
  goodReturnPrice: number;
  marketReturnQty: number;
  marketReturnPrice: number;
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
});

const itemNameOptions = [
  { value: 'Item A', label: 'Item A' },
  { value: 'Item B', label: 'Item B' },
  { value: 'Item C', label: 'Item C' },
];

// Sample data map for itemNo and itemPrice per itemName (optional)
const itemDetailsMap: Record<
  string,
  { itemNo: string; itemPrice: number }
> = {
  'Item A': { itemNo: 'ITEM-001', itemPrice: 10.0 },
  'Item B': { itemNo: 'ITEM-002', itemPrice: 15.5 },
  'Item C': { itemNo: 'ITEM-003', itemPrice: 20.0 },
};



  function AddItem() {
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
    },
  });

  const selectedItemName = watch('itemName');

  // Update itemNo and itemPrice when itemName changes
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
      <Alert
        showIcon
        type="success"
        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
      >
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
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const onDiscard = () => {
    navigate(-1);
  };

  return (
    <Card bordered={false} className="max-w-3xl mx-auto p-8 shadow-md">
      <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        Add New Item
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Item Name (Select Dropdown) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Item Name <span className="text-red-600">*</span>
            </label>
            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <Select
                  options={itemNameOptions}
                  value={
                    itemNameOptions.find(opt => opt.value === field.value) ||
                    null
                  }
                  onChange={option => field.onChange(option?.value)}
                  placeholder="Select Item Name"
                  isClearable
                />
              )}
            />
            {errors.itemName && (
              <p className="text-red-600 text-sm mt-1">{errors.itemName.message}</p>
            )}
          </div>

          {/* Item No (Disabled Input) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Item No
            </label>
            <Controller
              name="itemNo"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled placeholder="Item No" />
              )}
            />
            {errors.itemNo && (
              <p className="text-red-600 text-sm mt-1">{errors.itemNo.message}</p>
            )}
          </div>

          {/* Quantity (Required Input) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Quantity <span className="text-red-600">*</span>
            </label>
            <Controller
              name="qty"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Quantity"
                />
              )}
            />
            {errors.qty && (
              <p className="text-red-600 text-sm mt-1">{errors.qty.message}</p>
            )}
          </div>

          {/* Item Price (Disabled Input) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Item Price
            </label>
            <Controller
              name="itemPrice"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled placeholder="Item Price" />
              )}
            />
            {errors.itemPrice && (
              <p className="text-red-600 text-sm mt-1">{errors.itemPrice.message}</p>
            )}
          </div>

          {/* Good Return Qty */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Good Return Quantity
            </label>
            <Controller
              name="goodReturnQty"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Good Return Qty"
                />
              )}
            />
            {errors.goodReturnQty && (
              <p className="text-red-600 text-sm mt-1">{errors.goodReturnQty.message}</p>
            )}
          </div>

          {/* Good Return Price */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Good Return Price
            </label>
            <Controller
              name="goodReturnPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step="0.01"
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Good Return Price"
                />
              )}
            />
            {errors.goodReturnPrice && (
              <p className="text-red-600 text-sm mt-1">{errors.goodReturnPrice.message}</p>
            )}
          </div>

          {/* Market Return Qty */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Market Return Quantity
            </label>
            <Controller
              name="marketReturnQty"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Market Return Qty"
                />
              )}
            />
            {errors.marketReturnQty && (
              <p className="text-red-600 text-sm mt-1">{errors.marketReturnQty.message}</p>
            )}
          </div>

          {/* Market Return Price */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Market Return Price
            </label>
            <Controller
              name="marketReturnPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step="0.01"
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Market Return Price"
                />
              )}
            />
            {errors.marketReturnPrice && (
              <p className="text-red-600 text-sm mt-1">{errors.marketReturnPrice.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8 gap-4">
          <Button
            
            type="button"
            onClick={onDiscard}
            className="flex-1"
          >
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

export default AddItem;

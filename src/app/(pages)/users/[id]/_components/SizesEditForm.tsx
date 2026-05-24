'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormComponent from '@/components/organisms/form/formComponent/FormComponent';
import FormInput from '@/components/organisms/form/formInput/FormInput';
import FormSelect from '@/components/organisms/form/formSelect/FormSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClothingSize } from '@/server/db/schema';
import { api } from '@/trpc/react';

type SizeFormData = {
  shoeSize: number | null;
  clothingSize: string;
  height: number | null;
  weight: number | null;
};

type Props = {
  userId: string;
  defaultValues: SizeFormData;
};

const SizesEditForm = ({ userId, defaultValues }: Props) => {
  const form = useForm<SizeFormData>({ defaultValues });
  const { isSubmitting } = form.formState;
  const utils = api.useUtils();

  const updateSizes = api.user.updateSizes.useMutation({
    onSuccess: async () => {
      await utils.user.getSizes.invalidate({ userId });
      toast('Mjere uspješno spremljene', { type: 'success' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleSubmit = async () => {
    const data = form.getValues();

    await updateSizes.mutateAsync({
      userId,
      sizes: {
        shoeSize: data.shoeSize ? Number(data.shoeSize) : null,
        clothingSize: (data.clothingSize as ClothingSize) || null,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <FormComponent form={form} onSubmit={handleSubmit}>
          <FormSelect
            id="clothingSize"
            label="Veličina odjeće"
            {...form.register('clothingSize')}
          >
            <option value="">-- Bez izbora --</option>
            {Object.entries(ClothingSize).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </FormSelect>

          <FormInput
            id="shoeSize"
            label="Veličina obuće"
            type="number"
            {...form.register('shoeSize')}
          />

          <FormInput
            id="height"
            label="Visina (cm)"
            type="number"
            {...form.register('height', {
              valueAsNumber: true,
              min: { value: 50, message: 'Visina mora biti veća od 50 cm' },
              max: {
                value: 250,
                message: 'Visina ne smije biti veća od 250 cm',
              },
            })}
          />

          <FormInput
            id="weight"
            label="Težina (kg)"
            type="number"
            {...form.register('weight', {
              valueAsNumber: true,
              min: { value: 1, message: 'Težina mora biti veća od 0 kg' },
              max: {
                value: 500,
                message: 'Težina ne smije biti veća od 500 kg',
              },
            })}
          />

          <Button
            className="bg-black text-base! text-white"
            type="submit"
            showLoading={isSubmitting}
          >
            Spremi mjere
          </Button>
        </FormComponent>
      </CardContent>
    </Card>
  );
};

export default SizesEditForm;

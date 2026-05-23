'use client';
import { useParams, useRouter } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '~/components/atoms/Button';
import FormComponent from '~/components/organisms/form/formComponent/FormComponent';
import FormInput from '~/components/organisms/form/formInput/FormInput';
import { api } from '~/trpc/react';

export type EquipmentFormData = {
  id?: string;
  name: string;
  type: string;
  size: string;
  quantity: number;
};

type Props = {
  action: 'create' | 'update';
  formData?: EquipmentFormData;
};

const EquipmentForm: React.FC<Props> = ({ action, formData }) => {
  const form = useForm<EquipmentFormData>({
    defaultValues: {
      id: formData?.id ?? '',
      name: formData?.name ?? '',
      type: formData?.type ?? '',
      size: formData?.size ?? '',
      quantity: formData?.quantity ?? 1,
    },
  });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isSubmitting } = form.formState;
  const createEquipment = api.equipment.create.useMutation();
  const updateEquipment = api.equipment.update.useMutation();

  const handleSubmit = async () => {
    const data = form.getValues();

    try {
      const payload: EquipmentFormData = {
        name: data.name,
        type: data.type,
        size: data.size,
        quantity: Number(data.quantity),
        ...(params.id && { id: params.id }),
      };

      if (action === 'create') {
        await createEquipment.mutateAsync(payload);
      } else {
        await updateEquipment.mutateAsync(payload);
      }

      router.push('/equipment');
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, { type: 'error' });
      }

      return;
    }
  };

  return (
    <FormComponent form={form} onSubmit={handleSubmit}>
      <FormInput
        id="name"
        label="Naziv*"
        {...form.register('name', {
          required: 'Naziv je obavezno polje',
        })}
      />

      <FormInput
        id="type"
        label="Tip*"
        {...form.register('type', {
          required: 'Tip je obavezno polje',
        })}
      />

      <FormInput
        id="size"
        label="Veličina*"
        {...form.register('size', {
          required: 'Veličina je obavezno polje',
        })}
      />

      <FormInput
        id="quantity"
        label="Količina*"
        type="number"
        {...form.register('quantity', {
          required: 'Količina je obavezno polje',
          min: { value: 1, message: 'Količina mora biti veća od 0' },
        })}
      />

      <Button
        className="!text-base bg-black text-white"
        type="submit"
        showLoading={isSubmitting}
      >
        <span>{action === 'create' ? 'Nova oprema' : 'Spremi promjene'}</span>
      </Button>
    </FormComponent>
  );
};

export default EquipmentForm;

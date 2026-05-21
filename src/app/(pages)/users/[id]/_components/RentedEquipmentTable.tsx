'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '~/components/atoms/Button';
import FormComponent from '~/components/organisms/form/formComponent/FormComponent';
import FormInput from '~/components/organisms/form/formInput/FormInput';
import FormSelect from '~/components/organisms/form/formSelect/FormSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/organisms/Table';
import { api } from '~/trpc/react';

type RentedItem = {
  equipmentId: string;
  name: string;
  type: string;
  size: string;
  rentedQuantity: number;
  dateOfRent: string;
};

type Props = {
  userId: string;
  items: RentedItem[];
};

type AddFormData = {
  equipmentId: string;
  quantity: number;
  dateOfRent: string;
};

const RentedEquipmentTable = ({ userId, items }: Props) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const utils = api.useUtils();

  const { data: allEquipment } = api.equipment.findAll.useQuery();

  const removeEquipment = api.user.removeRentedEquipment.useMutation({
    onSuccess: async () => {
      await utils.user.getRentedEquipment.invalidate({ userId });
      toast('Oprema uspješno uklonjena', { type: 'success' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const addEquipment = api.user.addRentedEquipment.useMutation({
    onSuccess: async () => {
      await utils.user.getRentedEquipment.invalidate({ userId });
      toast('Oprema uspješno dodijeljena', { type: 'success' });
      setShowAddForm(false);
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const form = useForm<AddFormData>({
    defaultValues: { equipmentId: '', quantity: 1, dateOfRent: '' },
  });

  const assignedEquipmentIds = new Set(items.map((i) => i.equipmentId));
  const availableEquipment =
    allEquipment?.filter((e) => !assignedEquipmentIds.has(e.id)) ?? [];

  const handleAdd = async () => {
    const data = form.getValues();

    await addEquipment.mutateAsync({
      userId,
      equipmentId: data.equipmentId,
      quantity: Number(data.quantity),
      dateOfRent: data.dateOfRent,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Popis zadužene opreme</h3>
        <Button
          type="button"
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          onClick={() => setShowAddForm(true)}
        >
          + Dodaj opremu
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naziv</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Veličina</TableHead>
                <TableHead>Količina</TableHead>
                <TableHead>Datum zaduženja</TableHead>
                <TableHead>Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.equipmentId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.rentedQuantity}</TableCell>
                  <TableCell>{item.dateOfRent}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      className="text-sm"
                      disabled={removeEquipment.isPending}
                      onClick={() =>
                        removeEquipment.mutate({
                          userId,
                          equipmentId: item.equipmentId,
                        })
                      }
                    >
                      Ukloni
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Nema zadužene opreme.
        </div>
      )}

      {showAddForm && (
        <div className="rounded-lg border p-6">
          <h4 className="mb-4 font-medium">Dodaj opremu</h4>
          <FormComponent form={form} onSubmit={handleAdd}>
            <FormSelect
              id="equipmentId"
              label="Oprema*"
              {...form.register('equipmentId', { required: true })}
              placeholder="Odaberite opremu"
            >
              <option value="">-- Odaberite opremu --</option>
              {availableEquipment.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} — {e.type}, vel. {e.size}
                </option>
              ))}
            </FormSelect>

            <FormInput
              id="quantity"
              label="Količina*"
              type="number"
              {...form.register('quantity', {
                required: true,
                min: { value: 1, message: 'Količina mora biti veća od 0' },
              })}
            />

            <FormInput
              id="dateOfRent"
              label="Datum zaduženja*"
              type="date"
              {...form.register('dateOfRent', { required: true })}
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-black text-white"
                showLoading={addEquipment.isPending}
              >
                Dodaj
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setShowAddForm(false);
                }}
              >
                Odustani
              </Button>
            </div>
          </FormComponent>
        </div>
      )}
    </div>
  );
};

export default RentedEquipmentTable;

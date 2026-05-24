'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/organisms/modal/Modal';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/organisms/Table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import usePagination from '@/hooks/usePagination';
import type { FindEquipmentReturnDTO } from '@/server/services/equipment/equipment.repository';
import { api } from '@/trpc/react';

type Props = {
  data?: FindEquipmentReturnDTO[];
  totalPageNumber: number;
};

const EquipmentTable = ({ data, totalPageNumber }: Props) => {
  const [equipmentToDelete, setEquipmentToDelete] =
    useState<FindEquipmentReturnDTO | null>(null);
  const utils = api.useUtils();
  const { handlePageChange } = usePagination();

  const deleteMutation = api.equipment.delete.useMutation({
    onSuccess: async () => {
      await utils.equipment.find.invalidate();
      handlePageChange(0);
      toast('Oprema uspješno obrisana', { type: 'success' });
      setEquipmentToDelete(null);
    },
    onError: (error) => {
      toast(error.message, { type: 'error' });
      setEquipmentToDelete(null);
    },
  });

  if (!data?.length) {
    return <div>Nema rezultata</div>;
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:table-cell">Naziv</TableHead>
              <TableHead className="md:table-cell">Tip</TableHead>
              <TableHead className="md:table-cell">Veličina</TableHead>
              <TableHead className="md:table-cell">Količina</TableHead>
              <TableHead className="md:table-cell">Akcije</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="md:table-cell">{item.name}</TableCell>
                <TableCell className="md:table-cell">{item.type}</TableCell>
                <TableCell className="md:table-cell">{item.size}</TableCell>
                <TableCell className="md:table-cell">{item.quantity}</TableCell>
                <TableCell className="md:table-cell">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/equipment/${item.id}`}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <Pencil />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setEquipmentToDelete(item)}
                      className="flex cursor-pointer items-center justify-center text-red-500 hover:text-red-700"
                      aria-label="Obriši opremu"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {totalPageNumber > 1 && (
        <PaginationComponent totalPageNumber={totalPageNumber} />
      )}

      <Modal
        isOpen={!!equipmentToDelete}
        onClose={() => setEquipmentToDelete(null)}
      >
        <h2 className="mb-2 font-semibold text-lg">Obriši opremu?</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Ovo će trajno obrisati ovu opremu i ukloniti je od svih korisnika
          kojima je dodijeljena. Ova radnja se ne može poništiti.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setEquipmentToDelete(null)}
          >
            Odustani
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (equipmentToDelete) {
                deleteMutation.mutate({ id: equipmentToDelete.id });
              }
            }}
          >
            Obriši
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EquipmentTable;

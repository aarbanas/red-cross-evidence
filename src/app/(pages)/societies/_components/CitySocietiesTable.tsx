'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '~/components/atoms/Button';
import Modal from '~/components/organisms/modal/Modal';
import PaginationComponent from '~/components/organisms/pagination/PaginationComponent';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/organisms/Table';
import type { FindCitySocietyReturnDTO } from '~/server/services/citySociety/citySociety.repository';
import { api } from '~/trpc/react';

type Props = {
  data?: FindCitySocietyReturnDTO[];
  totalPageNumber: number;
};

const CitySocietiesTable = ({ data, totalPageNumber }: Props) => {
  const [itemToDelete, setItemToDelete] =
    useState<FindCitySocietyReturnDTO | null>(null);
  const utils = api.useUtils();

  const deleteMutation = api.citySociety.delete.useMutation({
    onSuccess: async () => {
      await utils.citySociety.find.invalidate();
      toast('Gradsko društvo uspješno obrisano', { type: 'success' });
      setItemToDelete(null);
    },
    onError: (error) => {
      toast(error.message, { type: 'error' });
      setItemToDelete(null);
    },
  });

  if (!data?.length) {
    return <div>Nema rezultata</div>;
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:table-cell">Naziv</TableHead>
              <TableHead className="md:table-cell">Ravnatelj</TableHead>
              <TableHead className="md:table-cell">Telefon</TableHead>
              <TableHead className="md:table-cell">E-mail</TableHead>
              <TableHead className="md:table-cell">Grad</TableHead>
              <TableHead className="md:table-cell">Društvo</TableHead>
              <TableHead className="md:table-cell">Akcije</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="md:table-cell">{item.name}</TableCell>
                <TableCell className="md:table-cell">{item.director}</TableCell>
                <TableCell className="md:table-cell">{item.phone}</TableCell>
                <TableCell className="md:table-cell">{item.email}</TableCell>
                <TableCell className="md:table-cell">{item.cityName}</TableCell>
                <TableCell className="md:table-cell">
                  {item.societyName}
                </TableCell>
                <TableCell className="md:table-cell">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/societies/city/${item.id}`}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <Pencil />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="flex cursor-pointer items-center justify-center text-red-500 hover:text-red-700"
                      aria-label="Obriši gradsko društvo"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent totalPageNumber={totalPageNumber} />

      <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
        <h2 className="mb-2 font-semibold text-lg">Obriši gradsko društvo?</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Ovo će trajno obrisati ovo gradsko društvo. Ova radnja se ne može
          poništiti.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setItemToDelete(null)}
          >
            Odustani
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (itemToDelete) {
                deleteMutation.mutate({ id: itemToDelete.id });
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

export default CitySocietiesTable;

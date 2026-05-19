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
import type { FindSocietyReturnDTO } from '~/server/services/society/society.repository';
import { api } from '~/trpc/react';

type Props = {
  data?: FindSocietyReturnDTO[];
  totalPageNumber: number;
};

const SocietiesTable = ({ data, totalPageNumber }: Props) => {
  const [societyToDelete, setSocietyToDelete] =
    useState<FindSocietyReturnDTO | null>(null);
  const utils = api.useUtils();

  const deleteMutation = api.society.delete.useMutation({
    onSuccess: async () => {
      await utils.society.find.invalidate();
      toast('Društvo uspješno obrisano', { type: 'success' });
      setSocietyToDelete(null);
    },
    onError: (error) => {
      toast(error.message, { type: 'error' });
      setSocietyToDelete(null);
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
              <TableHead className="md:table-cell">Akcije</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((society) => (
              <TableRow key={society.id}>
                <TableCell className="md:table-cell">{society.name}</TableCell>
                <TableCell className="md:table-cell">
                  {society.director}
                </TableCell>
                <TableCell className="md:table-cell">{society.phone}</TableCell>
                <TableCell className="md:table-cell">{society.email}</TableCell>
                <TableCell className="md:table-cell">
                  {society.cityName}
                </TableCell>
                <TableCell className="md:table-cell">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/societies/list/${society.id}`}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <Pencil />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSocietyToDelete(society)}
                      className="flex cursor-pointer items-center justify-center text-red-500 hover:text-red-700"
                      aria-label="Obriši društvo"
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

      <Modal
        isOpen={!!societyToDelete}
        onClose={() => setSocietyToDelete(null)}
      >
        <h2 className="mb-2 font-semibold text-lg">Obriši društvo?</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Ovo će trajno obrisati ovo društvo. Ova radnja se ne može poništiti.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setSocietyToDelete(null)}
          >
            Odustani
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (societyToDelete) {
                deleteMutation.mutate({ id: societyToDelete.id });
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

export default SocietiesTable;

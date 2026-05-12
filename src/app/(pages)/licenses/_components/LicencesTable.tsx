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
import type { FindLicenseReturnDTO } from '~/server/services/license/license.repository';
import { api } from '~/trpc/react';

type Props = {
  data?: FindLicenseReturnDTO[];
  totalPageNumber: number;
};

const LicencesTable = ({ data, totalPageNumber }: Props) => {
  const [licenseToDelete, setLicenseToDelete] =
    useState<FindLicenseReturnDTO | null>(null);
  const utils = api.useUtils();

  const deleteMutation = api.license.delete.useMutation({
    onSuccess: async () => {
      await utils.license.find.invalidate();
      toast('Licenca uspješno obrisana', { type: 'success' });
      setLicenseToDelete(null);
    },
    onError: (error) => {
      toast(error.message, { type: 'error' });
      setLicenseToDelete(null);
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
              <TableHead className="md:table-cell">Tip</TableHead>
              <TableHead className="md:table-cell">Naziv</TableHead>
              <TableHead className="md:table-cell">Opis</TableHead>
              <TableHead className="md:table-cell">Akcije</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="md:table-cell">{license.type}</TableCell>
                <TableCell className="md:table-cell">{license.name}</TableCell>
                <TableCell className="md:table-cell">
                  {license.description}
                </TableCell>
                <TableCell className="md:table-cell">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/licenses/${license.id}`}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <Pencil />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setLicenseToDelete(license)}
                      className="flex cursor-pointer items-center justify-center text-red-500 hover:text-red-700"
                      aria-label="Obriši licencu"
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
        isOpen={!!licenseToDelete}
        onClose={() => setLicenseToDelete(null)}
      >
        <h2 className="mb-2 font-semibold text-lg">Obriši licencu?</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Ovo će trajno obrisati ovu licencu i ukloniti je od svih korisnika
          kojima je dodijeljena. Ova radnja se ne može poništiti.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setLicenseToDelete(null)}
          >
            Odustani
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (licenseToDelete) {
                deleteMutation.mutate({ id: licenseToDelete.id });
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

export default LicencesTable;

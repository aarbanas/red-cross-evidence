'use client';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/organisms/modal/Modal';
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
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';

type EducationTerm = {
  educationTermId: string;
  termTitle: string;
  dateFrom: Date;
  dateTo: Date;
  educationTitle: string;
};

type Props = {
  userId: string;
  items: EducationTerm[];
};

const UserEducationsTable = ({ userId, items }: Props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<EducationTerm | null>(null);
  const [educationSearch, setEducationSearch] = useState('');
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(
    null,
  );
  const utils = api.useUtils();

  const enrolledTermIds = new Set(items.map((i) => i.educationTermId));

  const { data: allEducations } = api.education.list.getAllTitles.useQuery(
    undefined,
    {
      enabled: showAddModal,
    },
  );

  const filteredEducations =
    educationSearch.length > 0
      ? (allEducations?.filter((e) =>
          e.title.toLowerCase().includes(educationSearch.toLowerCase()),
        ) ?? [])
      : [];

  const { data: termsForEducation } =
    api.education.term.findByEducationId.useQuery(
      { educationId: selectedEducationId ?? '', excludeProfileId: undefined },
      { enabled: !!selectedEducationId },
    );

  const availableTerms =
    termsForEducation?.filter((t) => !enrolledTermIds.has(t.id)) ?? [];

  const addEducationTerm = api.user.addEducationTerm.useMutation({
    onSuccess: async () => {
      await utils.user.getEducationTerms.invalidate({ userId });
      toast('Edukacija uspješno dodijeljena', { type: 'success' });
      handleCloseModal();
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const removeEducationTerm = api.user.removeEducationTerm.useMutation({
    onSuccess: async () => {
      await utils.user.getEducationTerms.invalidate({ userId });
      toast('Edukacija uspješno uklonjena', { type: 'success' });
      setItemToRemove(null);
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEducationSearch('');
    setSelectedEducationId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Edukacije</h3>
        <Button
          type="button"
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          onClick={() => setShowAddModal(true)}
        >
          + Dodaj edukaciju
        </Button>
      </div>

      {items.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Edukacija</TableHead>
                <TableHead>Termin</TableHead>
                <TableHead>Datum od</TableHead>
                <TableHead>Datum do</TableHead>
                <TableHead>Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.educationTermId}>
                  <TableCell>{item.educationTitle}</TableCell>
                  <TableCell>{item.termTitle}</TableCell>
                  <TableCell>
                    {moment(item.dateFrom).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(item.dateTo).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      className="text-sm"
                      onClick={() => setItemToRemove(item)}
                    >
                      Ukloni
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Nema dodijeljenih edukacija.
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        className="w-[80%]"
      >
        <h4 className="mb-4 font-medium">Dodaj edukaciju</h4>

        {!selectedEducationId ? (
          <>
            <p className="mb-2 text-gray-600 text-sm">
              Korak 1: Odaberite edukaciju
            </p>
            <Input
              placeholder="Pretraži po nazivu edukacije..."
              value={educationSearch}
              onChange={(e) => setEducationSearch(e.target.value)}
              className="mb-4"
            />
            {filteredEducations.length > 0 && (
              <div className="max-h-72 overflow-y-auto">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naziv</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEducations.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell>{e.title}</TableCell>
                          <TableCell>{e.type}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              className="text-sm"
                              onClick={() => setSelectedEducationId(e.id)}
                            >
                              Odaberi
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
            {educationSearch && filteredEducations.length === 0 && (
              <p className="py-4 text-center text-gray-500 text-sm">
                Nema rezultata.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mb-2 text-gray-600 text-sm">
              Korak 2: Odaberite termin
            </p>
            <Button
              type="button"
              variant="outline"
              className="mb-4 text-sm"
              onClick={() => setSelectedEducationId(null)}
            >
              ← Natrag
            </Button>
            {availableTerms.length > 0 ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naziv</TableHead>
                      <TableHead>Datum od</TableHead>
                      <TableHead>Datum do</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableTerms.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.title}</TableCell>
                        <TableCell>
                          {moment(t.dateFrom).format('DD.MM.YYYY')}
                        </TableCell>
                        <TableCell>
                          {moment(t.dateTo).format('DD.MM.YYYY')}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            className="bg-black text-sm text-white"
                            showLoading={addEducationTerm.isPending}
                            onClick={() =>
                              addEducationTerm.mutate({
                                userId,
                                educationTermId: t.id,
                              })
                            }
                          >
                            Dodaj
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <p className="py-4 text-center text-gray-500 text-sm">
                Nema dostupnih termina za ovu edukaciju.
              </p>
            )}
          </>
        )}

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={handleCloseModal}>
            Zatvori
          </Button>
        </div>
      </Modal>

      <Modal isOpen={!!itemToRemove} onClose={() => setItemToRemove(null)}>
        <h4 className="mb-2 font-medium">Ukloni edukaciju</h4>
        <p className="mb-6 text-gray-600 text-sm">
          Jeste li sigurni da želite ukloniti{' '}
          <span className="font-semibold">{itemToRemove?.educationTitle}</span>{' '}
          — <span className="font-semibold">{itemToRemove?.termTitle}</span>?
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            showLoading={removeEducationTerm.isPending}
            onClick={() =>
              itemToRemove &&
              removeEducationTerm.mutate({
                userId,
                educationTermId: itemToRemove.educationTermId,
              })
            }
          >
            Ukloni
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={removeEducationTerm.isPending}
            onClick={() => setItemToRemove(null)}
          >
            Odustani
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserEducationsTable;

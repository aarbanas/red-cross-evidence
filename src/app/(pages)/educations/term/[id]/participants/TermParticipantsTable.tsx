'use client';
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

type Participant = {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  termId: string;
  maxParticipants: number;
  participants: Participant[];
};

const TermParticipantsTable = ({
  termId,
  maxParticipants,
  participants,
}: Props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [participantToRemove, setParticipantToRemove] =
    useState<Participant | null>(null);
  const [search, setSearch] = useState('');
  const utils = api.useUtils();

  const enrolledProfileIds = new Set(participants.map((p) => p.profileId));
  const atCapacity = participants.length >= maxParticipants;

  const { data: searchResults } = api.user.findByName.useQuery(
    { search },
    { enabled: search.length >= 2 },
  );

  const availableUsers =
    searchResults?.filter(
      (u) => u.profile && !enrolledProfileIds.has(u.profile.id),
    ) ?? [];

  const addParticipant = api.education.term.addParticipant.useMutation({
    onSuccess: async () => {
      await utils.education.term.getParticipants.invalidate({ termId });
      toast('Sudionik uspješno dodan', { type: 'success' });
      setShowAddModal(false);
      setSearch('');
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const removeParticipant = api.education.term.removeParticipant.useMutation({
    onSuccess: async () => {
      await utils.education.term.getParticipants.invalidate({ termId });
      toast('Sudionik uspješno uklonjen', { type: 'success' });
      setParticipantToRemove(null);
    },
    onError: (error) => toast(error.message, { type: 'error' }),
  });

  const handleAdd = (profileId: string) => {
    addParticipant.mutate({ termId, profileId });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">
          Sudionici ({participants.length}/{maxParticipants})
        </h3>
        <Button
          type="button"
          variant="outline"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          onClick={() => setShowAddModal(true)}
        >
          + Dodaj sudionike
        </Button>
      </div>

      {participants.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ime</TableHead>
                <TableHead>Prezime</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p) => (
                <TableRow key={p.profileId}>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.lastName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      className="text-sm"
                      onClick={() => setParticipantToRemove(p)}
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
          Nema prijavljenih sudionika.
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSearch('');
        }}
      >
        <h4 className="mb-4 font-medium">Dodaj sudionike</h4>

        {atCapacity && (
          <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
            Termin je popunjen ({participants.length}/{maxParticipants}{' '}
            sudionika).
          </div>
        )}

        <Input
          placeholder="Pretraži po imenu ili prezimenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        {search.length >= 2 && availableUsers.length === 0 && (
          <p className="py-4 text-center text-gray-500 text-sm">
            Nema rezultata.
          </p>
        )}

        {availableUsers.length > 0 && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ime</TableHead>
                  <TableHead>Prezime</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.profile?.firstName}</TableCell>
                    <TableCell>{u.profile?.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        className="bg-black text-sm text-white"
                        showLoading={addParticipant.isPending}
                        onClick={() => u.profile && handleAdd(u.profile.id)}
                      >
                        Dodaj
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowAddModal(false);
              setSearch('');
            }}
          >
            Zatvori
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!participantToRemove}
        onClose={() => setParticipantToRemove(null)}
      >
        <h4 className="mb-2 font-medium">Ukloni sudionika</h4>
        <p className="mb-6 text-gray-600 text-sm">
          Jeste li sigurni da želite ukloniti{' '}
          <span className="font-semibold">
            {participantToRemove?.firstName} {participantToRemove?.lastName}
          </span>
          ?
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            showLoading={removeParticipant.isPending}
            onClick={() =>
              participantToRemove &&
              removeParticipant.mutate({
                termId,
                profileId: participantToRemove.profileId,
              })
            }
          >
            Ukloni
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={removeParticipant.isPending}
            onClick={() => setParticipantToRemove(null)}
          >
            Odustani
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TermParticipantsTable;

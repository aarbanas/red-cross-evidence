'use client';
import { useState } from 'react';
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

export type StagedParticipant = {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  participants: StagedParticipant[];
  onChange: (participants: StagedParticipant[]) => void;
};

const TermParticipantsStagingSection = ({ participants, onChange }: Props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const stagedProfileIds = new Set(participants.map((p) => p.profileId));

  const { data: searchResults } = api.user.findByName.useQuery(
    { search },
    { enabled: search.length >= 2 },
  );

  const availableUsers =
    searchResults?.filter(
      (u) => u.profile && !stagedProfileIds.has(u.profile.id),
    ) ?? [];

  const handleAdd = (user: (typeof availableUsers)[number]) => {
    if (!user.profile) {
      return;
    }

    onChange([
      ...participants,
      {
        profileId: user.profile.id,
        firstName: user.profile.firstName ?? '',
        lastName: user.profile.lastName ?? '',
        email: user.email,
      },
    ]);
    setSearch('');
  };

  const handleRemove = (profileId: string) => {
    onChange(participants.filter((p) => p.profileId !== profileId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">
          Sudionici ({participants.length})
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
                      onClick={() => handleRemove(p.profileId)}
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
          Nema odabranih sudionika.
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        className="w-[50%]"
        onClose={() => {
          setShowAddModal(false);
          setSearch('');
        }}
      >
        <h4 className="mb-4 font-medium">Dodaj sudionike</h4>

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
                        onClick={() => handleAdd(u)}
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
    </div>
  );
};

export default TermParticipantsStagingSection;

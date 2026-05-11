import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { type FC, useState } from 'react';
import { translateEducationType } from '~/app/(pages)/educations/utils';
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
import type { EducationType } from '~/server/db/schema';
import type { FindEducationListReturnDTO } from '~/server/services/education/education.repository';
import { api } from '~/trpc/react';

type Props = {
  data?: FindEducationListReturnDTO[];
  totalPageNumber: number;
  refetch: () => void;
};

const EducationsListTable: FC<Props> = ({ data, totalPageNumber, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const deleteEducation = api.education.list.deleteById.useMutation();

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteEducation.mutateAsync({ id: selectedId });

      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  const openModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  if (!data?.length) {
    return <div>Nema rezultata</div>;
  }

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:table-cell">Tip</TableHead>
              <TableHead className="md:table-cell">Naziv</TableHead>
              <TableHead className="md:table-cell">Opis</TableHead>
              <TableHead className="md:table-cell">Uredi</TableHead>
              <TableHead className="md:table-cell">Izbriši</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((educationList) => (
              <TableRow key={educationList.id}>
                <TableCell className="md:table-cell">
                  {translateEducationType(educationList.type as EducationType)}
                </TableCell>
                <TableCell className="md:table-cell">
                  {educationList.title}
                </TableCell>
                <TableCell className="md:table-cell">
                  {educationList.description}
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <Link
                    href={{
                      pathname: `/educations/list/${educationList.id}`,
                    }}
                  >
                    <Pencil />
                  </Link>
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <button
                    type="button"
                    onClick={() => openModal(educationList.id)}
                  >
                    <Trash2 color="red" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationComponent totalPageNumber={totalPageNumber} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <p>Jeste li sigurni da želite obrisati ovu edukaciju?</p>
          <Button variant="destructive" onClick={handleDelete}>
            Da
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Ne
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EducationsListTable;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import PaginationComponent from "~/components/organisms/pagination/PaginationComponent";
import { useState, useEffect, type FC } from "react";
import type { FindEducationReturnDTO } from "~/server/services/education/education.repository";
import { translateEducationType } from "~/app/(pages)/educations/utils";
import { type EducationType } from "~/server/db/schema";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Trash2, Pencil } from "lucide-react";
import Modal from "~/components/organisms/modal/Modal";
import { Button } from "~/components/atoms/Button";

type Props = {
  data?: FindEducationReturnDTO[];
  totalPageNumber: number;
  refetch: () => void;
};

const EducationsListTable: FC<Props> = ({
  data: initialData,
  totalPageNumber,
  refetch,
}) => {
  const [data, setData] = useState<FindEducationReturnDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const deleteEducation = api.education.deleteById.useMutation();

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteEducation.mutateAsync({ id: selectedId });

      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete education:", error);
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
            {data?.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="md:table-cell">
                  {translateEducationType(license.type as EducationType)}
                </TableCell>
                <TableCell className="md:table-cell">{license.title}</TableCell>
                <TableCell className="md:table-cell">
                  {license.description}
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <Link
                    href={{
                      pathname: `/educations/${license.id}`,
                    }}
                  >
                    <Pencil />
                  </Link>
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <button onClick={() => openModal(license.id)}>
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

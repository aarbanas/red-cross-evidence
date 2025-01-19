import { type FC, useState } from "react";
import { type FindEducationTermReturnDTO } from "~/server/services/education/education.repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import PaginationComponent from "~/components/organisms/pagination/PaginationComponent";
import moment from "moment";
import { Button } from "~/components/atoms/Button";
import Modal from "~/components/organisms/modal/Modal";
import { api } from "~/trpc/react";

type Props = {
  data?: FindEducationTermReturnDTO[];
  totalPageNumber: number;
  refetch: () => void;
};

const EducationTermTable: FC<Props> = ({ data, totalPageNumber, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const deleteEducationTerm = api.education.term.deleteById.useMutation();

  const openModal = (id: string) => {
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteEducationTerm.mutateAsync({ id: selectedId });

      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  return (
    <>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:table-cell">Naziv</TableHead>
              <TableHead className="md:table-cell">Od</TableHead>
              <TableHead className="md:table-cell">Do</TableHead>
              <TableHead className="md:table-cell">Lokacija</TableHead>
              <TableHead className="md:table-cell">Broj sudionika</TableHead>
              <TableHead className="md:table-cell">Uredi</TableHead>
              <TableHead className="md:table-cell">Izbriši</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((educationTerm) => (
              <TableRow key={educationTerm.id}>
                <TableCell className="md:table-cell">
                  {educationTerm.title}
                </TableCell>
                <TableCell className="md:table-cell">
                  {moment(educationTerm.dateFrom).format("DD.MM.YYYY")}
                </TableCell>
                <TableCell className="md:table-cell">
                  {educationTerm.dateTo
                    ? moment(educationTerm.dateTo).format("DD.MM.YYYY")
                    : "-"}
                </TableCell>
                <TableCell className="md:table-cell">
                  {educationTerm.location}
                </TableCell>
                <TableCell className="md:table-cell">
                  {educationTerm.maxParticipants}
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <Link
                    href={{
                      pathname: `/educations/term/${educationTerm.id}`,
                    }}
                  >
                    <Pencil />
                  </Link>
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <button onClick={() => openModal(educationTerm.id)}>
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
          <p>Jeste li sigurni da želite obrisati ovaj termin edukacije?</p>
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

export default EducationTermTable;

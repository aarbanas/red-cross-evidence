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

type Props = {
  data?: FindEducationReturnDTO[];
  totalPageNumber: number;
};

const EducationsListTable: FC<Props> = ({
  data: initialData,
  totalPageNumber,
}) => {
  const [data, setData] = useState<FindEducationReturnDTO[]>([]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const deleteEducation = api.education.deleteById.useMutation();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite obrisati ovu edukaciju?",
    );
    if (!confirmed) return;

    try {
      await deleteEducation.mutateAsync({ id });
      // Update the state to reflect the deletion
      setData((prevData) =>
        prevData?.filter((education) => education.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
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
                  <button onClick={() => handleDelete(license.id)}>
                    <Trash2 color="red" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationComponent totalPageNumber={totalPageNumber} />
    </>
  );
};

export default EducationsListTable;

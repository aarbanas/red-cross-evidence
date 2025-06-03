import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import { Pencil } from "lucide-react";
import { type FindLicenseReturnDTO } from "~/server/services/license/license.repository";
import PaginationComponent from "~/components/organisms/pagination/PaginationComponent";
import { type FC } from "react";

type Props = {
  data?: FindLicenseReturnDTO[];
  totalPageNumber: number;
};

const LicencesTable: FC<Props> = ({ data, totalPageNumber }) => {
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
              <TableHead className="md:table-cell">Uredi</TableHead>
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
                <TableCell className="cursor-pointer md:table-cell">
                  <Pencil />
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

export default LicencesTable;

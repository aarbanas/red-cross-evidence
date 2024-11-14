import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import { CheckCircle2, Pencil, XCircle } from "lucide-react";
import PaginationComponent from "~/components/organisms/pagination/PaginationComponent";
import Link from "next/link";
import { type FindUserReturnDTO } from "~/server/services/user/user.repository";

type Props = {
  data?: FindUserReturnDTO[];
  totalPageNumber: number;
};

const UsersTable: React.FC<Props> = ({ data, totalPageNumber }) => {
  if (!data?.length) {
    return <div>Nema rezultata</div>;
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:table-cell">Ime</TableHead>
              <TableHead className="md:table-cell">Prezime</TableHead>
              <TableHead className="md:table-cell">Grad</TableHead>
              <TableHead className="md:table-cell">Status</TableHead>
              <TableHead className="md:table-cell">Uredi profil</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="md:table-cell">
                  {user.profile?.firstName}
                </TableCell>
                <TableCell className="md:table-cell">
                  {user.profile?.lastName}
                </TableCell>
                <TableCell className="md:table-cell">{user.city}</TableCell>
                <TableCell className="md:table-cell">
                  {user.active ? (
                    <CheckCircle2 color="rgb(22 163 74)" />
                  ) : (
                    <XCircle color="rgb(220 38 38)" />
                  )}
                </TableCell>
                <TableCell className="cursor-pointer md:table-cell">
                  <Link
                    href={{
                      pathname: `/users/${user.id}`,
                    }}
                  >
                    <Pencil />
                  </Link>
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

export default UsersTable;

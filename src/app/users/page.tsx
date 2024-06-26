"use client";
import MainLayout from "~/components/layout/mainLayout";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import { CheckCircle2, Pencil, XCircle } from "lucide-react";

const Users = () => {
  const { data } = api.user.find.useQuery({
    page: "0",
    limit: "10",
    sort: ["firstname:asc"],
  });
  if (!data?.length) return <div>Loading...</div>;

  return (
    <MainLayout headerChildren={<div>Test</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Lista volontera</h1>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="md:table-cell">Ime</TableHead>
                <TableHead className="md:table-cell">Prezime</TableHead>
                <TableHead className="md:table-cell">Email</TableHead>
                <TableHead className="md:table-cell">Status</TableHead>
                <TableHead className="md:table-cell">Uredi profil</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="md:table-cell">
                    {user?.profile?.firstName}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {user?.profile?.lastName}
                  </TableCell>
                  <TableCell className="md:table-cell">{user?.email}</TableCell>
                  <TableCell className="md:table-cell">
                    {user.active ? (
                      <CheckCircle2 color="#00ff04" />
                    ) : (
                      <XCircle color="#ff0000" />
                    )}
                  </TableCell>
                  <TableCell className="cursor-pointer md:table-cell">
                    <Pencil />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </MainLayout>
  );
};

export default Users;

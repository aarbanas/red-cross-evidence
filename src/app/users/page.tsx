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
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from "~/components/organisms/Pagination";
import { useState, useEffect } from "react";

const Users = () => {
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);

  const { data } = api.user.find.useQuery({
    page: page.toString(),
    limit: "10",
    sort: ["email:asc"],
    filter: { firstname: "test" },
  });

  useEffect(() => {
    if (data?.meta) {
      setTotalPageNumber(Math.ceil(data.meta.count / data.meta.limit));
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  const { data: users, meta } = data;

  return (
    <MainLayout headerChildren={<div>Test</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Lista volontera</h1>
        </div>

        {users?.length === 0 ? (
          "No users found"
        ) : (
          <>
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="md:table-cell">Ime</TableHead>
                    <TableHead className="md:table-cell">Prezime</TableHead>
                    <TableHead className="md:table-cell">Email</TableHead>
                    <TableHead className="md:table-cell">Status</TableHead>
                    <TableHead className="md:table-cell">
                      Uredi profil
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="md:table-cell">
                        {user?.profile?.firstName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {user?.profile?.lastName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {user?.email}
                      </TableCell>
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
            <Pagination>
              <PaginationContent>
                <PaginationPages
                  totalPageNumber={totalPageNumber}
                  currentPage={page + 1}
                  onChangePage={(pageNumber) => setPage(pageNumber)}
                  onPreviousPage={() => {
                    if (page === 0) return;
                    setPage(page - 1);
                  }}
                  onNextPage={() => {
                    if (page === totalPageNumber - 1) return;
                    setPage(page + 1);
                  }}
                />
              </PaginationContent>
            </Pagination>
          </>
        )}
      </main>
    </MainLayout>
  );
};

export default Users;

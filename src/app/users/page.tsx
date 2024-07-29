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
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import SearchInput from "~/components/atoms/SearchInput";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

// Define the types for user and API response
interface UserProfile {
  firstName: string;
  lastName: string;
}

interface FindUserReturnDTO {
  id: string;
  email: string;
  active: boolean | null;
  profile: UserProfile | null;
  createdAt: Date;
}

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const debouncedSearchTerm = useDebounce(filter, 500);

  const { data, isLoading, error } = api.user.find.useQuery({
    page: page.toString(),
    limit: "10",
    sort: ["email:asc"],
    filter: debouncedSearchTerm,
  });

  useEffect(() => {
    if (data?.meta) {
      setTotalPageNumber(Math.ceil(data.meta.count / data.meta.limit));
    }
  }, [data]);

  const onSearch = (key: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
    setPage(0);
  };

  const handleEditClick = (user: FindUserReturnDTO) => {
    router.push(`/users/${user.id}`);
  };

  return (
    <MainLayout headerChildren={<div>Pretraživanje i odabir volontera</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex gap-5">
          <SearchInput
            title={"Ime"}
            onSearch={onSearch}
            searchKey={"firstname"}
          />
          <SearchInput
            title={"Prezime"}
            onSearch={onSearch}
            searchKey={"lastname"}
          />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <div>Greška</div>}
        {data?.data.length === 0 ? (
          "Nema rezultata"
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
                  {data?.data?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="md:table-cell">
                        {user.profile?.firstName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {user.profile?.lastName}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {user.active ? (
                          <CheckCircle2 color="#00ff04" />
                        ) : (
                          <XCircle color="#ff0000" />
                        )}
                      </TableCell>
                      <TableCell
                        className="cursor-pointer md:table-cell"
                        onClick={() => handleEditClick(user)}
                      >
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
                  onChangePage={(pageNumber) => setPage(pageNumber - 1)}
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

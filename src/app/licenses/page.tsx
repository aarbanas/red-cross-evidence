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
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from "~/components/organisms/Pagination";
import { useState, useEffect } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import SearchInput from "~/components/atoms/SearchInput";
import { useDebounce } from "@uidotdev/usehooks";
import { Pencil } from "lucide-react";

const Licenses = () => {
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const debouncedSearchTerm = useDebounce(filter, 500);

  const { data, isLoading, error } = api.license.find.useQuery({
    page: page.toString(),
    limit: "10",
    sort: ["name:asc"],
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

  return (
    <MainLayout headerChildren={<div>Pretraživanje licenci</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex gap-5">
          <SearchInput title={"Tip"} onSearch={onSearch} searchKey={"type"} />
          <SearchInput title={"Ime"} onSearch={onSearch} searchKey={"name"} />
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
                    <TableHead className="md:table-cell">Tip</TableHead>
                    <TableHead className="md:table-cell">Ime</TableHead>
                    <TableHead className="md:table-cell">Opis</TableHead>
                    <TableHead className="md:table-cell">Uredi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.data?.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell className="md:table-cell">
                        {license.type}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {license.name}
                      </TableCell>
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

export default Licenses;

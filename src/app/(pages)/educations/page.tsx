"use client";

import MainLayout from "~/components/layout/mainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/organisms/Table";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import SearchInput from "~/components/atoms/SearchInput";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from "~/components/organisms/pagination/Pagination";

// TODO can be removed when trpc is implemented
type Education = {
  id: number;
  title: string;
  date: string;
  description: string;
  active: boolean;
};

const Educations = () => {
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const debouncedSearchTerm = useDebounce(filter, 500);

  //TODO needs to be replaced with trpc
  const [data, setData] = useState<Education[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = (key: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
    setPage(0);
  };

  return (
    <MainLayout headerChildren={<div>Educations</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex gap-5">
          <SearchInput
            title={"Naziv"}
            onSearch={onSearch}
            searchKey={"title"}
          />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <div>{error}</div>}
        {data?.length === 0 ? (
          "No results"
        ) : (
          <>
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="md:table-cell">Naziv</TableHead>
                    <TableHead className="md:table-cell">Datum</TableHead>
                    <TableHead className="md:table-cell">Status</TableHead>
                    <TableHead className="md:table-cell">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.map((education) => (
                    <TableRow key={education.id}>
                      <TableCell className="cursor-pointer md:table-cell">
                        {education.title}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {education.date}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        <div>
                          {education.active ? (
                            <CheckCircle2 color="#00ff04" />
                          ) : (
                            <XCircle color="#ff0000" />
                          )}
                        </div>
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

export default Educations;

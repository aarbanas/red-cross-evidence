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

const mockEducations = [
  { id: 1, title: "Перший захід", date: "2024-08-01", active: true },
  { id: 2, title: "Другий захід", date: "2024-09-15", active: false },
];

const Educations = () => {
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined
  );
  const debouncedSearchTerm = useDebounce(filter, 500);
  const [data, setData] = useState<typeof mockEducations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Фільтрація даних
      let filteredData = mockEducations;
      if (debouncedSearchTerm) {
        filteredData = filteredData.filter((education) => {
          return Object.entries(debouncedSearchTerm).every(
            ([key, value]) =>
              education[key as keyof typeof education]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase())
          );
        });
      }

      setTotalPageNumber(Math.ceil(filteredData.length / 10));
      setData(filteredData.slice(page * 10, (page + 1) * 10));
    } catch (err) {
      setError("Помилка при завантаженні даних");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearchTerm]);

  const onSearch = (key: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
    setPage(0);
  };

  return (
    <MainLayout headerChildren={<div>Educations</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex gap-5">
          <SearchInput title={"Name"} onSearch={onSearch} searchKey={"title"} />
          <SearchInput title={"Data"} onSearch={onSearch} searchKey={"date"} />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <div>{error}</div>}
        {data?.length === 0 ? (
          "Немає результатів"
        ) : (
          <>
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="md:table-cell">Назва</TableHead>
                    <TableHead className="md:table-cell">Дата</TableHead>
                    <TableHead className="md:table-cell">Статус</TableHead>
                    <TableHead className="md:table-cell">Редагування</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.map((education) => (
                    <TableRow key={education.id}>
                      <TableCell className="md:table-cell">
                        {education.title}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {education.date}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {education.active ? (
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

export default Educations;

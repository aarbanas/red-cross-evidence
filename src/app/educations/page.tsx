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
import { useState, useEffect } from "react";
import LoadingSpinner from "~/components/organisms/loadingSpinner/LoadingSpinner";
import SearchInput from "~/components/atoms/SearchInput";
import { useDebounce } from "@uidotdev/usehooks";

type Education = {
  id: number;
  title: string;
  date: string;
  description: string;
  active: boolean;
};

const initialEducations: Education[] = [
  { id: 1, title: "Prvi događaj", date: "2024-08-01", description: "Opis prvog događaja", active: true },
  { id: 2, title: "Drugi događaj", date: "2024-09-15", description: "Opis drugog događaja", active: false },
];

const Educations = () => {
  const [page, setPage] = useState<number>(0);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [filter, setFilter] = useState<Record<string, string> | undefined>(undefined);
  const debouncedSearchTerm = useDebounce(filter, 500);
  const [data, setData] = useState<Education[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [educations, setEducations] = useState<Education[]>(initialEducations);
  const [newEducationTitle, setNewEducationTitle] = useState<string>("");
  const [newEducationDescription, setNewEducationDescription] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      let filteredData = educations;
      if (debouncedSearchTerm) {
        filteredData = filteredData.filter((education) => {
          return Object.entries(debouncedSearchTerm).every(([key, value]) =>
            education[key as keyof Education]?.toString().toLowerCase().includes(value.toLowerCase())
          );
        });
      }

      setTotalPageNumber(Math.ceil(filteredData.length / 10));
      setData(filteredData.slice(page * 10, (page + 1) * 10));
    } catch (err) {
      setError("Error during data loading");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearchTerm, educations]);

  const onSearch = (key: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
    setPage(0);
  };

  const addEducation = () => {
    if (newEducationTitle.trim() === "" || newEducationDescription.trim() === "") {
      alert("Molim, unesite naziv i opis novog događaja.");
      return;
    }
  
    const newEducation: Education = {
      id: educations.length + 1,
      title: newEducationTitle || "",
      date: new Date().toISOString().split("T")[0] || "",
      description: newEducationDescription || "",
      active: false,
    };
  
    setEducations((prevEducations) => [...prevEducations, newEducation]);
    setNewEducationTitle(""); 
    setNewEducationDescription(""); 
  };

  const deleteEducation = (id: number) => {
    setEducations(educations.filter((education) => education.id !== id));
  };

  const toggleEducationStatus = (id: number) => {
    setEducations(
      educations.map((education) =>
        education.id === id ? { ...education, active: !education.active } : education
      )
    );
  };

  return (
    <MainLayout headerChildren={<div>Educations</div>}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex gap-5">
          <SearchInput title={"Naziv"} onSearch={onSearch} searchKey={"title"} />
          <SearchInput title={"Datum"} onSearch={onSearch} searchKey={"date"} />
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Naziv novog događaja"
            value={newEducationTitle}
            onChange={(e) => setNewEducationTitle(e.target.value)}
            className="p-2 border rounded-md"
          />
          <textarea
            placeholder="Opis novog događaja"
            value={newEducationDescription}
            onChange={(e) => setNewEducationDescription(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button onClick={addEducation} className="btn-primary">
            Dodati događaj
          </button>
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
                    <TableHead className="md:table-cell">Brisanje</TableHead>
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
                        <div onClick={() => toggleEducationStatus(education.id)}>
                          {education.active ? (
                            <CheckCircle2 color="#00ff04" />
                          ) : (
                            <XCircle color="#ff0000" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="md:table-cell flex gap-2">
                        <XCircle onClick={() => deleteEducation(education.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
};

export default Educations;

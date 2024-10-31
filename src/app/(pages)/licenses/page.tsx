"use client";
import MainLayout from "~/components/layout/mainLayout";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import LicencesSearch from "~/app/(pages)/licenses/_components/LicencesSearch";
import { useState } from "react";
import Licences from "~/app/(pages)/licenses/_components/Licences";

const LicencePage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <MainLayout headerChildren={<div>Licence</div>}>
      <LicencesSearch onSearch={handleSearch} />

      <PaginationProvider>
        <Licences filter={filter} />
      </PaginationProvider>
    </MainLayout>
  );
};

export default LicencePage;

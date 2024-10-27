"use client";
import { useState } from "react";
import MainLayout from "~/components/layout/mainLayout";
import UsersSearch from "~/app/(pages)/users/_components/UsersSearch";
import { PaginationProvider } from "~/components/organisms/pagination/PaginationContext";
import Users from "~/app/(pages)/users/_components/Users";

const UsersPage = () => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );

  const handleSearch = (newFilter: Record<string, string> | undefined) => {
    setFilter(newFilter);
  };

  return (
    <MainLayout headerChildren={<div>Volonteri</div>}>
      <UsersSearch onSearch={handleSearch} />

      <PaginationProvider>
        <Users filter={filter} />
      </PaginationProvider>
    </MainLayout>
  );
};

export default UsersPage;

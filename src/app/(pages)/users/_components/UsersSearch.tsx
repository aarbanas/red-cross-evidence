import React from "react";
import Dropdown from "~/components/atoms/Dropdown";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";
import { api } from "~/trpc/react";

type Props = {
  onSearch: (filter: Record<string, string> | undefined) => void;
};

const UsersSearch: React.FC<Props> = ({ onSearch }) => {
  const { handleSearch } = useSearch(onSearch);

  const { data, isLoading, error } = api.city.findUniqueCityNames.useQuery();
  const cityNames: string[] = data ? data.map((city) => city.name) : [];

  return (
    <div className="flex gap-5">
      <SearchInput
        title={"Ime"}
        onSearch={handleSearch}
        searchKey={"firstname"}
      />
      <SearchInput
        title={"Prezime"}
        onSearch={handleSearch}
        searchKey={"lastname"}
      />
      <Dropdown
        cityNames={cityNames}
        onSearch={handleSearch}
        searchKey={"city"}
      />
    </div>
  );
};

export default UsersSearch;

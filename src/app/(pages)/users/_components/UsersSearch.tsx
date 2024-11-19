import React from "react";
import Dropdown, { type DropdownOption } from "~/components/atoms/Dropdown";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
  cities?: DropdownOption[];
};

const UsersSearch: React.FC<Props> = ({ onSearch, cities }) => {
  const { handleSearch } = useSearch(onSearch);

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
      {cities?.length && (
        <Dropdown
          options={cities}
          label={"Grad"}
          onSearch={(key, value) => handleSearch(key, value, 0)}
          searchKey={"city"}
        />
      )}
    </div>
  );
};

export default UsersSearch;

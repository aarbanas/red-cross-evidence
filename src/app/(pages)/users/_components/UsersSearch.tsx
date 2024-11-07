import React from "react";
import Dropdown from "~/components/atoms/Dropdown";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";

type Props = {
  onSearch: (filter: Record<string, string> | undefined) => void;
  cityNames: string[] | undefined;
};

const UsersSearch: React.FC<Props> = ({ onSearch, cityNames }) => {
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
      {cityNames?.length && (
        <Dropdown
          values={cityNames}
          onSearch={(key, value) => handleSearch(key, value, 0)}
          searchKey={"city"}
        />
      )}
    </div>
  );
};

export default UsersSearch;

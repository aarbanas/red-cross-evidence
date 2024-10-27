import React from "react";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";

type Props = {
  onSearch: (filter: Record<string, string> | undefined) => void;
};

const UsersSearch: React.FC<Props> = ({ onSearch }) => {
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
    </div>
  );
};

export default UsersSearch;

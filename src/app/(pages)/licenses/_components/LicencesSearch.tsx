import React, { type FC } from "react";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";
import Dropdown, { type DropdownOption } from "~/components/atoms/Dropdown";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
  types?: DropdownOption[];
};

const LicencesSearch: FC<Props> = ({ onSearch, types }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      {types?.length && (
        <Dropdown
          options={types}
          onSearch={handleSearch}
          searchKey={"type"}
          label={"Tip"}
        />
      )}
      <SearchInput title={"Ime"} onSearch={handleSearch} searchKey={"name"} />
    </div>
  );
};

export default LicencesSearch;

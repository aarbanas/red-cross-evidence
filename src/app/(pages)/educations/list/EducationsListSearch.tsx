import React, { type FC } from "react";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";
import Dropdown, { type DropdownOption } from "~/components/atoms/Dropdown";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
  types?: DropdownOption[];
};

const EducationsListSearch: FC<Props> = ({ types, onSearch }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      {types?.length && (
        <Dropdown
          options={types}
          onSearch={handleSearch}
          searchKey={"type"}
          defaultValue={"Volunteers"}
          label={"Tip"}
        />
      )}
      <SearchInput
        title={"Naziv"}
        onSearch={handleSearch}
        searchKey={"title"}
      />
    </div>
  );
};

export default EducationsListSearch;

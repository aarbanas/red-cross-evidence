import React, { type FC } from "react";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";

type Props = {
  types: string[] | undefined;
  onSearch: (filter: Record<string, string> | undefined) => void;
};

const EducationsListSearch: FC<Props> = ({ types, onSearch }) => {
  const { handleSearch } = useSearch(onSearch);
  console.log("types", types);

  return (
    <div className="flex gap-5">
      <SearchInput title={"Tip"} onSearch={handleSearch} searchKey={"type"} />
      <SearchInput
        title={"Naziv"}
        onSearch={handleSearch}
        searchKey={"title"}
      />
    </div>
  );
};

export default EducationsListSearch;

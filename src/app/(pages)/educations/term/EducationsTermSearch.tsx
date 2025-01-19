import React, { type FC } from "react";
import useSearch from "~/hooks/useSearch";
import SearchInput from "~/components/atoms/SearchInput";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
};

const EducationsTermSearch: FC<Props> = ({ onSearch }) => {
  const { handleSearch } = useSearch(onSearch);
  return (
    <div className="flex gap-5">
      <SearchInput
        title={"Naziv"}
        onSearch={handleSearch}
        searchKey={"title"}
      />
    </div>
  );
};

export default EducationsTermSearch;

import React, { type FC } from "react";
import useSearch from "~/hooks/useSearch";
import SearchInput from "~/components/atoms/SearchInput";
import DateRangeFilter from "~/components/DateRangeFilter";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
};

const EducationsTermSearch: FC<Props> = ({ onSearch }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      <SearchInput
        column
        onSearch={handleSearch}
        searchKey={"title"}
        title={"Naziv"}
      />
      <DateRangeFilter onSearch={handleSearch} column />
    </div>
  );
};

export default EducationsTermSearch;

import React, { useState, useEffect } from "react";
import SearchInput from "~/components/atoms/SearchInput";
import { useDebounce } from "@uidotdev/usehooks";

type Props = {
  onSearch: (filter: Record<string, string> | undefined) => void;
};

const LicencesSearch: React.FC<Props> = ({ onSearch }) => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const debouncedSearchTerm = useDebounce(filter, 500);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (key: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
  };

  return (
    <div className="flex gap-5">
      <SearchInput title={"Tip"} onSearch={handleSearch} searchKey={"type"} />
      <SearchInput title={"Ime"} onSearch={handleSearch} searchKey={"name"} />
    </div>
  );
};

export default LicencesSearch;

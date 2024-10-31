import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

type UseSearchReturn = {
  filter: Record<string, string> | undefined;
  handleSearch: (key: string, value: string) => void;
};

const useSearch = (
  onSearch: (filter: Record<string, string> | undefined) => void,
): UseSearchReturn => {
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

  return { filter, handleSearch };
};

export default useSearch;

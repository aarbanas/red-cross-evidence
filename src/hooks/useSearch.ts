import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";

type UseSearchReturn = {
  filter: Record<string, string> | undefined;
  handleSearch: (key: string, value: string, debounceTime?: number) => void;
};

const useSearch = (
  onSearch: (filter: Record<string, string> | undefined) => void,
  defaultDebounceTime = 500,
): UseSearchReturn => {
  const [filter, setFilter] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const [debounceTime, setDebounceTime] = useState<number>(defaultDebounceTime);
  const debouncedSearchTerm = useDebounce(filter, debounceTime);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = useCallback(
    (key: string, value: string, debounceTime?: number) => {
      if (debounceTime !== undefined) {
        setDebounceTime(debounceTime);
      } else {
        setDebounceTime(defaultDebounceTime);
      }

      setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
    },
    [defaultDebounceTime],
  );

  return { filter, handleSearch };
};

export default useSearch;

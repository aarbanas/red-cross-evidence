import { useEffect } from "react";

const useResetPageOnFilterChange = (
  setPage: (page: number) => void,
  filter?: Record<string, string>,
) => {
  useEffect(() => {
    setPage(0);
  }, [filter, setPage]);
};

export default useResetPageOnFilterChange;

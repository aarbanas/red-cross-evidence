import { useState, useCallback, useEffect } from "react";

const useTotalPageNumber = <
  T extends { meta?: { count: number; limit: number } },
>(
  data: T | undefined,
) => {
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);

  const memoizedSetTotalPageNumber = useCallback(
    (count: number, limit: number) => {
      setTotalPageNumber(Math.ceil(count / limit));
    },
    [],
  );

  useEffect(() => {
    if (data?.meta) {
      memoizedSetTotalPageNumber(data.meta.count, data.meta.limit);
    }
  }, [data, memoizedSetTotalPageNumber]);

  return { totalPageNumber };
};

export default useTotalPageNumber;

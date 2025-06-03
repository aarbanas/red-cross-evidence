import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const usePagination = (filter?: Record<string, string>) => {
  const [filterMemo, setFilterMemo] = useState(filter);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("page", (newPage + 1).toString());

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [pathname, searchParams, router],
  );

  const page = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) - 1 : 0;
  }, [searchParams]);

  useEffect(() => {
    if (filter !== filterMemo) {
      handlePageChange(0);
      setFilterMemo(filter);
    }
  }, [handlePageChange, filter, filterMemo]);

  return {
    page,
    handlePageChange,
  };
};

export default usePagination;

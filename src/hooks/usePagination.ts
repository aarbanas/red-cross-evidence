import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const usePagination = (filter?: Record<string, string>) => {
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const _page = parseInt(searchParams.get("page") ?? "0");
    setPage(_page !== 0 ? _page - 1 : 0);
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", (newPage + 1).toString());

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    if (filter !== undefined) {
      handlePageChange(0);
    }
  }, [filter]);

  return { page, handlePageChange };
};

export default usePagination;

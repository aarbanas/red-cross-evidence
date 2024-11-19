import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from "~/components/organisms/pagination/Pagination";
import { usePagination } from "~/components/organisms/pagination/PaginationContext";
import type { FC } from "react";

type Props = {
  totalPageNumber: number;
};

const PaginationComponent: FC<Props> = ({ totalPageNumber }) => {
  const { page, setPage } = usePagination();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPages
          totalPageNumber={totalPageNumber}
          currentPage={page + 1}
          onChangePage={(pageNumber) => handlePageChange(pageNumber)}
          onPreviousPage={() => {
            if (page === 0) return;
            handlePageChange(page - 1);
          }}
          onNextPage={() => {
            if (page === totalPageNumber - 1) return;
            handlePageChange(page + 1);
          }}
        />
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

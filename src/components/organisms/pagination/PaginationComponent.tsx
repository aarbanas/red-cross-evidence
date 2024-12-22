import {
  Pagination,
  PaginationContent,
  PaginationPages,
} from "~/components/organisms/pagination/Pagination";
import type { FC } from "react";
import usePagination from "~/hooks/usePagination";

type Props = {
  totalPageNumber: number;
};

const PaginationComponent: FC<Props> = ({ totalPageNumber }) => {
  const { page, handlePageChange } = usePagination();

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

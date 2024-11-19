"use client";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from "react";

type PaginationContextType = {
  page: number;
  setPage: (page: number) => void;
};

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined,
);

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error("usePagination must be used within a PaginationProvider");
  }
  return context;
};

type PaginationProviderProps = {
  children: ReactNode;
};

export const PaginationProvider: FC<PaginationProviderProps> = ({
  children,
}) => {
  const [page, setPage] = useState(0);

  return (
    <PaginationContext.Provider value={{ page, setPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

import { createContext, useContext, useState, ReactNode } from "react";

type PaginationContextType = {
    page: number;
    setPage: (page: number) => void;
};

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

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

export const PaginationProvider: React.FC<PaginationProviderProps> = ({ children }) => {
    const [page, setPage] = useState(0);

    return (
        <PaginationContext.Provider value={{ page, setPage }}>
    {children}
    </PaginationContext.Provider>
);
};
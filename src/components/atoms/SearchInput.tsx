import React from "react";
import { Input } from "~/components/atoms/Input";
import { cn } from "../utils";

type Props = {
  title: string;
  searchKey: string;
  onSearch: (key: string, value: string) => void;
  column?: boolean;
};

const SearchInput: React.FC<Props> = ({
  title,
  column,
  searchKey,
  onSearch,
}) => {
  return (
    <div className={cn("flex gap-2", column && "flex-col")}>
      {title && <span>{title}:</span>}
      <Input
        className="h-6"
        type="search"
        onChange={(event) => {
          onSearch(searchKey, event.target.value);
        }}
      />
    </div>
  );
};

export default SearchInput;

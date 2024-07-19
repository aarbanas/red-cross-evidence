import React from "react";
import { Input } from "~/components/atoms/Input";

type Props = {
  title: string;
  searchKey: string;
  onSearch(key: string, value: string): void;
};

const SearchInput: React.FC<Props> = ({ title, searchKey, onSearch }) => {
  return (
    <div className="flex gap-2">
      <span>{title}:</span>
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

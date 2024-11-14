import React, { useState } from "react";

export type DropdownOption = {
  key: string;
  value: string;
};

type Props = {
  options: DropdownOption[];
  searchKey: string;
  onSearch: (key: string, value: string) => void;
};

const Dropdown: React.FC<Props> = ({ options, searchKey, onSearch }) => {
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <div className="flex gap-2">
      Grad:
      <select
        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          onSearch(searchKey, e.target.value);
        }}
      >
        <option value="" />
        {options.map((option, index) => (
          <option key={index} value={option.key}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

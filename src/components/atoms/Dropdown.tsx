import React, { useEffect, useState } from "react";

export type DropdownOption = {
  key: string;
  value: string;
};

type Props = {
  options: DropdownOption[];
  label: string;
  searchKey: string;
  defaultValue?: string;
  onSearch: (key: string, value: string) => void;
};

const Dropdown: React.FC<Props> = ({
  options,
  label,
  searchKey,
  defaultValue,
  onSearch,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");

  useEffect(() => {
    onSearch(searchKey, selectedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  return (
    <div className="flex gap-2">
      {label}
      <select
        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        {!defaultValue && <option value="" />}
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

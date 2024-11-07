import React, { useState } from "react";

type Props = {
  values: string[];
  searchKey: string;
  onSearch: (key: string, value: string) => void;
};

const Dropdown: React.FC<Props> = ({ values, searchKey, onSearch }) => {
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
        {values.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

import React, { useState } from "react";

type Props = {
  cityNames: string[];
  searchKey: string;
  onSearch(key: string, value: string): void;
};

const Dropdown: React.FC<Props> = ({ cityNames, searchKey, onSearch }) => {
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <div className="flex gap-2">
      Grad:
      <select
        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none"
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          onSearch(searchKey, e.target.value);
        }}
      >
        <option value="" />
        {cityNames.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { api } from "~/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";

type Props = {
  id: string;
  label: string;
  cityFieldName: string;
  postalCodeFieldName: string;
};

type CityOption = {
  id: string;
  name: string;
  postalCode: string | null;
};

const FormCitySearch: React.FC<Props> = ({
  id,
  label,
  cityFieldName,
  postalCodeFieldName,
}) => {
  const { setValue, watch } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cityValue = watch(cityFieldName) as string;

  // Search cities when debounced search term changes
  const { data: cities, isLoading } = api.city.searchCities.useQuery(
    { searchTerm: debouncedSearchTerm },
    {
      enabled: debouncedSearchTerm.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setValue(cityFieldName, value);

    if (value !== selectedCity?.name) {
      setSelectedCity(null);
      setValue(postalCodeFieldName, "");
    }

    setIsOpen(value.length > 0);
  };

  // Handle city selection
  const handleCitySelect = (city: CityOption) => {
    setSelectedCity(city);
    setSearchTerm(city.name);
    setValue(cityFieldName, city.name);
    setValue(postalCodeFieldName, city.postalCode ?? "");
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search term when form value changes externally
  useEffect(() => {
    const currentCityValue = String(cityValue || "");
    if (currentCityValue !== searchTerm) {
      setSearchTerm(currentCityValue);
    }
  }, [cityValue, searchTerm]);

  return (
    <div className="relative flex w-full flex-col gap-2" ref={dropdownRef}>
      <label htmlFor={id} className="mb-2 font-light text-gray-500">
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
        placeholder="Počnite tipkati naziv grada..."
        className="w-full rounded-md border-none bg-gray-100 px-3 py-4 shadow-lg focus:border-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40"
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Pretražujem gradove...
            </div>
          )}

          {!isLoading && cities && cities.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Nema rezultata za &quot;{debouncedSearchTerm}&quot;
            </div>
          )}

          {!isLoading && cities && cities.length > 0 && (
            <>
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="cursor-pointer border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-100"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{city.name}</span>
                    {city.postalCode && (
                      <span className="text-xs text-gray-500">
                        {city.postalCode}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormCitySearch;

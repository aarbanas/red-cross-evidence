"use client";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { api } from "~/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";
import { type SearchAddressReturnDTO } from "~/server/services/address/types";

type Props = {
  id: string;
  label: string;
  streetFieldName: string;
  streetNumberFieldName: string;
  cityId?: string;
};

const FormStreetSearch: React.FC<Props> = ({
  id,
  label,
  streetFieldName,
  streetNumberFieldName,
  cityId,
}) => {
  const { setValue, watch } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Always expect string values now
  const streetValue = watch(streetFieldName) as string | undefined;
  const streetNumberValue = watch(streetNumberFieldName) as string | undefined;

  // Initialize searchTerm from existing form values on mount
  useEffect(() => {
    if (!isInitialized) {
      if (streetValue) {
        setSearchTerm(streetValue);
      }
      setIsInitialized(true);
    }
  }, [streetValue, isInitialized]);

  // Search addresses when debounced search term changes and cityId is available
  const { data: addresses, isLoading } = api.address.searchAddresses.useQuery(
    { searchTerm: debouncedSearchTerm, cityId: cityId ?? "" },
    {
      enabled: debouncedSearchTerm.length > 0 && !!cityId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Always open dropdown when typing (if cityId is available)
    setIsOpen(value.length > 0 && !!cityId);

    // Always store the typed value as string
    setValue(streetFieldName, value);

    // Clear street number when typing new content (unless it's the current street number)
    if (!streetNumberValue || streetNumberValue.trim() === "") {
      setValue(streetNumberFieldName, "");
    }
  };

  // Handle address selection from dropdown
  const handleAddressSelect = (address: SearchAddressReturnDTO) => {
    setSearchTerm(address.street);
    setValue(streetFieldName, address.street); // Store only the street name as string
    setValue(streetNumberFieldName, address.streetNumber ?? "");
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

  // Update search term when form value changes externally (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    if (streetValue && streetValue !== searchTerm) {
      setSearchTerm(streetValue);
    }
  }, [streetValue, searchTerm, isInitialized]);

  // Clear search when cityId changes
  useEffect(() => {
    if (isInitialized && !cityId) {
      // Clear when no city is selected
      setSearchTerm("");
      setValue(streetFieldName, "");
      setValue(streetNumberFieldName, "");
      setIsOpen(false);
    }
  }, [cityId, setValue, streetFieldName, streetNumberFieldName, isInitialized]);

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
        onFocus={() => searchTerm.length > 0 && !!cityId && setIsOpen(true)}
        placeholder={"Počnite tipkati naziv ulice..."}
        className="w-full rounded-md border-none bg-gray-100 px-3 py-4 shadow-lg focus:border-red-400 focus:ring focus:ring-red-300/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      {/* Dropdown */}
      {isOpen && cityId && (
        <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Pretražujem adrese...
            </div>
          )}

          {!isLoading &&
            addresses?.length === 0 &&
            debouncedSearchTerm.length > 0 && (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nema rezultata za &quot;{debouncedSearchTerm}&quot;
                </div>
              </div>
            )}

          {!isLoading && addresses && addresses.length > 0 && (
            <>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="cursor-pointer border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-100"
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {address.street}
                    </span>
                    {address.streetNumber && (
                      <span className="text-xs text-gray-500">
                        {address.streetNumber}
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

export default FormStreetSearch;

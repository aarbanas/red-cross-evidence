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

  const streetValue = watch(streetFieldName) as
    | SearchAddressReturnDTO
    | string
    | undefined;

  // Initialize searchTerm from existing form values on mount
  useEffect(() => {
    if (!isInitialized) {
      let displayValue = "";

      if (streetValue) {
        if (typeof streetValue === "string") {
          displayValue = streetValue;
        } else if (
          streetValue &&
          typeof streetValue === "object" &&
          "street" in streetValue
        ) {
          displayValue = streetValue.street;
        }

        if (displayValue) {
          setSearchTerm(displayValue);
        }
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

    // Just store the typed value as string - let the API search handle matching
    setValue(streetFieldName, value);

    // Clear street number when typing new content
    setValue(streetNumberFieldName, "");
  };

  // Handle address selection from dropdown
  const handleAddressSelect = (address: SearchAddressReturnDTO) => {
    setSearchTerm(address.street);
    setValue(streetFieldName, address); // Store full SearchAddressReturnDTO
    setValue(streetNumberFieldName, address.streetNumber ?? "");
    setIsOpen(false);
  };

  // Handle creating new address
  const handleCreateNewAddress = () => {
    setValue(streetFieldName, searchTerm); // Store as string
    setValue(streetNumberFieldName, "");
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

    const currentStreetValue = streetValue;
    let displayValue = "";

    if (typeof currentStreetValue === "string") {
      displayValue = currentStreetValue;
    } else if (
      currentStreetValue &&
      typeof currentStreetValue === "object" &&
      "street" in currentStreetValue
    ) {
      displayValue = currentStreetValue.street;
    }

    if (displayValue !== searchTerm) {
      setSearchTerm(displayValue);
    }
  }, [streetValue, searchTerm, isInitialized]);

  // Clear search when cityId changes, but preserve values if cityId is restored to the same value
  useEffect(() => {
    if (isInitialized && cityId) {
      // Only clear if we don't have existing values that match the current cityId
      const currentStreetValue = streetValue;
      if (
        currentStreetValue &&
        typeof currentStreetValue === "object" &&
        "cityId" in currentStreetValue
      ) {
        // If the existing street value doesn't match the current cityId, clear it
        if (currentStreetValue.cityId !== cityId) {
          setSearchTerm("");
          setValue(streetFieldName, "");
          setValue(streetNumberFieldName, "");
        }
      }
      setIsOpen(false);
    } else if (isInitialized && !cityId) {
      // Clear when no city is selected
      setSearchTerm("");
      setValue(streetFieldName, "");
      setValue(streetNumberFieldName, "");
      setIsOpen(false);
    }
  }, [
    cityId,
    setValue,
    streetFieldName,
    streetNumberFieldName,
    isInitialized,
    streetValue,
  ]);

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
        placeholder={"Počnite tipkati naziv ulice..."}
        className="w-full rounded-md border-none bg-gray-100 px-3 py-4 shadow-lg focus:border-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40 disabled:cursor-not-allowed disabled:opacity-50"
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
            addresses &&
            addresses.length === 0 &&
            debouncedSearchTerm.length > 0 && (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nema rezultata za &quot;{debouncedSearchTerm}&quot;
                </div>
                <div
                  className="cursor-pointer border-t border-gray-200 bg-blue-50 px-3 py-2 hover:bg-blue-100"
                  onClick={handleCreateNewAddress}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-700">
                      + Stvori novu ulicu: &quot;{searchTerm}&quot;
                    </span>
                  </div>
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
              {debouncedSearchTerm.length > 0 &&
                !addresses.some(
                  (address) =>
                    address.street.toLowerCase() ===
                    debouncedSearchTerm.toLowerCase(),
                ) && (
                  <div
                    className="cursor-pointer border-t border-gray-200 bg-blue-50 px-3 py-2 hover:bg-blue-100"
                    onClick={handleCreateNewAddress}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-700">
                        + Stvori novu ulicu: &quot;{searchTerm}&quot;
                      </span>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormStreetSearch;

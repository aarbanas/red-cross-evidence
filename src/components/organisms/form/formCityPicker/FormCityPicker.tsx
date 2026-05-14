import { useDebounce } from '@uidotdev/usehooks';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { api } from '~/trpc/react';

type Props = {
  id: string;
  label: string;
  fieldName: string;
  countryId: string;
  initialCityName?: string;
};

const FormCityPicker: React.FC<Props> = ({
  id,
  label,
  fieldName,
  countryId,
  initialCityName,
}) => {
  const { setValue } = useFormContext();
  const [searchTerm, setSearchTerm] = useState(initialCityName ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: cities, isLoading } = api.city.searchCities.useQuery(
    { searchTerm: debouncedSearchTerm, countryId },
    {
      enabled: debouncedSearchTerm.length > 0 && !!countryId,
      staleTime: 5 * 60 * 1000,
    },
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setValue(fieldName, '');
    }

    setIsOpen(value.length > 0);
  };

  const handleCitySelect = (city: { id: string; name: string }) => {
    setSearchTerm(city.name);
    setValue(fieldName, city.id);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-1" ref={dropdownRef}>
      <label htmlFor={id} className="font-medium text-sm">
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
        placeholder="Počnite tipkati naziv grada..."
        className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
      />

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-gray-500 text-sm">
              Pretražujem gradove...
            </div>
          )}

          {!isLoading &&
            cities?.length === 0 &&
            debouncedSearchTerm.length > 0 && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Nema rezultata za &quot;{debouncedSearchTerm}&quot;
              </div>
            )}

          {!isLoading &&
            cities &&
            cities.length > 0 &&
            cities.map((city) => (
              <button
                type="button"
                key={city.id}
                className="w-full cursor-pointer border-gray-100 border-b px-3 py-2 text-left last:border-b-0 hover:bg-gray-100"
                onClick={() => handleCitySelect(city)}
              >
                <span className="font-medium text-sm">{city.name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default FormCityPicker;

import { useDebounce } from '@uidotdev/usehooks'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SearchCityReturnDTO } from '~/server/services/city/city.repository'
import { api } from '~/trpc/react'

type Props = {
  id: string
  label: string
  cityFieldName: string
  postalCodeFieldName: string
  countryId: string
}

const FormCitySearch: React.FC<Props> = ({
  id,
  label,
  cityFieldName,
  postalCodeFieldName,
  countryId,
}) => {
  const { setValue, watch } = useFormContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const cityValue = watch(cityFieldName) as
    | SearchCityReturnDTO
    | string
    | undefined

  // Search cities when debounced search term changes
  const { data: cities, isLoading } = api.city.searchCities.useQuery(
    { searchTerm: debouncedSearchTerm, countryId },
    {
      enabled: debouncedSearchTerm.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Check if current value matches a found city
    const matchingCity = cities?.find((city) => city.name === value)

    if (matchingCity) {
      // City found in DB - store SearchCityReturnDTO
      setValue(cityFieldName, matchingCity)
      setValue(postalCodeFieldName, matchingCity.postalCode ?? '')
    } else {
      // City not found - store as string for new city creation
      // setSelectedCity(null);
      setValue(cityFieldName, value)
      setValue(postalCodeFieldName, '')
    }

    setIsOpen(value.length > 0)
  }

  // Handle city selection from dropdown
  const handleCitySelect = (city: SearchCityReturnDTO) => {
    // setSelectedCity(city);
    setSearchTerm(city.name)
    setValue(cityFieldName, city) // Store full SearchCityReturnDTO
    setValue(postalCodeFieldName, city.postalCode ?? '')
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update search term when form value changes externally
  useEffect(() => {
    const currentCityValue = cityValue
    let displayValue = ''

    if (typeof currentCityValue === 'string') {
      displayValue = currentCityValue
    } else if (
      currentCityValue &&
      typeof currentCityValue === 'object' &&
      'name' in currentCityValue
    ) {
      displayValue = currentCityValue.name
    }

    if (displayValue !== searchTerm) {
      setSearchTerm(displayValue)
    }
  }, [cityValue, searchTerm])

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
        className="w-full rounded-md border-none bg-gray-100 px-3 py-4 shadow-lg focus:border-red-400 focus:ring focus:ring-red-300/40 focus:outline-none"
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Pretražujem gradove...
            </div>
          )}

          {!isLoading &&
            cities?.length === 0 &&
            debouncedSearchTerm.length > 0 && (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nema rezultata za &quot;{debouncedSearchTerm}&quot;
                </div>
              </div>
            )}

          {!isLoading &&
            cities &&
            cities.length > 0 &&
            cities.map((city) => (
              <button
                type="button"
                key={city.id}
                className="w-full cursor-pointer border-b border-gray-100 px-3 py-2 text-left last:border-b-0 hover:bg-gray-100"
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
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default FormCitySearch

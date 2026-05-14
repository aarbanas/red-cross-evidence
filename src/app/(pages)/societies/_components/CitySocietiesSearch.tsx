import type { FC } from 'react';
import Dropdown, { type DropdownOption } from '~/components/atoms/Dropdown';
import SearchInput from '~/components/atoms/SearchInput';
import useSearch from '~/hooks/useSearch';

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
  societies?: DropdownOption[];
};

const CitySocietiesSearch: FC<Props> = ({ onSearch, societies }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      {societies?.length && (
        <Dropdown
          options={societies}
          onSearch={handleSearch}
          searchKey={'societyId'}
          label={'Društvo'}
        />
      )}

      <SearchInput title="Naziv" onSearch={handleSearch} searchKey="name" />
    </div>
  );
};

export default CitySocietiesSearch;

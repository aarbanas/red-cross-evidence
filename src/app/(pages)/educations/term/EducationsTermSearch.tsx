import type { FC } from 'react';
import SearchInput from '~/components/atoms/SearchInput';
import DateRangeFilter from '~/components/DateRangeFilter';
import useSearch from '~/hooks/useSearch';

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
};

const EducationsTermSearch: FC<Props> = ({ onSearch }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      <SearchInput
        column
        onSearch={handleSearch}
        searchKey={'title'}
        title={'Naziv'}
      />
      <DateRangeFilter onSearch={handleSearch} column />
    </div>
  );
};

export default EducationsTermSearch;

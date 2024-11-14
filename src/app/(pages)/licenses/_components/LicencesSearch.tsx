import { type FC } from "react";
import SearchInput from "~/components/atoms/SearchInput";
import useSearch from "~/hooks/useSearch";

type Props = {
  onSearch: (filter?: Record<string, string>) => void;
};

const LicencesSearch: FC<Props> = ({ onSearch }) => {
  const { handleSearch } = useSearch(onSearch);

  return (
    <div className="flex gap-5">
      <SearchInput title={"Tip"} onSearch={handleSearch} searchKey={"type"} />
      <SearchInput title={"Ime"} onSearch={handleSearch} searchKey={"name"} />
    </div>
  );
};

export default LicencesSearch;

import cityRepository, {
  type FindCityNameReturnDTO,
  type SearchCityReturnDTO,
} from "~/server/services/city/city.repository";

const cityService = {
  findUniqueCityNames: async (): Promise<FindCityNameReturnDTO[]> => {
    return cityRepository.findUniqueCityNames();
  },
  searchCities: async (searchTerm: string): Promise<SearchCityReturnDTO[]> => {
    return cityRepository.searchCities(searchTerm);
  },
};

export default cityService;

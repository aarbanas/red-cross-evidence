import cityRepository, {
  type FindCityNameReturnDTO,
} from "~/server/services/city/city.repository";

const cityService = {
  findUniqueCityNames: async (): Promise<FindCityNameReturnDTO[]> => {
    return cityRepository.findUniqueCityNames();
  },
};

export default cityService;

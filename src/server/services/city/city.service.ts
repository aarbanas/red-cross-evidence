import cityRepository from "~/server/services/city/city.repository";

const cityService = {
  findUniqueCityNames: async () => {
    return cityRepository.findUniqueCityNames();
  },
};

export default cityService;

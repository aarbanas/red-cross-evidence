import countryRepository from "~/server/services/country/country.repository";

const countryService = {
  getAllCountries: async () => {
    const countries = await countryRepository.getAllCountries();
    if (!countries?.length) {
      throw new Error("No countries found");
    }

    // Find and move "Hrvatska" to first position
    const croatiaIndex = countries.findIndex(
      (country) => country.name === "Hrvatska",
    );
    if (croatiaIndex > 0) {
      const croatia = countries.splice(croatiaIndex, 1)[0];
      countries.unshift(croatia!);
    }

    return countries;
  },
};

export default countryService;

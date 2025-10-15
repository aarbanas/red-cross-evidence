export type FindAddressQuery = {
  street: string;
};

export type SearchAddressQuery = {
  searchTerm: string;
  cityId: string;
};

export type SearchAddressReturnDTO = {
  id: string;
  street: string;
  streetNumber: string | null;
  cityId: string | null;
};

import countryRepository from '@/server/services/country/country.repository';
import countryService from './country.service';

jest.mock('@/server/services/country/country.repository', () => ({
  __esModule: true,
  default: { getAllCountries: jest.fn() },
}));

describe('countryService.getAllCountries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when repository returns an empty array', async () => {
    jest.mocked(countryRepository.getAllCountries).mockResolvedValue([]);

    await expect(countryService.getAllCountries()).rejects.toThrow(
      'No countries found',
    );
  });

  it('moves Hrvatska to first position when it is not already first', async () => {
    jest.mocked(countryRepository.getAllCountries).mockResolvedValue([
      { id: '1', name: 'Austrija' },
      { id: '2', name: 'Bosna i Hercegovina' },
      { id: '3', name: 'Hrvatska' },
    ] as never);

    const result = await countryService.getAllCountries();

    expect(result[0]?.name).toBe('Hrvatska');
    expect(result).toHaveLength(3);
  });

  it('keeps Hrvatska first when it is already at index 0', async () => {
    jest.mocked(countryRepository.getAllCountries).mockResolvedValue([
      { id: '3', name: 'Hrvatska' },
      { id: '1', name: 'Austrija' },
    ] as never);

    const result = await countryService.getAllCountries();

    expect(result[0]?.name).toBe('Hrvatska');
    expect(result).toHaveLength(2);
  });

  it('returns countries in original order when Hrvatska is not in the list', async () => {
    const countries = [
      { id: '1', name: 'Austrija' },
      { id: '2', name: 'Bosna i Hercegovina' },
    ];
    jest
      .mocked(countryRepository.getAllCountries)
      .mockResolvedValue(countries as never);

    const result = await countryService.getAllCountries();

    expect(result).toEqual(countries);
  });
});

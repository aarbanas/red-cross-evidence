import addressRepository from '~/server/services/address/address.repository';
import cityRepository from '~/server/services/city/city.repository';
import userRepository from '~/server/services/user/user.repository';
import userService from './user.service';

jest.mock('~/server/services/city/city.repository', () => ({
  __esModule: true,
  default: { getOrCreate: jest.fn() },
}));

jest.mock('~/server/services/address/address.repository', () => ({
  __esModule: true,
  default: { getOrCreate: jest.fn() },
}));

jest.mock('~/server/services/user/user.repository', () => ({
  __esModule: true,
  default: { create: jest.fn(), find: jest.fn(), findById: jest.fn() },
}));

jest.mock('~/server/utils/password', () => ({
  generateRandomHashedPassword: jest.fn().mockResolvedValue({
    password: 'random-password',
    hashedPassword: 'hashed-password',
  }),
}));

const baseData = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    oib: '12345678903',
    sex: 'M',
    email: 'john@example.com',
  },
  workStatus: { status: 'EMPLOYED' },
  size: { clothingSize: 'M', shoeSize: '42' },
  skills: {},
};

const baseAddress = {
  type: 'permanent_residence',
  street: 'Main St',
  streetNumber: '1',
  city: 'Zagreb',
  postalCode: '10000',
  country: 'country-id',
  isPrimary: true,
};

describe('userService.create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws and skips user creation when shoe size is not a number', async () => {
    const data = {
      ...baseData,
      size: { ...baseData.size, shoeSize: 'abc' },
      addresses: [baseAddress],
    };

    await expect(userService.create(data as never)).rejects.toThrow(
      'Shoe size must be a valid number',
    );
    expect(jest.mocked(userRepository.create)).not.toHaveBeenCalled();
  });

  it('calls cityRepository.getOrCreate when city is a string', async () => {
    jest
      .mocked(cityRepository.getOrCreate)
      .mockResolvedValue({ id: 'city-1', name: 'Zagreb' });
    jest
      .mocked(addressRepository.getOrCreate)
      .mockResolvedValue({ id: 'address-1' });

    const data = { ...baseData, addresses: [baseAddress] };

    await userService.create(data as never);

    expect(jest.mocked(cityRepository.getOrCreate)).toHaveBeenCalledWith({
      name: 'Zagreb',
      postalCode: '10000',
      countryId: 'country-id',
    });
  });

  it('does not call cityRepository.getOrCreate when city is an object', async () => {
    jest
      .mocked(addressRepository.getOrCreate)
      .mockResolvedValue({ id: 'address-1' });

    const data = {
      ...baseData,
      addresses: [
        {
          ...baseAddress,
          city: { id: 'city-1', name: 'Zagreb', postalCode: '10000' },
        },
      ],
    };

    await userService.create(data as never);

    expect(jest.mocked(cityRepository.getOrCreate)).not.toHaveBeenCalled();
  });

  it('throws and skips user creation when cityRepository.getOrCreate returns no id', async () => {
    jest.mocked(cityRepository.getOrCreate).mockResolvedValue(undefined);

    const data = { ...baseData, addresses: [baseAddress] };

    await expect(userService.create(data as never)).rejects.toThrow(
      'Failed to create new city',
    );
    expect(jest.mocked(userRepository.create)).not.toHaveBeenCalled();
  });

  it('throws and skips user creation when addressRepository.getOrCreate returns no id', async () => {
    jest
      .mocked(cityRepository.getOrCreate)
      .mockResolvedValue({ id: 'city-1', name: 'Zagreb' });
    jest.mocked(addressRepository.getOrCreate).mockResolvedValue(undefined);

    const data = { ...baseData, addresses: [baseAddress] };

    await expect(userService.create(data as never)).rejects.toThrow(
      'Failed to create new address',
    );
    expect(jest.mocked(userRepository.create)).not.toHaveBeenCalled();
  });

  it('calls userRepository.create with resolved address IDs on success', async () => {
    jest
      .mocked(cityRepository.getOrCreate)
      .mockResolvedValue({ id: 'city-1', name: 'Zagreb' });
    jest
      .mocked(addressRepository.getOrCreate)
      .mockResolvedValue({ id: 'address-1' });

    const data = { ...baseData, addresses: [baseAddress] };

    await userService.create(data as never);

    expect(jest.mocked(userRepository.create)).toHaveBeenCalledWith(
      data,
      'hashed-password',
      [{ addressId: 'address-1', isPrimary: true }],
    );
  });
});

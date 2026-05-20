import licenseRepository from '~/server/services/license/license.repository';
import licenseService from './license.service';

jest.mock('~/server/services/license/license.repository', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findUniqueTypes: jest.fn(),
    deleteById: jest.fn(),
  },
}));

const baseFormData = { type: 'A' };

describe('licenseService name prettification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('collapses multiple spaces into a single space', async () => {
    await licenseService.create({ ...baseFormData, name: 'First  Aid' });

    expect(jest.mocked(licenseRepository.create)).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'First Aid' }),
    );
  });

  it('trims leading and trailing spaces', async () => {
    await licenseService.create({ ...baseFormData, name: '  First Aid  ' });

    expect(jest.mocked(licenseRepository.create)).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'First Aid' }),
    );
  });

  it('capitalizes the first letter', async () => {
    await licenseService.create({ ...baseFormData, name: 'first aid' });

    expect(jest.mocked(licenseRepository.create)).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'First aid' }),
    );
  });

  it('applies all transformations together', async () => {
    await licenseService.create({ ...baseFormData, name: '  first  aid  ' });

    expect(jest.mocked(licenseRepository.create)).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'First aid' }),
    );
  });

  it('applies the same transformations on update', async () => {
    await licenseService.update({ ...baseFormData, name: '  first  aid  ' });

    expect(jest.mocked(licenseRepository.update)).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'First aid' }),
    );
  });
});

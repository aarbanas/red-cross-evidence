import { and, count, desc, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '~/server/db';
import {
  type AddressType,
  addresses,
  type ClothingSize,
  cities,
  countries,
  type EducationLevel,
  equipment,
  type LanguageLevel,
  languages,
  profileEquipment,
  profileSkills,
  profiles,
  profilesAddresses,
  profilesLanguages,
  profilesLicences,
  type Sex,
  sizes,
  type UserType,
  users,
  type WorkStatus,
  workStatuses,
} from '~/server/db/schema';
import { prepareOrderBy, prepareWhere } from '~/server/db/utility';
import type { FindQueryDTO, FindReturnDTO } from '~/server/db/utility/types';
import type {
  CreateUserAddressIdsDTO,
  CreateUserDTO,
} from '~/server/services/user/types';

export type FindUserReturnDTO = {
  id: string;
  email: string;
  active: boolean | null;
  createdAt: Date;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  city: string | null;
};

enum SortableKeys {
  ID = 'id',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  EMAIL = 'email',
  CITY = 'city',
  COUNTRY = 'country',
  ACTIVE = 'active',
}

enum FilterableKeys {
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  EMAIL = 'email',
  CITY = 'city',
}

const mapFilterableKeyToConditional = (
  key: string,
  value: string,
): SQL | undefined => {
  if (
    key === FilterableKeys.FIRSTNAME.valueOf() ||
    key === FilterableKeys.LASTNAME.valueOf()
  )
    return ilike(mapKeyToColumn(key as FilterableKeys), `${value}%`);

  if (
    key === FilterableKeys.EMAIL.valueOf() ||
    (key === FilterableKeys.CITY.valueOf() && value !== '')
  )
    return eq(mapKeyToColumn(key), value);

  return undefined;
};

const mapKeyToColumn = (key?: string) => {
  switch (key) {
    case SortableKeys.ID:
      return users.id;
    case SortableKeys.FIRSTNAME:
      return profiles.firstName;
    case SortableKeys.LASTNAME:
      return profiles.lastName;
    case SortableKeys.EMAIL:
      return users.email;
    case SortableKeys.ACTIVE:
      return users.active;
    case SortableKeys.CITY:
      return cities.id;
    default:
      return users.id;
  }
};

const userRepository = {
  find: async (data: FindQueryDTO) => {
    const { page, limit, sort, filter } = data;
    const orderBy = prepareOrderBy(
      mapKeyToColumn,
      SortableKeys,
      users.createdAt,
      sort,
    );
    const where = prepareWhere(
      filter,
      FilterableKeys,
      mapFilterableKeyToConditional,
    );

    const { totalCount, returnData } = await db.transaction(
      async (tx): Promise<FindReturnDTO<FindUserReturnDTO>> => {
        const [totalCount] = await tx
          .select({ count: count() })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id))
          .leftJoin(cities, eq(addresses.cityId, cities.id))
          .where(where);

        const returnData = await tx
          .select({
            id: users.id,
            email: users.email,
            active: users.active,
            createdAt: users.createdAt,
            profile: {
              id: profiles.id,
              firstName: profiles.firstName,
              lastName: profiles.lastName,
            },
            city: cities.name,
          })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .leftJoin(
            profilesAddresses,
            and(
              eq(profiles.id, profilesAddresses.profileId),
              eq(profilesAddresses.isPrimary, true),
            ),
          )
          .leftJoin(addresses, eq(profilesAddresses.addressId, addresses.id)) // Corrected join condition
          .leftJoin(cities, eq(addresses.cityId, cities.id))
          .where(where)
          .orderBy(...orderBy)
          .limit(limit ?? 10)
          .offset(page ? Number(page) * (limit ?? 10) : 0);

        return { totalCount: totalCount?.count ?? 0, returnData };
      },
    );

    return {
      data: returnData,
      meta: {
        count: totalCount,
        limit: limit ?? 10,
      },
    };
  },
  findById: async (id: string) => {
    return db
      .select({
        id: users.id,
        email: users.email,
        active: users.active,
        profile: {
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
        },
      })
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .execute();
  },
  create: async (
    data: CreateUserDTO,
    password: string,
    addressIdCreationData: CreateUserAddressIdsDTO[],
  ) => {
    return db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx
        .insert(users)
        .values({
          email: data.profile.email,
          active: true,
          type: data.profile.type,
          password,
        })
        .returning({ id: users.id });
      if (!newUser) {
        throw new Error('Failed to create user');
      }

      // Insert profile (pass user id)
      const [newProfile] = await tx
        .insert(profiles)
        .values({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          oib: data.profile.oib,
          sex: data.profile.sex,
          birthDate: data.profile.birthDate,
          birthPlace: data.profile.birthPlace,
          parentName: data.profile.parentName,
          nationality: data.profile.nationality,
          phone: data.profile.phone,
          societyId: data.profile.societyId || null,
          citySocietyId: data.profile.citySocietyId || null,
          userId: newUser.id,
        })
        .returning({ id: profiles.id });
      if (!newProfile) {
        throw new Error('Failed to create profile');
      }

      // Insert size (pass profile id)
      await tx.insert(sizes).values({
        shoeSize: Number(data.size.shoeSize),
        clothingSize: data.size.clothingSize,
        height: data.size.height,
        weight: data.size.weight,
        profileId: newProfile.id,
      });

      // Insert work status (pass profile id)
      await tx.insert(workStatuses).values({
        status: data.workStatus.status,
        profession: data.workStatus.profession,
        institution: data.workStatus.institution,
        educationLevel: data.workStatus.educationLevel,
        profileId: newProfile.id,
      });

      // Insert profile addresses (profile id + address ids, mark primary)
      await tx.insert(profilesAddresses).values(
        addressIdCreationData.map((addrData) => ({
          profileId: newProfile.id,
          addressId: addrData.addressId,
          isPrimary: addrData.isPrimary,
        })),
      );

      // Insert profile languages (profile id + language ids + level)
      if (data.skills.selectedLanguages?.length) {
        await tx.insert(profilesLanguages).values(
          data.skills.selectedLanguages.map((language) => ({
            profileId: newProfile.id,
            languageId: language.id,
            level: language.level,
          })),
        );
      }

      // Insert profile licences (profile id + licence ids)
      if (data.skills.selectedLicences?.length) {
        await tx.insert(profilesLicences).values(
          data.skills.selectedLicences.map((licence) => ({
            profileId: newProfile.id,
            licenceId: licence.id,
          })),
        );
      }

      if (data.skills.otherSkills?.length) {
        await tx.insert(profileSkills).values(
          data.skills.otherSkills.map((skill) => ({
            profileId: newProfile.id,
            name: skill.name,
            description: skill.description,
          })),
        );
      }
    });
  },
  getProfile: async (userId: string) => {
    const [userWithProfile] = await db
      .select({
        id: users.id,
        email: users.email,
        active: users.active,
        type: users.type,
        profile: {
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          oib: profiles.oib,
          sex: profiles.sex,
          birthDate: profiles.birthDate,
          birthPlace: profiles.birthPlace,
          parentName: profiles.parentName,
          nationality: profiles.nationality,
          phone: profiles.phone,
          societyId: profiles.societyId,
          citySocietyId: profiles.citySocietyId,
        },
      })
      .from(users)
      .where(eq(users.id, userId))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .execute();

    const profileId = userWithProfile?.profile?.id;

    const [workStatus] = profileId
      ? await db
          .select({
            id: workStatuses.id,
            status: workStatuses.status,
            profession: workStatuses.profession,
            institution: workStatuses.institution,
            educationLevel: workStatuses.educationLevel,
          })
          .from(workStatuses)
          .where(eq(workStatuses.profileId, profileId))
          .orderBy(desc(workStatuses.createdAt))
          .limit(1)
          .execute()
      : [null];

    return { ...userWithProfile, workStatus: workStatus ?? null };
  },
  getAddresses: async (userId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) return [];

    return db
      .select({
        addressId: addresses.id,
        street: addresses.street,
        streetNumber: addresses.streetNumber,
        type: addresses.type,
        isPrimary: profilesAddresses.isPrimary,
        city: {
          id: cities.id,
          name: cities.name,
          postalCode: cities.postalCode,
        },
        country: {
          id: countries.id,
          name: countries.name,
        },
      })
      .from(profilesAddresses)
      .where(eq(profilesAddresses.profileId, profile.id))
      .innerJoin(addresses, eq(profilesAddresses.addressId, addresses.id))
      .leftJoin(cities, eq(addresses.cityId, cities.id))
      .leftJoin(countries, eq(cities.countryId, countries.id))
      .execute();
  },
  getSizes: async (userId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) return null;

    const [size] = await db
      .select({
        id: sizes.id,
        shoeSize: sizes.shoeSize,
        clothingSize: sizes.clothingSize,
        height: sizes.height,
        weight: sizes.weight,
      })
      .from(sizes)
      .where(eq(sizes.profileId, profile.id))
      .orderBy(desc(sizes.createdAt))
      .limit(1)
      .execute();

    return size ?? null;
  },
  getRentedEquipment: async (userId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) return [];

    return db
      .select({
        equipmentId: equipment.id,
        name: equipment.name,
        type: equipment.type,
        size: equipment.size,
        rentedQuantity: profileEquipment.quantity,
        dateOfRent: profileEquipment.dateOfRent,
      })
      .from(profileEquipment)
      .where(eq(profileEquipment.profileId, profile.id))
      .innerJoin(equipment, eq(profileEquipment.equipmentId, equipment.id))
      .execute();
  },
  getSkills: async (userId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) return { languages: [], licences: [], otherSkills: [] };

    const [langs, licences, otherSkills] = await Promise.all([
      db
        .select({
          id: languages.id,
          name: languages.name,
          level: profilesLanguages.level,
        })
        .from(profilesLanguages)
        .where(eq(profilesLanguages.profileId, profile.id))
        .innerJoin(languages, eq(profilesLanguages.languageId, languages.id))
        .execute(),
      db
        .select({
          id: profilesLicences.licenceId,
        })
        .from(profilesLicences)
        .where(eq(profilesLicences.profileId, profile.id))
        .execute(),
      db
        .select({
          id: profileSkills.id,
          name: profileSkills.name,
          description: profileSkills.description,
        })
        .from(profileSkills)
        .where(eq(profileSkills.profileId, profile.id))
        .execute(),
    ]);

    return { languages: langs, licences, otherSkills };
  },
  updateProfile: async (
    userId: string,
    profileData: {
      firstName: string;
      lastName: string;
      oib: string;
      sex: Sex;
      type: UserType;
      birthDate?: string | null;
      birthPlace?: string | null;
      parentName?: string | null;
      nationality?: string | null;
      phone?: string | null;
      societyId?: string | null;
      citySocietyId?: string | null;
    },
    workStatusData: {
      status: WorkStatus;
      profession?: string | null;
      institution?: string | null;
      educationLevel?: EducationLevel | null;
    },
  ) => {
    return db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ type: profileData.type, updatedAt: new Date() })
        .where(eq(users.id, userId));

      const [profile] = await tx
        .update(profiles)
        .set({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          oib: profileData.oib,
          sex: profileData.sex,
          birthDate: profileData.birthDate ?? null,
          birthPlace: profileData.birthPlace ?? null,
          parentName: profileData.parentName ?? null,
          nationality: profileData.nationality ?? null,
          phone: profileData.phone ?? null,
          societyId: profileData.societyId ?? null,
          citySocietyId: profileData.citySocietyId ?? null,
        })
        .where(eq(profiles.userId, userId))
        .returning({ id: profiles.id });

      if (!profile) throw new Error('Profile not found');

      const [existingWorkStatus] = await tx
        .select({ id: workStatuses.id })
        .from(workStatuses)
        .where(eq(workStatuses.profileId, profile.id))
        .orderBy(desc(workStatuses.createdAt))
        .limit(1);

      if (existingWorkStatus) {
        await tx
          .update(workStatuses)
          .set({
            status: workStatusData.status,
            profession: workStatusData.profession ?? null,
            institution: workStatusData.institution ?? null,
            educationLevel: workStatusData.educationLevel ?? null,
            updatedAt: new Date(),
          })
          .where(eq(workStatuses.id, existingWorkStatus.id));
      } else {
        await tx.insert(workStatuses).values({
          profileId: profile.id,
          status: workStatusData.status,
          profession: workStatusData.profession ?? null,
          institution: workStatusData.institution ?? null,
          educationLevel: workStatusData.educationLevel ?? null,
        });
      }
    });
  },
  addAddress: async (
    userId: string,
    addressData: {
      street: string;
      streetNumber: string;
      type: AddressType;
      cityId: string;
      isPrimary: boolean;
    },
  ) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db.transaction(async (tx) => {
      const [newAddress] = await tx
        .insert(addresses)
        .values({
          street: addressData.street,
          streetNumber: addressData.streetNumber,
          type: addressData.type,
          cityId: addressData.cityId,
        })
        .returning({ id: addresses.id });

      if (!newAddress) throw new Error('Failed to create address');

      if (addressData.isPrimary) {
        await tx
          .update(profilesAddresses)
          .set({ isPrimary: false })
          .where(eq(profilesAddresses.profileId, profile.id));
      }

      await tx.insert(profilesAddresses).values({
        profileId: profile.id,
        addressId: newAddress.id,
        isPrimary: addressData.isPrimary,
      });
    });
  },
  updateAddress: async (
    userId: string,
    oldAddressId: string,
    addressData: {
      street: string;
      streetNumber: string;
      type: AddressType;
      cityId: string;
      isPrimary: boolean;
    },
  ) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db.transaction(async (tx) => {
      const [newAddress] = await tx
        .insert(addresses)
        .values({
          street: addressData.street,
          streetNumber: addressData.streetNumber,
          type: addressData.type,
          cityId: addressData.cityId,
        })
        .returning({ id: addresses.id });

      if (!newAddress) throw new Error('Failed to create address');

      if (addressData.isPrimary) {
        await tx
          .update(profilesAddresses)
          .set({ isPrimary: false })
          .where(eq(profilesAddresses.profileId, profile.id));
      }

      await tx
        .delete(profilesAddresses)
        .where(
          and(
            eq(profilesAddresses.profileId, profile.id),
            eq(profilesAddresses.addressId, oldAddressId),
          ),
        );

      await tx.insert(profilesAddresses).values({
        profileId: profile.id,
        addressId: newAddress.id,
        isPrimary: addressData.isPrimary,
      });
    });
  },
  deleteAddress: async (userId: string, addressId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db
      .delete(profilesAddresses)
      .where(
        and(
          eq(profilesAddresses.profileId, profile.id),
          eq(profilesAddresses.addressId, addressId),
        ),
      )
      .execute();
  },
  setPrimaryAddress: async (userId: string, addressId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db.transaction(async (tx) => {
      await tx
        .update(profilesAddresses)
        .set({ isPrimary: false })
        .where(eq(profilesAddresses.profileId, profile.id));

      await tx
        .update(profilesAddresses)
        .set({ isPrimary: true })
        .where(
          and(
            eq(profilesAddresses.profileId, profile.id),
            eq(profilesAddresses.addressId, addressId),
          ),
        );
    });
  },
  updateSizes: async (
    userId: string,
    sizeData: {
      shoeSize?: number | null;
      clothingSize?: ClothingSize | null;
      height?: number | null;
      weight?: number | null;
    },
  ) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    const [existing] = await db
      .select({ id: sizes.id })
      .from(sizes)
      .where(eq(sizes.profileId, profile.id))
      .orderBy(desc(sizes.createdAt))
      .limit(1)
      .execute();

    if (existing) {
      return db
        .update(sizes)
        .set({ ...sizeData, updatedAt: new Date() })
        .where(eq(sizes.id, existing.id))
        .execute();
    }

    return db
      .insert(sizes)
      .values({ ...sizeData, profileId: profile.id })
      .execute();
  },
  addRentedEquipment: async (
    userId: string,
    equipmentId: string,
    quantity: number,
    dateOfRent: string,
  ) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db
      .insert(profileEquipment)
      .values({
        profileId: profile.id,
        equipmentId,
        quantity,
        dateOfRent,
      })
      .execute();
  },
  removeRentedEquipment: async (userId: string, equipmentId: string) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db
      .delete(profileEquipment)
      .where(
        and(
          eq(profileEquipment.profileId, profile.id),
          eq(profileEquipment.equipmentId, equipmentId),
        ),
      )
      .execute();
  },
  updateSkills: async (
    userId: string,
    skillsData: {
      selectedLanguages: { id: string; level: LanguageLevel }[];
      selectedLicences: { id: string }[];
      otherSkills: { name: string; description: string }[];
    },
  ) => {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .execute();

    if (!profile) throw new Error('Profile not found');

    return db.transaction(async (tx) => {
      await tx
        .delete(profilesLanguages)
        .where(eq(profilesLanguages.profileId, profile.id));

      await tx
        .delete(profilesLicences)
        .where(eq(profilesLicences.profileId, profile.id));

      await tx
        .delete(profileSkills)
        .where(eq(profileSkills.profileId, profile.id));

      if (skillsData.selectedLanguages.length) {
        await tx.insert(profilesLanguages).values(
          skillsData.selectedLanguages.map((lang) => ({
            profileId: profile.id,
            languageId: lang.id,
            level: lang.level,
          })),
        );
      }

      if (skillsData.selectedLicences.length) {
        await tx.insert(profilesLicences).values(
          skillsData.selectedLicences.map((lic) => ({
            profileId: profile.id,
            licenceId: lic.id,
          })),
        );
      }

      if (skillsData.otherSkills.length) {
        await tx.insert(profileSkills).values(
          skillsData.otherSkills.map((skill) => ({
            profileId: profile.id,
            name: skill.name,
            description: skill.description,
          })),
        );
      }
    });
  },
};

export default userRepository;

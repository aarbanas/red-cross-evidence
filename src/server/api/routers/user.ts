import { z } from 'zod';
import { createUserSchema, paginationQuerySchema } from '@/server/api/schema';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/server/api/trpc';
import {
  AddressType,
  ClothingSize,
  EducationLevel,
  LanguageLevel,
  Sex,
  UserRole,
  UserType,
  WorkStatus,
} from '@/server/db/schema';
import userService from '@/server/services/user/user.service';

const addressInputSchema = z.object({
  street: z.string().min(1),
  streetNumber: z.string().min(1),
  type: z.nativeEnum(AddressType),
  city: z.union([
    z.string().min(1),
    z.object({
      id: z.string(),
      name: z.string(),
      postalCode: z.string().nullable().optional(),
    }),
  ]),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isPrimary: z.boolean(),
});

export const userRouter = createTRPCRouter({
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await userService.getById(input.id);

      return result[0];
    }),
  find: protectedProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      return userService.find(input);
    }),
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      return userService.create(input);
    }),
  getProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getProfile(input.userId);
    }),
  getAddresses: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getAddresses(input.userId);
    }),
  getSizes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getSizes(input.userId);
    }),
  getRentedEquipment: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getRentedEquipment(input.userId);
    }),
  getSkills: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getSkills(input.userId);
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        profile: z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          oib: z.string().min(11).max(11),
          sex: z.nativeEnum(Sex),
          type: z.nativeEnum(UserType),
          birthDate: z.string().nullable().optional(),
          birthPlace: z.string().nullable().optional(),
          parentName: z.string().nullable().optional(),
          nationality: z.string().nullable().optional(),
          phone: z.string().nullable().optional(),
          societyId: z.string().nullable().optional(),
          citySocietyId: z.string().nullable().optional(),
        }),
        workStatus: z.object({
          status: z.nativeEnum(WorkStatus),
          profession: z.string().nullable().optional(),
          institution: z.string().nullable().optional(),
          educationLevel: z.nativeEnum(EducationLevel).nullable().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return userService.updateProfile(
        input.userId,
        input.profile,
        input.workStatus,
      );
    }),
  addAddress: protectedProcedure
    .input(z.object({ userId: z.string(), address: addressInputSchema }))
    .mutation(async ({ input }) => {
      return userService.addAddress(input.userId, input.address);
    }),
  updateAddress: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        oldAddressId: z.string(),
        address: addressInputSchema,
      }),
    )
    .mutation(async ({ input }) => {
      return userService.updateAddress(
        input.userId,
        input.oldAddressId,
        input.address,
      );
    }),
  deleteAddress: protectedProcedure
    .input(z.object({ userId: z.string(), addressId: z.string() }))
    .mutation(async ({ input }) => {
      return userService.deleteAddress(input.userId, input.addressId);
    }),
  setPrimaryAddress: protectedProcedure
    .input(z.object({ userId: z.string(), addressId: z.string() }))
    .mutation(async ({ input }) => {
      return userService.setPrimaryAddress(input.userId, input.addressId);
    }),
  updateSizes: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        sizes: z.object({
          shoeSize: z.number().nullable().optional(),
          clothingSize: z.nativeEnum(ClothingSize).nullable().optional(),
          height: z.number().nullable().optional(),
          weight: z.number().nullable().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return userService.updateSizes(input.userId, input.sizes);
    }),
  addRentedEquipment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        equipmentId: z.string(),
        quantity: z.number().int().positive(),
        dateOfRent: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return userService.addRentedEquipment(
        input.userId,
        input.equipmentId,
        input.quantity,
        input.dateOfRent,
      );
    }),
  removeRentedEquipment: protectedProcedure
    .input(z.object({ userId: z.string(), equipmentId: z.string() }))
    .mutation(async ({ input }) => {
      return userService.removeRentedEquipment(input.userId, input.equipmentId);
    }),
  updateSkills: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        skills: z.object({
          selectedLanguages: z.array(
            z.object({ id: z.string(), level: z.nativeEnum(LanguageLevel) }),
          ),
          selectedLicences: z.array(z.object({ id: z.string() })),
          otherSkills: z.array(
            z.object({ name: z.string(), description: z.string() }),
          ),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return userService.updateSkills(input.userId, input.skills);
    }),
  getEducationTerms: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return userService.getEducationTerms(input.userId);
    }),
  addEducationTerm: protectedProcedure
    .input(z.object({ userId: z.string(), educationTermId: z.string() }))
    .mutation(async ({ input }) => {
      await userService.addEducationTerm(input.userId, input.educationTermId);
      return { success: true };
    }),
  removeEducationTerm: protectedProcedure
    .input(z.object({ userId: z.string(), educationTermId: z.string() }))
    .mutation(async ({ input }) => {
      await userService.removeEducationTerm(
        input.userId,
        input.educationTermId,
      );
      return { success: true };
    }),
  findByName: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input }) => {
      return userService.findByName(input.search);
    }),
  updateRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.nativeEnum(UserRole) }))
    .mutation(async ({ input }) => {
      return userService.updateRole(input.userId, input.role);
    }),
});

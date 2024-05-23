/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type FindUserQuery,
  type UserFilter,
} from "~/server/services/user/types";
import { prepareOrderBy } from "~/server/utils/query";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const prepareFilter = (filter: object) => {
  if (!filter) return null;

  const filterObject = Object.entries(filter).reduce<UserFilter | UserFilter[]>(
    (filterObject, [key, value]) => {
      const filterValue = {
        startsWith: value,
        mode: "insensitive",
      };

      // Check if we are not searching by userAttributes or any other nested object
      if (!key.includes(".")) {
        // Check if we are searching by multiple keys
        if (Array.isArray(filterObject)) {
          filterObject.push({ [key]: filterValue } as UserFilter);
        } else {
          filterObject[key] = filterValue;
        }
      } else {
        const attributeKey = key.split(".")[1];
        // Check if we are searching by multiple keys
        if (Array.isArray(filterObject)) {
          filterObject.push({
            userAttributes: { [attributeKey!]: filterValue },
          } as never);
        } else {
          filterObject.profile = { [attributeKey!]: filterValue };
        }
      }

      return filterObject;
    },
    Object.entries(filter).length === 1 ? {} : [],
  );

  return Array.isArray(filterObject) ? { OR: filterObject } : filterObject;
};

const prepareQuery = (query: FindUserQuery) => {
  const { page, limit, sort, dir, filter } = query;

  const take = limit ? Number(limit) : 10;
  const skip = page ? Number(page) * take : 0;
  const orderBy = prepareOrderBy(sort, dir);
  const where = filter ? prepareFilter(filter) : {};

  return { take, skip, orderBy, where };
};

const userRepository = {
  find: async (query: FindUserQuery) => {
    const { take, skip, where, orderBy } = prepareQuery(query);

    const [count, users] = await prisma.$transaction([
      prisma.user.count({ where: where! }),
      prisma.user.findMany({
        where: where!,
        take,
        skip,
        select: {
          id: true,
          email: true,
          active: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        ...(orderBy && { orderBy }),
      }),
    ]);

    return { users, meta: { skip, take, count } };
  },
};

export default userRepository;

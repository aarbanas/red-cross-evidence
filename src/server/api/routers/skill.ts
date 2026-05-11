import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import skillService from '~/server/services/skills/skill.service'

export const skillRouter = createTRPCRouter({
  languages: {
    getAll: protectedProcedure.query(async () => {
      return skillService.language.getAll()
    }),
  },
})

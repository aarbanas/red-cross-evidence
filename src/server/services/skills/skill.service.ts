import { skillRepository } from '~/server/services/skills/skill.repository';

const skillService = {
  language: {
    getAll: async () => {
      return skillRepository.language.getAll();
    },
  },
};

export default skillService;

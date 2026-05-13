import { getEducationTerms } from '~/server/db/seed/educationTerm.seed';
import { getEducations } from './education.seed';
import { getLicenses } from './license.seed';
import { getSocieties } from './society.seed';
import { getAdmin, getUsers } from './user.seed';

void (async () => {
  await getLicenses();
  console.log('Done seeding licenses.');
  await getUsers();
  console.log('Done seeding users.');
  await getAdmin();
  console.log('Done seeding admin.');
  await getEducations();
  console.log('Done seeding educations.');
  await getEducationTerms();
  console.log('Done seeding education terms.');
  await getSocieties();
  console.log('Done seeding societies.');

  process.exit(0);
})();

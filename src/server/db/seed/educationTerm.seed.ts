/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { db } from "~/server/db";
import { getEducations } from "~/server/db/seed/education.seed";
import { educationTerms } from "~/server/db/schema";
import { fileURLToPath } from "url";

type EducationTerm = {
  id: string;
  title: string;
  dateFrom: Date;
  dateTo: Date;
  maxParticipants: number;
  location: string;
  lecturers: string;
  educationId: string;
};

const getRandomDate = (): Date => {
  const start = new Date(2025, 0, 1, 0, 0, 0);
  const end = new Date(2025, 0, 31, 23, 59, 59);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

export const populateEducationTerms = async (): Promise<EducationTerm[]> => {
  const educations = await getEducations();

  for (let i = 0; i < 35; i++) {
    const dateFrom = getRandomDate();
    await db.insert(educationTerms).values({
      dateFrom: dateFrom,
      title: `Education Term ${i + 1}`,
      dateTo: i % 7 === 0 ? getRandomDate() : dateFrom,
      maxParticipants: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
      location: "Neka ulica 10, 51000 Rijeka, 5. kat",
      lecturers: "Ivo Ivic, Marko Markovic",
      educationId:
        educations[Math.floor(Math.random() * educations.length)]?.id!,
    });
  }

  return db.query.educationTerms.findMany();
};

export const getEducationTerms = async () => {
  let _educationTerms = await db.query.educationTerms.findMany();
  if (!_educationTerms.length) {
    _educationTerms = await populateEducationTerms();
  }

  return _educationTerms;
};

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  getEducationTerms()
    .then((educationTerms) => {
      console.log("Done seeding education terms.");
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

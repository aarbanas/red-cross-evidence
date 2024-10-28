import { fileURLToPath } from "url";
import { db } from "../index";
import { educations, EducationType } from "../schema/education";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";

interface Education {
  title: string;
  description: string;
  precondition?: string;
  duration?: string;
  lecturers?: string;
  course_duration?: string;
  renewal_duration?: string;
  topics?: string;
  type: EducationType;
}

const headerMapping: Record<string, keyof Education> = {
  Title: "title",
  Description: "description",
  Preduvjet: "precondition",
  Trajanje: "duration",
  Predavači: "lecturers",
  "Trajanje tečaja": "course_duration",
  "Trajanje obnove": "renewal_duration",
  Teme: "topics",
};

const sheetNameMapping: Record<string, EducationType> = {
  "za-volontere": EducationType.VOLUNTEERS,
  "za-javnost": EducationType.PUBLIC,
  "za-djelatnike": EducationType.EMPLOYEE,
};

const readExcelFile = (filePath: string): Education[] => {
  const fileBuffer = readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const educations: Education[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(sheet!, { header: 1 });

    const headers = data[0];
    const rows = data.slice(1);

    const type = sheetNameMapping[sheetName];

    const sheetEducations = rows.map((row) => {
      const education: Partial<Education> = {};
      headers!.forEach((header, index) => {
        const propertyName = headerMapping[header];
        if (propertyName) {
          if (propertyName !== "type") {
            education[propertyName] = row[index];
          }
        }
      });
      education.type = type;
      return education as Education;
    });

    educations.push(...sheetEducations);
  });

  return educations;
};

const populateEducations = async () => {
  const filePath = "scripts/educations_parser/edukacije.xlsx";
  const _educations = readExcelFile(filePath);

  return db.insert(educations).values(_educations).returning();
};

export const getEducations = async () => {
  let _educations = await db.query.educations.findMany();
  if (!_educations.length) {
    _educations = await populateEducations();
  }

  return _educations;
};

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  getEducations()
    .then((educations) => {
      console.log("Done seeding educations.");
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

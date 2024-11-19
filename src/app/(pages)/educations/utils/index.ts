import { EducationType } from "~/server/db/schema";

export const translateEducationType = (type: EducationType) => {
  switch (type) {
    case EducationType.VOLUNTEERS:
      return "Volonteri";
    case EducationType.PUBLIC:
      return "Javnost";
    case EducationType.EMPLOYEE:
      return "Djelatnici";
  }
};

export const mapTranslatedEducationType = (type: string) => {
  switch (type) {
    case "Volonteri":
      return EducationType.VOLUNTEERS;
    case "Javnost":
      return EducationType.PUBLIC;
    case "Djelatnici":
      return EducationType.EMPLOYEE;
  }
};

import {
  AddressType,
  EducationLevel,
  Sex,
  WorkStatus,
} from "~/server/db/schema";

export const translateSex = (sex: Sex) => {
  switch (sex) {
    case Sex.MALE:
      return "Muško";
    case Sex.FEMALE:
      return "Žensko";
    case Sex.OTHER:
      return "Drugo";
    default:
      throw new Error("Invalid sex value");
  }
};

export const translateAddressType = (type: AddressType) => {
  switch (type) {
    case AddressType.PERMANENT_RESIDENCE:
      return "Prebivlište";
    case AddressType.TEMPORARY_RESIDENCE:
      return "Boravište";
    case AddressType.WORK:
      return "Adresa rada";
    case AddressType.OTHER:
      return "Drugo";
    default:
      throw new Error("Invalid address type");
  }
};

export const translateWorkStatus = (status: WorkStatus) => {
  switch (status) {
    case WorkStatus.EMPLOYED:
      return "Zaposlen";
    case WorkStatus.UNEMPLOYED:
      return "Nezaposlen";
    case WorkStatus.SELF_EMPLOYED:
      return "Samozaposlen";
    case WorkStatus.STUDENT:
      return "Student";
    case WorkStatus.PUPIL:
      return "Učenik";
    case WorkStatus.RETIRED:
      return "Umirovljen";
    default:
      throw new Error("Invalid work status");
  }
};

export const translateEducationLevel = (level: EducationLevel) => {
  switch (level) {
    case EducationLevel.PRIMARY:
      return "Osnovno obrazovanje";
    case EducationLevel.SECONDARY:
      return "Srednja stručna sprema";
    case EducationLevel.COLLEGE:
      return "Viša stručna sprema";
    case EducationLevel.BACHELOR:
      return "Visoka stručna sprema";
    case EducationLevel.MASTER:
      return "Magisterij";
    case EducationLevel.DOCTORATE:
      return "Doktorat znanosti";
    case EducationLevel.POST_DOCTORATE:
      return "Postdoktorat";
    default:
      throw new Error("Invalid education level");
  }
};

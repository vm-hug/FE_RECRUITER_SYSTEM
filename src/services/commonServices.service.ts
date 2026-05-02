import axiosClient from "../api/axiosClient";
import type {
  EducationLevel,
  Level,
  Location,
  Profession,
  WorkFormat,
} from "../types/common.type";

const commonServices = {
  getLevel: async (): Promise<Level[]> => await axiosClient.get("level"),

  getEducationLevels: async (): Promise<EducationLevel[]> =>
    await axiosClient.get("/education-level"),

  getWorkFormats: async (): Promise<WorkFormat[]> =>
    await axiosClient.get("/work-format"),

  getLocations: async (): Promise<Location[]> =>
    await axiosClient.get("/location"),

  getProfession: async (): Promise<Profession[]> =>
    await axiosClient.get("/profession"),
};

export default commonServices;

import axiosClient from "../api/axiosClient";
import type {
  EducationLevel,
  Level,
  Location,
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
};

export default commonServices;

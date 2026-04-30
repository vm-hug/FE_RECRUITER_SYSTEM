import { useEffect, useState } from "react";
import commonServices from "../services/commonServices.service";
import type {
  EducationLevel,
  Level,
  Location,
  WorkFormat,
} from "../types/common.type";

export const useCommonData = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [workFormats, setWorkFormats] = useState<WorkFormat[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lv, edu, wf, loc] = await Promise.all([
          commonServices.getLevel(),
          commonServices.getEducationLevels(),
          commonServices.getWorkFormats(),
          commonServices.getLocations(),
        ]);

        setLevels(lv);
        setEducationLevels(edu);
        setWorkFormats(wf);
        setLocations(loc);
      } catch (error) {
        console.error("Error fetching common data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    levels,
    educationLevels,
    workFormats,
    locations,
    isLoading,
  };
};

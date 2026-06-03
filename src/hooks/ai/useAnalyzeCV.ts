import { useMutation } from "@tanstack/react-query";
import { cvAnalyzeServices } from "../../services/ai/cv-analyze.service";

export const useAnalyzeCV = () => {
  return useMutation({
    mutationFn: cvAnalyzeServices.analyze,
  });
};

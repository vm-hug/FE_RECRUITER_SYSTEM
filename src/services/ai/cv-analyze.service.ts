import aiAxiosClient from "../../api/ai_axiosClient";
import type {
  AnalyzeCVPayload,
  CVAnalysisResult,
} from "../../types/ai/cv_analyze.type";

export const cvAnalyzeServices = {
  analyze: async (data: AnalyzeCVPayload): Promise<CVAnalysisResult> => {
    const formData = new FormData();
    formData.append("job_description", data.jobDescription);
    formData.append("file", data.file);

    // Lưu kết quả của axios vào 1 biến
    const response = await aiAxiosClient.post("/api/v1/analyze-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

import axiosClient from "../api/axiosClient";
import type {
  CandidateRegisterPayload,
  RecruiterRegisterPayload,
} from "../types/auth.type";

export const userServices = {
  registerCandidate: (data: CandidateRegisterPayload): Promise<any> => {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);
    formData.append("languages", data.languages);
    if (data.salary) {
      formData.append("desiredSalary", data.salary);
    }
    formData.append("careerObjective", data.objective);

    formData.append("levelId", data.level);
    formData.append("workFormatId", data.workFormat);
    formData.append("educationLevelId", data.education);
    formData.append("locationId", data.location);

    if (data.avatarFile) {
      formData.append("avatarUrl", data.avatarFile);
    }
    if (data.cvFile) {
      formData.append("cvUrl", data.cvFile);
    }

    return axiosClient.post("/users/system-candidate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  registerRecuiter: (data: RecruiterRegisterPayload): Promise<any> => {
    return axiosClient.post("/users/system-recruiter", data);
  },
};

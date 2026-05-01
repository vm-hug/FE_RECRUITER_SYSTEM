import axiosClient from "../api/axiosClient";
import type {
  CandidateRegisterPayload,
  RecruiterRegisterPayload,
} from "../types/auth.type";
import type {
  UpdateCandidatePayload,
  UserResponse,
} from "../types/candidate/candidate.type";
import type { UpdateRecruiterPayload } from "../types/recruiter/recruiter.type";

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

  getMyInfo: (): Promise<UserResponse> => {
    return axiosClient.get("/users/myinfo") as Promise<UserResponse>;
  },

  updateCandidateProfile: (
    data: UpdateCandidatePayload,
  ): Promise<UserResponse> => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);
    formData.append("languages", data.languages);
    formData.append("desiredSalary", data.desiredSalary);
    formData.append("careerObjective", data.careerObjective);

    formData.append("levelId", data.levelId);
    formData.append("workFormatId", data.workFormatId);
    formData.append("educationLevelId", data.educationLevelId);
    formData.append("locationId", data.locationId);

    if (data.avatarFile) {
      formData.append("avatarUrl", data.avatarFile);
    }

    if (data.cvFile) {
      formData.append("cvUrl", data.cvFile);
    }

    return axiosClient.put("/users/myinfo/candidate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<UserResponse>;
  },

  updateRecruiter: (data: UpdateRecruiterPayload): Promise<UserResponse> => {
    return axiosClient.put(
      "/users/myinfo/recruiter",
      data,
    ) as Promise<UserResponse>;
  },
};

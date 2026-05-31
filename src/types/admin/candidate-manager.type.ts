import type {
  EducationLevel,
  Level,
  Location,
  WorkFormat,
} from "../common.type";

export type UserStatus = "HOAT_DONG" | "BI_KHOA" | "CHO_XAC_MINH";

export interface CandidateResponseManager {
  id: string;

  firstName: string;
  lastName: string;

  phone: string;

  languages: string;

  desiredSalary: number;

  careerObjective: string;

  avatarUrl: string;
  cvUrl: string;

  level: Level;

  workFormat: WorkFormat;

  educationLevel: EducationLevel;

  location: Location;

  candidateStatus: UserStatus;

  email: string;
}

export interface CandidateSearchRequest {
  keyword?: string;

  levelId?: string;

  workFormatId?: string;

  page?: number;
  size?: number;

  sortBy?: string;

  sortDir?: "asc" | "desc";
}

export interface UpdateCandidateStatusPayload {
  status: UserStatus;
}

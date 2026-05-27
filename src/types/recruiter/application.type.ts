export const ApplicationStatus = {
  APPLIED: "APPLIED",
  VIEWED: "VIEWED",
  INTERVIEWING: "INTERVIEWING",
  REJECTED: "REJECTED",
  HIRED: "HIRED",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export interface ApplicationPayload {
  jobId: string;
  cvFile?: File;
}

export interface ApplicationResponse {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  cvUrl: string;
}

export interface ManagerApplicationSearchRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

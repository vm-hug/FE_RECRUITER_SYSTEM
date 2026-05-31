import type { UserStatus } from "./candidate-manager.type";

export interface RecruiterResponse {
  name: string;

  position: string;

  companyName: string;

  recruiterStatus: UserStatus;

  email: string;

  id: string;
}

export interface RecruiterSearchRequest {
  keyword?: string;

  page?: number;
  size?: number;

  sortBy?: string;

  sortDir?: "asc" | "desc";
}

import { ApplicationStatus } from "../types/recruiter/application.type";

export const statusLabelMap: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  VIEWED: "Viewed",
  INTERVIEWING: "Interviewing",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export const statusClassMap: Record<ApplicationStatus, string> = {
  APPLIED: "pending",
  VIEWED: "viewed",
  INTERVIEWING: "interviewing",
  REJECTED: "rejected",
  HIRED: "accepted",
};

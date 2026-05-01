import type {
  EducationLevel,
  Level,
  Location,
  WorkFormat,
} from "../common.type";
import type { RecruiterProfile } from "../recruiter/recruiter.type";

export interface Reference {
  id: string;
  name: string;
  companyName: string;
  position: string;
  phone: string;
  contactInfo: string;
  relationship: string;
  initials: string;
}

export interface Skill {
  id: string;
  skillName: string;
}

export interface CandidateSkill {
  id: string;
  skillId: string;
  skillName: string;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

// Get my info

export interface CandidateProfile {
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
}

export interface UserResponse {
  id: string;
  email: string;
  candidate?: CandidateProfile;
  recruiter?: RecruiterProfile;
}

export interface UpdateCandidatePayload {
  firstName: string;
  lastName: string;
  phone: string;
  languages: string;
  desiredSalary: string;
  careerObjective: string;

  levelId: string;
  workFormatId: string;
  educationLevelId: string;
  locationId: string;

  avatarFile?: File | null;
  cvFile?: File | null;
}

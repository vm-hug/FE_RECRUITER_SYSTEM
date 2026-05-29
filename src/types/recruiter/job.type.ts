export const JOB_STATUS = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export interface JobResponse {
  id: string;

  jobCode: string;
  title: string;
  slug: string;

  companyId: string;
  companyName: string;
  companyAddressDetail: string;

  recruiterId: string;
  recruiterName: string;

  professionId: string;
  professionName: string;

  description: string;
  requirements: string;
  experience: string;

  levelId: string;
  levelName: string;

  locationId: string;
  locationName: string;

  educationLevelId: string;
  educationLevelName: string;

  workFormatId: string;
  workFormatName: string;

  salaryMin: number;
  salaryMax: number;

  moneyCurrent: string;

  jobStatus: JobStatus;

  gpa: number;

  contactEmail: string;

  avatarJob: string;

  expiredAt: string;

  createAt: string;
  updateAt: string;
}

export interface JobPayload {
  jobCode: string;

  title: string;
  slug?: string;

  professionId: string;

  description: string;
  requirements: string;
  experience: string;

  levelId: string;
  educationLevelId: string;
  workFormatId: string;

  salaryMin: number | string;
  salaryMax: number | string;

  moneyCurrent: string;

  jobStatus: JobStatus;

  contactEmail: string;

  gpa: number | string;

  avatarJob?: File | null;

  expiredAt: string;
}

export interface UpdateJobStatusPayload {
  jobStatus: JobStatus;
}

export interface JobSearchParams {
  title?: string;

  companyId?: string;
  professionId?: string;
  levelId?: string;
  locationId?: string;
  educationLevelId?: string;
  workFormatId?: string;
  recruiterId?: string;

  salaryMin?: number;
  salaryMax?: number;

  gpa?: number;

  jobStatus?: JobStatus;

  page?: number;
  size?: number;

  sortBy?: string;
  sortDir?: string;
}

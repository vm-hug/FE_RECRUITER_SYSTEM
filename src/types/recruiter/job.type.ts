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
  jobStatus: string; // JobStatus enum -> string
  gpa: number;
  contactEmail: string;
  avatarJob: string;
  expiredAt: string; // ISO string
  createAt: string;
  updateAt: string;
}

export interface JobPayload {
  jobCode: string;
  title: string;
  slug: string;
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
  jobStatus: string;
  contactEmail: string;
  gpa: number | string;
  avatarJob?: File | null;
  expiredAt: string; // ISO string
}

export interface JobSearchParams {
  title?: string;
  companyId?: string;
  professionId?: string;
  levelId?: string;
  locationId?: string;
  educationLevelId?: string;
  workFormatId?: string;
  salaryMin?: number;
  salaryMax?: number;
  gpa?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

// Nếu bạn chưa có PageResponse, định nghĩa dùng chung
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

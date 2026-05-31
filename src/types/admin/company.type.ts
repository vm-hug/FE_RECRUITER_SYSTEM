import type { Location } from "../common.type";

export interface CompanyResponse {
  id: string;

  name: string;
  email: string;
  addressDetail: string;
  avatarUrl: string;
  phone: string;

  location: Location;

  description: string;
  website: string;

  companySize: number;
  establishedYear: number;
}

export interface CompanyPayload {
  name: string;
  email: string;
  addressDetail: string;
  phone: string;

  locationId: string;

  description: string;
  website: string;

  companySize: number | string;
  establishedYear: number | string;

  avatarUrl?: File | null;
}

export interface CompanySearchRequest {
  keyword?: string;

  page?: number;
  size?: number;

  sortBy?: string;
  sortDir?: "asc" | "desc";
}

import type { CompanyResponse } from "./company.type";

export interface RecruiterProfile {
  name: string;
  position: string;
  company?: CompanyResponse;
}

export interface UpdateRecruiterPayload {
  name: string;
  position: string;
}

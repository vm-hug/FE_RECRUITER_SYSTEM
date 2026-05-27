export interface ProfessionRequest {
  name: string;
  description?: string;
}

export interface ProfessionResponse {
  id: string;
  name: string;
  description: string;
}

export interface ProfessionSearch {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string; // mặc định "name"
  sortDir?: "asc" | "desc"; // mặc định "desc"
}

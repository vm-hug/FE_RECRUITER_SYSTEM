export interface AuthorResponse {
  id: string;

  name: string;

  position: string;

  avatarUrl: string;
}

export interface AuthorPayload {
  name: string;

  position: string;

  avatarUrl?: File | null;
}

export interface AuthorSearchRequest {
  keyword?: string;

  page?: number;
  size?: number;

  sortBy?: string;

  sortDir?: "asc" | "desc";
}

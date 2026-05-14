export interface AuthorResponse {
  id: string;
  name: string;
  position: string;
  avatarUrl: string;
}

export interface AuthorPayload {
  name: string;
  avatarUrl?: File | null;
}

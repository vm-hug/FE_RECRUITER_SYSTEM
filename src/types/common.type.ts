export interface Level {
  id: string;
  name: string;
  description: string;
}

export interface EducationLevel {
  id: string;
  name: string;
}

export interface WorkFormat {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
}

export interface Profession {
  id: string;
  name: string;
  description: string;
}

// Nếu bạn chưa có PageResponse, định nghĩa dùng chung
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  page: number;
  size: number;
}

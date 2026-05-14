const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const getImageUrl = (path?: string): string => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${BASE_URL}/${cleanPath}`;
};

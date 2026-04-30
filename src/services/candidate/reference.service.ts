import axiosClient from "../../api/axiosClient";
import type { Reference } from "../../types/candidate/candidate.type";

const referenceService = {
  getMyReferences: (): Promise<Reference[]> =>
    axiosClient.get("/references/me"),

  getById: (id: string): Promise<Reference> =>
    axiosClient.get(`/references/${id}`),

  create: (data: Omit<Reference, "id">): Promise<Reference> =>
    axiosClient.post("/references", data),

  update: (id: string, data: Partial<Reference>): Promise<Reference> =>
    axiosClient.put(`/references/${id}`, data),

  delete: (id: string): Promise<void> =>
    axiosClient.delete(`/references/${id}`),
};

export default referenceService;

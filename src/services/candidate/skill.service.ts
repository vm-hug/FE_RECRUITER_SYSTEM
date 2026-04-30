import axiosClient from "../../api/axiosClient";
import type { Skill } from "../../types/candidate/candidate.type";

const skillServices = {
  getAll: (): Promise<Skill[]> => axiosClient.get("/skills"),

  getById: (id: string): Promise<Skill[]> => axiosClient.get(`/skills/${id}`),

  create: (data: { name: string }): Promise<Skill[]> =>
    axiosClient.post("/skills", data),

  update: (id: string, data: { name: string }): Promise<Skill[]> =>
    axiosClient.put(`/skills/${id}`, data),
};

export default skillServices;

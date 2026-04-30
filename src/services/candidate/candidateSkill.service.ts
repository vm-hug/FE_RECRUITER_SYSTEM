import axiosClient from "../../api/axiosClient";
import type { CandidateSkill } from "../../types/candidate/candidate.type";

const candidateSkillService = {
  getMySkills: (): Promise<CandidateSkill[]> =>
    axiosClient.get("/candidate-skills/me"),

  getById: (id: string): Promise<CandidateSkill> =>
    axiosClient.get(`/candidate-skills/${id}`),

  create: (data: {
    skillId: string;
    skillLevel: string;
  }): Promise<CandidateSkill> => axiosClient.post("/candidate-skills", data),

  update: (id: string, data: { skillLevel: string }): Promise<CandidateSkill> =>
    axiosClient.put(`/candidate-skills/${id}`, data),

  delete: (id: string): Promise<void> =>
    axiosClient.delete(`/candidate-skills/${id}`),
};

export default candidateSkillService;

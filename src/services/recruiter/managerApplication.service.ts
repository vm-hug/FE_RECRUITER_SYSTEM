import axiosClient from "../../api/axiosClient";
import type {
  ApplicationPayload,
  ApplicationResponse,
  ApplicationStatus,
} from "../../types/recruiter/application.type";
import type { PageResponse } from "../../types/recruiter/job.type";

export const managerApplicationService = {
  create: (data: ApplicationPayload): Promise<any> => {
    const formData = new FormData();
    formData.append("jobId", data.jobId);
    if (data.cvFile) {
      formData.append("cvFile", data.cvFile);
    }

    return axiosClient.post("/manager-applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 1. Lấy tất cả đơn ứng tuyển (Thường dành cho Admin/Recruiter)
  getAll: (
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<ApplicationResponse>> => {
    return axiosClient.get(
      `/manager-applications?page=${page}&size=${size}`,
    ) as Promise<PageResponse<ApplicationResponse>>;
  },

  // 2. Lấy chi tiết đơn ứng tuyển theo ID
  getById: (id: string): Promise<ApplicationResponse> => {
    return axiosClient.get(
      `/manager-applications/${id}`,
    ) as Promise<ApplicationResponse>;
  },

  // 3. Cập nhật trạng thái đơn (Ví dụ: PENDING -> ACCEPTED/REJECTED)
  updateStatus: (
    id: string,
    status: ApplicationStatus,
  ): Promise<ApplicationResponse> => {
    // Sử dụng query param vì backend dùng @RequestParam
    return axiosClient.patch(
      `/manager-applications/${id}/status?status=${status}`,
    ) as Promise<ApplicationResponse>;
  },

  // 4. Xóa đơn ứng tuyển
  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/manager-applications/${id}`) as Promise<void>;
  },

  // 5. (Bổ sung) Lấy danh sách ứng tuyển của chính Candidate đó
  getMyApplications: (
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<ApplicationResponse>> => {
    return axiosClient.get(
      `/manager-applications/me?page=${page}&size=${size}`,
    ) as Promise<PageResponse<ApplicationResponse>>;
  },
};

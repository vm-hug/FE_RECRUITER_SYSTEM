import axiosClient from "../../api/axiosClient";
import type { PageResponse } from "../../types/common.type";
import type {
  ApplicationPayload,
  ApplicationResponse,
  ApplicationStatus,
  ManagerApplicationSearchRequest,
} from "../../types/recruiter/application.type";

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

  getAll: (
    params: ManagerApplicationSearchRequest,
  ): Promise<PageResponse<ApplicationResponse>> => {
    return axiosClient.get("/manager-applications", { params }) as Promise<
      PageResponse<ApplicationResponse>
    >;
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

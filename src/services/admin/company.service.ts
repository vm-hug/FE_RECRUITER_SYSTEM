import axiosClient from "../../api/axiosClient";
import type { PageResponse } from "../../types/common.type";

import type {
  CompanyPayload,
  CompanyResponse,
  CompanySearchRequest,
} from "../../types/recruiter/company.type";

export const companyServices = {
  create: async (data: CompanyPayload): Promise<CompanyResponse> => {
    const formData = new FormData();

    appendCompanyFormData(formData, data);

    return axiosClient.post("/company", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<CompanyResponse>;
  },

  update: async (
    id: string,
    data: CompanyPayload,
  ): Promise<CompanyResponse> => {
    const formData = new FormData();

    appendCompanyFormData(formData, data);

    return axiosClient.put(`/company/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<CompanyResponse>;
  },

  getAll: async (
    params: CompanySearchRequest,
  ): Promise<PageResponse<CompanyResponse>> => {
    return axiosClient.get("/company", {
      params,
    }) as Promise<PageResponse<CompanyResponse>>;
  },

  getMyCompany: async (): Promise<CompanyResponse> => {
    return axiosClient.get("/company/my-company") as Promise<CompanyResponse>;
  },

  delete: async (id: string): Promise<void> => {
    return axiosClient.delete(`/company/${id}`) as Promise<void>;
  },
};

function appendCompanyFormData(formData: FormData, data: CompanyPayload) {
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("addressDetail", data.addressDetail);
  formData.append("phone", data.phone);

  formData.append("locationId", data.locationId);

  formData.append("description", data.description);
  formData.append("website", data.website);

  formData.append("companySize", data.companySize.toString());

  formData.append("establishedYear", data.establishedYear.toString());

  if (data.avatarUrl) {
    formData.append("avatarUrl", data.avatarUrl);
  }
}

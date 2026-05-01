import axiosClient from "../../api/axiosClient";
import type {
  CompanyPayload,
  CompanyResponse,
} from "../../types/recruiter/company.type";

export const companyServices = {
  create: (data: CompanyPayload): Promise<CompanyResponse> => {
    const formData = new FormData();

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

    return axiosClient.post("/company", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<CompanyResponse>;
  },

  update: (id: string, data: CompanyPayload): Promise<CompanyResponse> => {
    const formData = new FormData();

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

    return axiosClient.put(`/company/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<CompanyResponse>;
  },
};

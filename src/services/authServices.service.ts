import type {
  AuthenticationRequest,
  AuthenticationResponse,
  LogoutRequest,
} from "../types/auth.type";
import axiosClient from "../api/axiosClient";

export const authService = {
  login: (data: AuthenticationRequest): Promise<AuthenticationResponse> => {
    return axiosClient.post("/auth/login", data);
  },

  logout: (data: LogoutRequest): Promise<void> => {
    return axiosClient.post("/auth/logout", data);
  },
};

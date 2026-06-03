import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginAdmin.scss";

import { jwtDecode } from "jwt-decode";
import type { AuthenticationRequest } from "../../../types/auth.type";
import { authService } from "../../../services/authServices.service";

const LoginAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AuthenticationRequest>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);

      if (response.authenticated) {
        const token = response.token;

        const decodedToken: any = jwtDecode(token);

        if (decodedToken.scope && decodedToken.scope.includes("ROLE_ADMIN")) {
          localStorage.setItem("access_token", token);

          navigate("/admin/dashboard-admin");
        } else {
          setError("Bạn không có quyền truy cập vào trang quản trị!");
        }
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập admin:", err);

      setError(err.message || "Email hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-card__logo">
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
        </div>

        <h1 className="admin-login-card__title">Admin Portal</h1>

        <p className="admin-login-card__subtitle">
          Hệ thống quản trị CareerRise
        </p>

        <form className="admin-login-card__form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">mail</span>

              <input
                type="email"
                name="email"
                placeholder="Nhập email admin"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>

            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </button>
        </form>

        <div className="admin-login-card__footer">
          <Link to="/recruiter/login" className="back-link">
            ← Quay lại trang nhà tuyển dụng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;

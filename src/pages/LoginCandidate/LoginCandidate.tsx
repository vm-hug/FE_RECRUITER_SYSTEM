import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Điều chỉnh đường dẫn theo thư mục thực tế
import "./LoginCandidate.scss";
import type { AuthenticationRequest } from "../../types/auth.type";
import { authService } from "../../services/authServices.service";
import { jwtDecode } from "jwt-decode";

const LoginCandidate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AuthenticationRequest>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

        if (
          decodedToken.scope &&
          decodedToken.scope.includes("ROLE_CANDIDATE")
        ) {
          localStorage.setItem("access_token", token);
          navigate("/");
        } else {
          setError(
            "Đây là cổng dành cho Ứng viên. Nhà tuyển dụng vui lòng đăng nhập ở cổng doanh nghiệp!",
          );
        }
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message || "Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">CareerRise</div>
        <h1 className="login-card__title">Đăng nhập ứng viên</h1>

        {/* Thêm sự kiện onSubmit vào form */}
        <form className="login-card__form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <Link to="#" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
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

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div
              className="error-message"
              style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
            >
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-card__footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="link">
              Đăng ký ứng viên
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCandidate;

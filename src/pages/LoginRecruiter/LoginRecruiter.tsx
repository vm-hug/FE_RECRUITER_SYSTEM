import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginRecruiter.scss";
import type { AuthenticationRequest } from "../../types/auth.type";
import { authService } from "../../services/authServices";
import { jwtDecode } from "jwt-decode";

const LoginRecruiter = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<AuthenticationRequest>({
    email: "",
    password: "",
  });

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
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);

      if (response.authenticated) {
        const token = response.token;
        const decodedToken: any = jwtDecode(token);

        if (
          decodedToken.scope &&
          decodedToken.scope.includes("ROLE_RECRUITER")
        ) {
          localStorage.setItem("access_token", token);
          navigate("/");
        } else {
          setError(
            "Truy cập bị từ chối! Email này không phải là tài khoản Nhà tuyển dụng.",
          );
          alert(
            "Truy cập bị từ chối! Email này không phải là tài khoản Nhà tuyển dụng.",
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
    <div className="recruiter-login-page">
      <div className="recruiter-login-card">
        <div className="decorative-bar" />
        <div className="blob-bg" />
        <div className="content">
          <div className="icon-box">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <h1>Đăng nhập Nhà tuyển dụng</h1>
          <p className="sub">
            Chào mừng trở lại. Đăng nhập để quản lý tin tuyển dụng của bạn.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email công ty"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Mật khẩu</label>
                <Link to="#" className="forgot-link">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Hiển thị thông báo lỗi (Bao gồm cả lỗi sai Role) */}
            {error && (
              <div
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Đang xác thực..." : "Đăng nhập Nhà tuyển dụng"}
              {!loading && (
                <span className="material-symbols-outlined">arrow_forward</span>
              )}
            </button>
          </form>

          <div className="footer-link">
            <p>
              Chưa có tài khoản?{" "}
              <Link to="/register/recruiter">Đăng ký Nhà tuyển dụng</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRecruiter;

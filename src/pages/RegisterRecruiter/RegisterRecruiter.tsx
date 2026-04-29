import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterRecruiter.scss";
import type { RecruiterRegisterPayload } from "../../types/auth.type";
import { userServices } from "../../services/userServices";

const RegisterRecruiter = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<RecruiterRegisterPayload>({
    email: "",
    name: "",
    password: "",
    position: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.password) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await userServices.registerRecuiter(formData);

      navigate("/recruiter/login");
    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      setError(err.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-register-page">
      <div className="recruiter-register-card">
        <div className="decorative-line" />
        <div className="ambient-bg-left" />
        <div className="ambient-bg-right" />

        <div className="card-inner">
          <header className="card-header">
            <div className="brand-icon">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <h1>Đăng ký Nhà tuyển dụng</h1>
            <p>
              Tham gia nền tảng để kết nối với những ứng viên hàng đầu cho doanh
              nghiệp của bạn.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Email công ty <span>*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined">mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="VD: hr@congty.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Mật khẩu <span>*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Họ và tên <span>*</span>
              </label>
              <div className="input-with-icon no-left-icon">
                <input
                  type="text"
                  name="name"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Chức vụ của bạn</label>
              <div className="input-with-icon no-left-icon">
                <input
                  type="text"
                  name="position"
                  placeholder="VD: Trưởng phòng HR, Tuyển dụng..."
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
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

            <div className="actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký Nhà tuyển dụng"}
                {!loading && (
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                )}
              </button>
              <p className="switch-link">
                Đã có tài khoản?{" "}
                <Link to="/recruiter/login">Quay lại đăng nhập</Link>
              </p>
            </div>
          </form>
          <p className="terms-text">
            Bằng việc đăng ký, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
            và <a href="#">Chính sách bảo mật</a> của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterRecruiter;

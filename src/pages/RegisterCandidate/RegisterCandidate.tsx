import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./RegisterCandidate.scss";

import { useCommonData } from "../../hooks/useCommonData";
import { userServices } from "../../services/userServices.service";
import type {
  CandidateFormData,
  CandidateRegisterPayload,
} from "../../types/auth.type";

const RegisterCandidate = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<CandidateFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    level: "",
    workFormat: "",
    education: "",
    location: "",
    languages: "",
    salary: "",
    objective: "",
  });

  const { levels, educationLevels, workFormats, locations, isLoading } =
    useCommonData();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, name, value } = e.target;
    const fieldName = id || name;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarFile(file);
    }
  };

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CandidateRegisterPayload = {
      ...formData,
      avatarFile: avatarFile,
      cvFile: cvFile,
    };

    try {
      const response = await userServices.registerCandidate(payload);

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false); // Hoàn thành thì tắt loading
    }
  };

  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="register-card">
      <div className="register-card__header">
        <Link to="/" className="register-card__brand">
          CareerScale
        </Link>
        <h1>Đăng ký tài khoản ứng viên</h1>
        <p>Tạo hồ sơ để khám phá hàng ngàn cơ hội việc làm mới.</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* ================= SECTION 1 ================= */}
        <section className="form-section">
          <h2>1. Thông tin tài khoản</h2>
          <div className="grid-2col">
            <div className="form-group">
              <label htmlFor="firstName">
                Họ <span>*</span>
              </label>
              <input
                id="firstName"
                placeholder="Nguyễn Văn"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                Tên <span>*</span>
              </label>
              <input
                id="lastName"
                placeholder="A"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="nguyenvana@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid-2col">
            <div className="form-group">
              <label>
                Mật khẩu <span>*</span>
              </label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">
                  lock
                </span>
                <input
                  id="password" // Sử dụng id để đồng nhất với handleInputChange
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập ít nhất 8 ký tự..."
                  required
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                placeholder="0901234567"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* ================= SECTION 2 ================= */}
        <section className="form-section">
          <h2>2. Tiêu chí tìm việc</h2>
          <div className="grid-2col">
            <div className="form-group">
              <label htmlFor="level">
                Cấp bậc <span>*</span>
              </label>
              <select
                id="level"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  --Chọn cấp bậc--
                </option>
                {levels.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="workFormat">
                Hình thức làm việc <span>*</span>
              </label>
              <select
                id="workFormat"
                value={formData.workFormat}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  --Chọn hình thức--
                </option>
                {workFormats.map((wf) => (
                  <option key={wf.id} value={wf.id}>
                    {wf.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="education">
                Trình độ học vấn <span>*</span>
              </label>
              <select
                id="education"
                value={formData.education}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  --Chọn trình độ--
                </option>
                {educationLevels.map((edu) => (
                  <option key={edu.id} value={edu.id}>
                    {edu.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">
                Địa điểm làm việc <span>*</span>
              </label>
              <select
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  --Chọn địa điểm--
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3 ================= */}
        <section className="form-section">
          <h2>3. Hồ sơ tổng quan</h2>
          <div className="grid-2col">
            <div className="form-group">
              <label htmlFor="languages">Ngoại ngữ</label>
              <input
                id="languages"
                placeholder="Tiếng Anh, Tiếng Nhật..."
                value={formData.languages}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Mức lương mong muốn (VND)</label>
              <input
                id="salary"
                type="number"
                placeholder="15,000,000"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="objective">Mục tiêu nghề nghiệp</label>
            <textarea
              id="objective"
              rows={3}
              placeholder="Mô tả ngắn gọn về định hướng phát triển của bạn..."
              value={formData.objective}
              onChange={handleInputChange}
            />
          </div>
        </section>

        {/* ================= SECTION 4 ================= */}
        <section className="form-section">
          <h2>4. Đính kèm hồ sơ</h2>
          <div className="grid-2col file-upload-area">
            {/* Avatar */}
            <div
              className="file-upload-box"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarPreview ? (
                <>
                  <img
                    src={avatarPreview}
                    className="avatar-preview-img"
                    alt="Avatar"
                  />
                  <span className="file-hint">Nhấn để thay đổi ảnh</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                  <span className="file-label">Tải ảnh đại diện</span>
                  <span className="file-hint">JPG, PNG (Max 2MB)</span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                ref={avatarInputRef}
                onChange={handleAvatarChange}
              />
            </div>

            {/* CV */}
            <div
              className="file-upload-box"
              onClick={() => cvInputRef.current?.click()}
            >
              {cvFile ? (
                <>
                  <span
                    className={`material-symbols-outlined cv-icon-preview ${
                      cvFile.name.endsWith(".pdf") ? "is-pdf" : "is-word"
                    }`}
                  >
                    {cvFile.name.endsWith(".pdf")
                      ? "picture_as_pdf"
                      : "description"}
                  </span>
                  <span className="file-label file-name" title={cvFile.name}>
                    {cvFile.name}
                  </span>
                  <span className="file-hint">Nhấn để thay đổi CV</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">upload_file</span>
                  <span className="file-label">Tải lên CV (Hồ sơ)</span>
                  <span className="file-hint">PDF, DOC, DOCX (Max 5MB)</span>
                </>
              )}

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                ref={cvInputRef}
                onChange={handleCvChange}
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đăng ký ứng viên"}
          </button>
          <Link to="/login" className="btn-outline">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>

      <p className="terms-text">
        Bằng việc đăng ký, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </p>
    </div>
  );
};

export default RegisterCandidate;

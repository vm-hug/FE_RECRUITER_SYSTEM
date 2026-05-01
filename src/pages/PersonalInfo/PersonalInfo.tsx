import { useEffect, useState, useCallback } from "react";
import { Edit2, X, Upload, FileText, Camera, Eye } from "lucide-react";
import { userServices } from "../../services/userServices.service";
import commonServices from "../../services/commonServices.service";

import type {
  UserResponse,
  UpdateCandidatePayload,
} from "../../types/candidate/candidate.type";
import type {
  Level,
  WorkFormat,
  EducationLevel,
  Location,
} from "../../types/common.type";
import "./PersonalInfo.scss";
import Toast from "../../components/Toast/Toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const getAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  // Nếu đã là URL tuyệt đối (http/https) thì trả về nguyên
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.replace(/^\//, "");
  return `${API_BASE_URL}/${cleanPath}`;
};

export default function PersonalInfo() {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    languages: "",
    desiredSalary: "",
    careerObjective: "",
    levelId: "",
    workFormatId: "",
    educationLevelId: "",
    locationId: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvName, setCurrentCvName] = useState<string | null>(null);

  // Dropdown options
  const [levels, setLevels] = useState<Level[]>([]);
  const [workFormats, setWorkFormats] = useState<WorkFormat[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // CV viewer state
  const [cvViewerOpen, setCvViewerOpen] = useState(false);
  const [cvViewerUrl, setCvViewerUrl] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 4000);
  };

  const fetchOptions = useCallback(async () => {
    try {
      const [lvl, wf, edu, loc] = await Promise.all([
        commonServices.getLevel(),
        commonServices.getWorkFormats(),
        commonServices.getEducationLevels(),
        commonServices.getLocations(),
      ]);
      setLevels(lvl);
      setWorkFormats(wf);
      setEducationLevels(edu);
      setLocations(loc);
    } catch (error) {
      console.error("Lỗi tải dữ liệu chung:", error);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userServices.getMyInfo();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
    fetchOptions();
  }, [fetchUserInfo, fetchOptions]);

  const openModal = () => {
    if (!data?.candidate) return;
    const c = data.candidate;
    setForm({
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      phone: c.phone || "",
      languages: c.languages || "",
      desiredSalary: c.desiredSalary?.toString() || "",
      careerObjective: c.careerObjective || "",
      levelId: c.level?.id || "",
      workFormatId: c.workFormat?.id || "",
      educationLevelId: c.educationLevel?.id || "",
      locationId: c.location?.id || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setCvFile(null);
    setCurrentCvName(extractFileName(c.cvUrl));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const extractFileName = (url: string | null | undefined) => {
    if (!url) return null;
    const parts = url.split("/");
    return parts[parts.length - 1] || "CV.pdf";
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      alert("Ảnh tối đa 800KB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("CV tối đa 5MB");
      return;
    }
    setCvFile(file);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      alert("Vui lòng điền đầy đủ họ tên và số điện thoại");
      return;
    }

    const payload: UpdateCandidatePayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      languages: form.languages.trim(),
      desiredSalary: form.desiredSalary.trim(),
      careerObjective: form.careerObjective.trim(),
      levelId: form.levelId,
      workFormatId: form.workFormatId,
      educationLevelId: form.educationLevelId,
      locationId: form.locationId,
      avatarFile: avatarFile || null,
      cvFile: cvFile || null,
    };

    setSaving(true);
    try {
      const result = await userServices.updateCandidateProfile(payload);
      setData(result);
      showToast("Cập nhật trang cá nhân thành công!");
      closeModal();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Cập nhật không thành công. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // Mở viewer xem CV
  const openCvViewer = () => {
    if (!data?.candidate?.cvUrl) return;
    const fullUrl = getAssetUrl(data.candidate.cvUrl);
    if (fullUrl) {
      setCvViewerUrl(fullUrl);
      setCvViewerOpen(true);
    }
  };

  if (loading) {
    return (
      <section className="personal-info">
        <div className="personal-info__header">
          <h2 className="personal-info__title">Thông tin cá nhân</h2>
        </div>
        <div className="personal-info__body">
          <p className="text-muted">Đang tải...</p>
        </div>
      </section>
    );
  }

  if (!data?.candidate) {
    return (
      <section className="personal-info">
        <div className="personal-info__body">
          <p className="text-muted">Không có dữ liệu</p>
        </div>
      </section>
    );
  }

  const candidate = data.candidate;
  const avatarSrc = avatarPreview || getAssetUrl(candidate.avatarUrl);
  const cvUrlFull = getAssetUrl(candidate.cvUrl);

  return (
    <section className="personal-info">
      <div className="personal-info__header">
        <h2 className="personal-info__title">Thông tin cá nhân</h2>
        <button className="personal-info__edit-btn" onClick={openModal}>
          <Edit2 size={18} />
          Chỉnh sửa
        </button>
      </div>

      <div className="personal-info__body">
        {/* Profile card */}
        <div className="personal-info__profile-card">
          <div className="profile-card__user">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="profile-card__avatar"
              />
            ) : (
              <div className="profile-card__avatar profile-card__avatar--placeholder">
                {candidate.firstName?.charAt(0)}
                {candidate.lastName?.charAt(0)}
              </div>
            )}
            <div className="profile-card__name">
              <h3>
                {candidate.firstName} {candidate.lastName}
              </h3>
              <p>{data.email}</p>
            </div>
          </div>

          {/* CV info */}
          {cvUrlFull && (
            <div className="profile-card__cv">
              <FileText size={20} />
              <a href={cvUrlFull} target="_blank" rel="noreferrer">
                {extractFileName(candidate.cvUrl)}
              </a>
            </div>
          )}
        </div>

        {/* Thông tin cơ bản */}
        <div className="personal-info__section">
          <h3 className="section__title">Thông tin cơ bản</h3>
          <div className="section__grid">
            <div className="info-item">
              <span className="info-item__label">First Name</span>
              <span className="info-item__value">{candidate.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-item__label">Last Name</span>
              <span className="info-item__value">{candidate.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-item__label">Email</span>
              <span className="info-item__value">{data.email}</span>
            </div>
            <div className="info-item">
              <span className="info-item__label">Phone</span>
              <span className="info-item__value">{candidate.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-item__label">Languages</span>
              <span className="info-item__value">{candidate.languages}</span>
            </div>
          </div>
        </div>

        {/* Thông tin nghề nghiệp */}
        <div className="personal-info__section">
          <h3 className="section__title">Thông tin nghề nghiệp</h3>
          <div className="section__grid">
            <div className="info-item">
              <span className="info-item__label">Cấp bậc (Level)</span>
              <span className="info-item__value">{candidate.level?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-item__label">
                Hình thức làm việc (Work Format)
              </span>
              <span className="info-item__value">
                {candidate.workFormat?.name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-item__label">
                Trình độ học vấn (Education Level)
              </span>
              <span className="info-item__value">
                {candidate.educationLevel?.name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-item__label">Địa điểm (Location)</span>
              <span className="info-item__value">
                {candidate.location?.name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-item__label">
                Mức lương mong muốn (Desired Salary)
              </span>
              <span className="info-item__value">
                {candidate.desiredSalary?.toLocaleString()} VND
              </span>
            </div>
          </div>
          <div className="career-objective">
            <span className="info-item__label">
              Mục tiêu nghề nghiệp (Career Objective)
            </span>
            <p className="career-objective__text">
              {candidate.careerObjective}
            </p>
          </div>
        </div>

        {/* Nút Xem CV cuối trang */}
        {cvUrlFull && (
          <div className="personal-info__cv-viewer">
            <button className="cv-viewer-btn" onClick={openCvViewer}>
              <Eye size={20} />
              Xem CV
            </button>
          </div>
        )}
      </div>

      {/* Modal Chỉnh sửa */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Thay đổi thông tin cá nhân</h3>
              <button className="modal__close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal__body">
              {/* Avatar & CV */}
              <div className="edit-section">
                <div className="edit-section__avatar">
                  <div className="avatar-upload">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="avatar-preview"
                      />
                    ) : candidate.avatarUrl ? (
                      <img
                        src={getAssetUrl(candidate.avatarUrl)}
                        alt="Avatar"
                        className="avatar-preview"
                      />
                    ) : (
                      <div className="avatar-preview avatar-preview--placeholder">
                        <Camera size={32} />
                      </div>
                    )}
                    <label className="avatar-upload__btn">
                      <Upload size={16} />
                      Thay đổi Avatar
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleAvatarChange}
                        hidden
                      />
                    </label>
                    <p className="avatar-upload__hint">
                      JPG, GIF or PNG. Max size of 800K
                    </p>
                  </div>
                </div>

                <div className="edit-section__cv">
                  <label className="cv-upload">
                    <FileText size={20} />
                    <span>Tài liệu CV mới</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      hidden
                    />
                    <Upload size={16} />
                  </label>
                  <p className="cv-upload__hint">PDF, DOC, DOCX (Max 5MB)</p>
                  {currentCvName && !cvFile && (
                    <p className="cv-current">
                      Hiện tại:{" "}
                      <a
                        href={getAssetUrl(candidate.cvUrl)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {currentCvName}
                      </a>
                    </p>
                  )}
                  {cvFile && <p className="cv-new-file">Mới: {cvFile.name}</p>}
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="edit-section">
                <h4 className="edit-section__title">Thông tin cơ bản</h4>
                <div className="edit-section__grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      placeholder="First Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={data.email} disabled />
                    <small>Email không thể thay đổi.</small>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <label>Languages</label>
                    <input
                      type="text"
                      value={form.languages}
                      onChange={(e) =>
                        setForm({ ...form, languages: e.target.value })
                      }
                      placeholder="VD: Tiếng Anh, Tiếng Nhật"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin nghề nghiệp */}
              <div className="edit-section">
                <h4 className="edit-section__title">Thông tin nghề nghiệp</h4>
                <div className="edit-section__grid">
                  <div className="form-group">
                    <label>Cấp bậc (Level)</label>
                    <select
                      value={form.levelId}
                      onChange={(e) =>
                        setForm({ ...form, levelId: e.target.value })
                      }
                    >
                      <option value="">Chọn cấp bậc</option>
                      {levels.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hình thức làm việc (Work Format)</label>
                    <select
                      value={form.workFormatId}
                      onChange={(e) =>
                        setForm({ ...form, workFormatId: e.target.value })
                      }
                    >
                      <option value="">Chọn hình thức</option>
                      {workFormats.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trình độ học vấn (Education Level)</label>
                    <select
                      value={form.educationLevelId}
                      onChange={(e) =>
                        setForm({ ...form, educationLevelId: e.target.value })
                      }
                    >
                      <option value="">Chọn trình độ</option>
                      {educationLevels.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Địa điểm (Location)</label>
                    <select
                      value={form.locationId}
                      onChange={(e) =>
                        setForm({ ...form, locationId: e.target.value })
                      }
                    >
                      <option value="">Chọn địa điểm</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mức lương mong muốn (Desired Salary)</label>
                    <input
                      type="text"
                      value={form.desiredSalary}
                      onChange={(e) =>
                        setForm({ ...form, desiredSalary: e.target.value })
                      }
                      placeholder="25000000"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mục tiêu nghề nghiệp (Career Objective)</label>
                  <textarea
                    rows={4}
                    value={form.careerObjective}
                    onChange={(e) =>
                      setForm({ ...form, careerObjective: e.target.value })
                    }
                    placeholder="Mô tả mục tiêu nghề nghiệp của bạn"
                  />
                </div>
              </div>
            </div>

            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={closeModal}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className="modal__btn modal__btn--save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem CV */}
      {cvViewerOpen && cvViewerUrl && (
        <div className="modal-overlay" onClick={() => setCvViewerOpen(false)}>
          <div className="cv-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cv-viewer-modal__header">
              <h3>Xem CV</h3>
              <button
                className="modal__close"
                onClick={() => setCvViewerOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="cv-viewer-modal__content">
              <iframe
                src={cvViewerUrl}
                title="CV Viewer"
                className="cv-viewer-iframe"
              />
            </div>
            <div className="cv-viewer-modal__actions">
              <a
                href={cvViewerUrl}
                download
                className="modal__btn modal__btn--save"
              >
                Tải xuống
              </a>
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setCvViewerOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} isVisible={isToastVisible} />
    </section>
  );
}

import { useState, useEffect } from "react";
import {
  Building2,
  Pencil,
  Plus,
  MapPin,
  Globe,
  Users,
  Calendar,
  X,
  Upload,
  Phone,
  FileText,
  Mail,
} from "lucide-react";
import "./CompanyInfo.scss";
import type { CompanyResponse } from "../../../types/recruiter/company.type";
import { companyServices } from "../../../services/recruiter/company.service";
import commonServices from "../../../services/commonServices.service";
import type { Location } from "../../../types/common.type";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const getAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
};

interface CompanyInfoProps {
  company?: CompanyResponse | null;
  onRefresh: () => void;
}

const CompanyInfo = ({ company, onRefresh }: CompanyInfoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressDetail: "",
    phone: "",
    locationId: "",
    description: "",
    website: "",
    companySize: "",
    establishedYear: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await commonServices.getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa điểm", error);
      }
    };
    fetchLocations();
  }, []);

  const openModal = () => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        addressDetail: company.addressDetail || "",
        phone: company.phone || "",
        locationId: company.location?.id || "",
        description: company.description || "",
        website: company.website || "",
        companySize: company.companySize?.toString() || "",
        establishedYear: company.establishedYear?.toString() || "",
      });
      setAvatarPreview(
        company.avatarUrl ? getAssetUrl(company.avatarUrl) || null : null,
      );
    } else {
      setFormData({
        name: "",
        email: "",
        addressDetail: "",
        phone: "",
        locationId: "",
        description: "",
        website: "",
        companySize: "",
        establishedYear: "",
      });
      setAvatarPreview(null);
    }
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.locationId
    ) {
      alert("Vui lòng nhập Tên, Email, SĐT và chọn Tỉnh/Thành phố!");
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...formData, avatarUrl: avatarFile };
      if (company?.id) {
        await companyServices.update(company.id, payload);
      } else {
        await companyServices.create(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin công ty:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- TRẠNG THÁI: CHƯA CÓ CÔNG TY ---
  if (!company) {
    return (
      <>
        <div className="company-card empty-state" onClick={openModal}>
          <div className="empty-content">
            <div className="icon-wrapper">
              <Plus size={32} />
            </div>
            <h3>Chưa có thông tin Công ty</h3>
            <p>Bấm vào đây để thêm công ty cho tài khoản tuyển dụng của bạn</p>
          </div>
        </div>
        {renderModal()}
      </>
    );
  }

  // --- TRẠNG THÁI: ĐÃ CÓ CÔNG TY ---
  return (
    <>
      <div className="company-card">
        {/* HEADER */}
        <div className="company-card__header">
          <div className="header-titles">
            <h3>Thông tin công ty</h3>
            <p>
              Hồ sơ công ty sẽ hiển thị trên tất cả các tin tuyển dụng của bạn.
            </p>
          </div>
          <button className="edit-btn-pill" onClick={openModal}>
            <Pencil size={14} />
            Chỉnh sửa hồ sơ
          </button>
        </div>

        <div className="company-card__divider" />

        {/* BODY LAYOUT: LEFT & RIGHT */}
        <div className="company-card__body-layout">
          {/* CỘT TRÁI: LOGO & TÊN */}
          <div className="layout-left">
            <div className="company-logo-box">
              {company.avatarUrl ? (
                <img
                  src={getAssetUrl(company.avatarUrl)}
                  alt="Company Avatar"
                />
              ) : (
                <Building2 size={48} color="#cbd5e1" />
              )}
            </div>
            <h2 className="company-name-bold">{company.name}</h2>
            {/* Nếu API tương lai có trường Tên đầy đủ, bạn có thể thay thế vào đây */}
            <p className="company-name-full">Công ty {company.name}</p>

            {/* Dummy Tags giống như thiết kế */}
            <div className="company-tags">
              <span className="tag">IT - Phần mềm</span>
              <span className="tag">Cloud</span>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="layout-right">
            <div className="info-grid-modern">
              <div className="info-item">
                <span className="info-label">
                  <Mail size={14} /> EMAIL LIÊN HỆ
                </span>
                <span className="info-value">{company.email}</span>
              </div>

              <div className="info-item">
                <span className="info-label">
                  <Phone size={14} /> ĐIỆN THOẠI
                </span>
                <span className="info-value">{company.phone}</span>
              </div>

              <div className="info-item full-width">
                <span className="info-label">
                  <Globe size={14} /> WEBSITE
                </span>
                <a
                  className="info-value link-purple"
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {company.website || "Chưa cập nhật"}
                </a>
              </div>

              <div className="info-item full-width">
                <span className="info-label">
                  <MapPin size={14} /> ĐỊA CHỈ CHI TIẾT
                </span>
                <span className="info-value">
                  {company.addressDetail}{" "}
                  {company.location?.name && `, ${company.location.name}`}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">
                  <Users size={14} /> QUY MÔ CÔNG TY
                </span>
                <span className="info-value">
                  {company.companySize
                    ? `${company.companySize} employees`
                    : "Chưa cập nhật"}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">
                  <Calendar size={14} /> NĂM THÀNH LẬP
                </span>
                <span className="info-value">
                  {company.establishedYear || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="description-section">
              <span className="info-label">
                <FileText size={14} /> MÔ TẢ CÔNG TY
              </span>
              <div className="description-box">
                {company.description || "Chưa có mô tả công ty."}
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </>
  );

  function renderModal() {
    if (!isModalOpen) return null;
    return (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div
          className="edit-modal company-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="edit-modal__header">
            <h2>{company ? "Cập nhật Công ty" : "Thêm Công ty mới"}</h2>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="edit-modal__body scrollable-body">
            {/* Modal Body giống như cũ của bạn */}
            <div className="avatar-upload-section">
              <div className="preview-box">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" />
                ) : (
                  <Building2 size={40} color="#ccc" />
                )}
              </div>
              <label className="upload-btn">
                <Upload size={14} /> Tải Logo lên
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tên công ty *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Công ty TNHH ABC"
                />
              </div>
              <div className="form-group">
                <label>Email liên hệ *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="abc@company.com"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0123456789"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quy mô (Số nhân viên)</label>
                <input
                  type="number"
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData({ ...formData, companySize: e.target.value })
                  }
                  placeholder="VD: 100"
                />
              </div>
              <div className="form-group">
                <label>Năm thành lập</label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      establishedYear: e.target.value,
                    })
                  }
                  placeholder="VD: 2020"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Tỉnh/Thành phố (Location) *</label>
              <select
                value={formData.locationId}
                onChange={(e) =>
                  setFormData({ ...formData, locationId: e.target.value })
                }
                className="location-select"
              >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Địa chỉ chi tiết</label>
              <input
                type="text"
                value={formData.addressDetail}
                onChange={(e) =>
                  setFormData({ ...formData, addressDetail: e.target.value })
                }
                placeholder="Số nhà, đường..."
              />
            </div>
            <div className="form-group">
              <label>Mô tả công ty</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Giới thiệu về công ty..."
              />
            </div>
          </div>
          <div className="edit-modal__footer">
            <button
              className="btn-cancel"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default CompanyInfo;

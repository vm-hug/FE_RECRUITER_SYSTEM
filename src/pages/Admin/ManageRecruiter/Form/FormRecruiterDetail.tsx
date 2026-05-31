import React from "react";
import { X, Mail, ShieldAlert, Award, Building } from "lucide-react";
import "./FormRecruiterDetail.scss";
import type { RecruiterResponse } from "../../../../types/admin/recruiter-manager.type";

interface Props {
  open: boolean;
  recruiter: RecruiterResponse;
  onClose: () => void;
}

const FormRecruiterDetail: React.FC<Props> = ({ recruiter, onClose }) => {
  const getInitials = (name: string) => {
    if (!name) return "RE";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="recruiter-detail-overlay" onClick={onClose}>
      <div
        className="recruiter-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="detail-header">
          <h2>Chi tiết tài khoản Nhà tuyển dụng</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body hiển thị dữ liệu */}
        <div className="detail-body">
          {/* Card Top Tóm Tắt */}
          <div className="recruiter-summary-card">
            <div className="summary-avatar-fallback">
              {getInitials(recruiter.name)}
            </div>
            <div className="summary-info">
              <h3>{recruiter.name}</h3>
              <span
                className={`status-badge-tag ${recruiter.recruiterStatus?.toLowerCase()}`}
              >
                {recruiter.recruiterStatus === "HOAT_DONG"
                  ? "Hoạt động"
                  : recruiter.recruiterStatus === "CHO_XAC_MINH"
                    ? "Chờ xác minh"
                    : "Bị khóa"}
              </span>
            </div>
          </div>

          {/* Khối Thông Tin Chi Tiết Grid */}
          <div className="info-section-wrapper">
            <h4 className="section-title">Hồ sơ định danh</h4>

            <div className="fields-grid">
              <div className="field-item">
                <Mail size={16} className="icon" />
                <div>
                  <span className="label">Hộp thư điện tử</span>
                  <p className="value">{recruiter.email}</p>
                </div>
              </div>

              <div className="field-item">
                <Award size={16} className="icon" />
                <div>
                  <span className="label">Chức vụ đảm nhận</span>
                  <p className="value">
                    {recruiter.position || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="field-item full-width">
                <Building size={16} className="icon" />
                <div>
                  <span className="label">Doanh nghiệp công tác</span>
                  <p className="value">
                    {recruiter.companyName ||
                      "Chưa đăng ký tổ chức doanh nghiệp"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lưu ý kiểm duyệt bảo mật */}
          <div className="security-notice-box">
            <ShieldAlert size={18} />
            <p>
              Vui lòng kiểm tra kỹ danh tiếng tổ chức và email doanh nghiệp
              trước khi phê duyệt quyền phân phối tin tuyển dụng đại chúng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRecruiterDetail;

import React, { useEffect, useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Award,
  BookOpen,
  Briefcase,
  FileText,
} from "lucide-react";

import "./FormCandidate.scss";
import type { CandidateResponseManager } from "../../../../types/admin/candidate-manager.type";
import { candidateManagerServices } from "../../../../services/admin/candidate-manager.service";
import { getImageUrl } from "../../../../helper/loadImage.util";

interface Props {
  open: boolean;
  candidateId: string;
  onClose: () => void;
}

const FormCandidate: React.FC<Props> = ({ candidateId, onClose }) => {
  const [candidate, setCandidate] = useState<CandidateResponseManager | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await candidateManagerServices.getById(candidateId);
        setCandidate(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết ứng viên:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [candidateId]);

  return (
    <div className="candidate-form-overlay" onClick={onClose}>
      <div
        className="candidate-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="form-header">
          <h2>Hồ sơ chi tiết ứng viên</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading && (
          <div className="form-loading">Đang tải thông tin hồ sơ...</div>
        )}

        {!loading && candidate && (
          <div className="form-body">
            {/* HỒ SƠ TÓM TẮT TRÊN CÙNG */}
            <div className="profile-summary-card">
              {candidate.avatarUrl ? (
                <img
                  src={getImageUrl(candidate.avatarUrl)}
                  alt=""
                  className="summary-avatar"
                />
              ) : (
                <div className="summary-avatar-fallback">
                  {candidate.firstName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="summary-details">
                <h3>
                  {candidate.lastName} {candidate.firstName}
                </h3>
                <span className="badge-status-text">
                  {candidate.candidateStatus}
                </span>
              </div>
            </div>

            {/* THÔNG TIN LIÊN HỆ */}
            <div className="detail-section">
              <h4 className="section-title">Thông tin liên hệ</h4>
              <div className="info-grid">
                <div className="info-item">
                  <Mail size={16} className="icon" />
                  <div>
                    <span className="label">Địa chỉ Email</span>
                    <p className="value">{candidate.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={16} className="icon" />
                  <div>
                    <span className="label">Số điện thoại</span>
                    <p className="value">
                      {candidate.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin size={16} className="icon" />
                  <div>
                    <span className="label">Địa điểm sinh sống</span>
                    <p className="value">
                      {candidate.location?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIÊU CHÍ NGHỀ NGHIỆP */}
            <div className="detail-section">
              <h4 className="section-title">Tiêu chí công việc kì vọng</h4>
              <div className="info-grid">
                <div className="info-item">
                  <Award size={16} className="icon" />
                  <div>
                    <span className="label">Cấp bậc chuyên môn</span>
                    <p className="value">
                      {candidate.level?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <Briefcase size={16} className="icon" />
                  <div>
                    <span className="label">Hình thức làm việc</span>
                    <p className="value">
                      {candidate.workFormat?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <DollarSign size={16} className="icon" />
                  <div>
                    <span className="label">Mức lương mong muốn</span>
                    <p className="value">
                      {candidate.desiredSalary
                        ? `${candidate.desiredSalary.toLocaleString()} USD`
                        : "Thỏa thuận"}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <BookOpen size={16} className="icon" />
                  <div>
                    <span className="label">Trình độ học vấn</span>
                    <p className="value">
                      {candidate.educationLevel?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KHỐI TEXT CHI TIẾT */}
            <div className="detail-section text-block">
              <h4 className="section-title">Ngoại ngữ văn bằng</h4>
              <p className="block-content">
                {candidate.languages || "Không có thông tin ghi nhận"}
              </p>
            </div>

            <div className="detail-section text-block">
              <h4 className="section-title">Mục tiêu nghề nghiệp</h4>
              <p className="block-content">
                {candidate.careerObjective || "Không có thông tin ghi nhận"}
              </p>
            </div>

            {/* NÚT TẢI XUỐNG CV NẾU CÓ */}
            {candidate.cvUrl && (
              <div className="form-actions">
                <a
                  href={getImageUrl(candidate.cvUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="download-cv-link"
                >
                  <FileText size={16} /> Xem bản gốc CV ứng viên
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCandidate;

import React from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Calendar,
  Info,
} from "lucide-react";

import "./FormCompanyDetail.scss";
import type { CompanyResponse } from "../../../../types/admin/company.type";
import { getImageUrl } from "../../../../helper/loadImage.util";

interface Props {
  open: boolean;
  company: CompanyResponse;
  onClose: () => void;
}

const FormCompanyDetail: React.FC<Props> = ({ company, onClose }) => {
  return (
    <div className="company-detail-overlay" onClick={onClose}>
      <div
        className="company-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="detail-header">
          <h2>Chi tiết thông tin doanh nghiệp</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body hiển thị dữ liệu */}
        <div className="detail-body">
          {/* Card Hồ Sơ Tổng Quan */}
          <div className="company-profile-summary">
            {company.avatarUrl ? (
              <img
                src={getImageUrl(company.avatarUrl)}
                alt={company.name}
                className="summary-logo"
              />
            ) : (
              <div className="summary-logo-fallback">
                {company.name ? company.name.charAt(0).toUpperCase() : "C"}
              </div>
            )}
            <div className="summary-text">
              <h3>{company.name}</h3>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="website-link"
                >
                  <Globe size={14} /> {company.website}
                </a>
              )}
            </div>
          </div>

          {/* Liên hệ và Bản đồ */}
          <div className="info-block-section">
            <h4 className="block-title">Thông tin liên lạc</h4>
            <div className="fields-grid">
              <div className="field-item">
                <Mail size={16} className="icon" />
                <div>
                  <span className="label">Email liên hệ</span>
                  <p className="value">{company.email}</p>
                </div>
              </div>
              <div className="field-item">
                <Phone size={16} className="icon" />
                <div>
                  <span className="label">Số điện thoại</span>
                  <p className="value">{company.phone || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="field-item full-width">
                <MapPin size={16} className="icon" />
                <div>
                  <span className="label">Địa chỉ trụ sở chính</span>
                  <p className="value">
                    {company.addressDetail}{" "}
                    {company.location ? `, ${company.location.name}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quy mô & Chỉ số thành lập */}
          <div className="info-block-section">
            <h4 className="block-title">Tổng quan quy mô</h4>
            <div className="fields-grid">
              <div className="field-item">
                <Users size={16} className="icon" />
                <div>
                  <span className="label">Quy mô nhân sự</span>
                  <p className="value">
                    {company.companySize
                      ? `${company.companySize} nhân viên`
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="field-item">
                <Calendar size={16} className="icon" />
                <div>
                  <span className="label">Năm thành lập</span>
                  <p className="value">
                    {company.establishedYear
                      ? `Năm ${company.establishedYear}`
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Khối mô tả chi tiết bài viết văn bản */}
          <div className="info-block-section description-block">
            <h4 className="block-title">
              <Info size={16} /> Giới thiệu về doanh nghiệp
            </h4>
            <div className="description-content">
              {company.description ? (
                <p>{company.description}</p>
              ) : (
                <p className="no-data">
                  Doanh nghiệp chưa cập nhật bài viết giới thiệu chi tiết.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCompanyDetail;

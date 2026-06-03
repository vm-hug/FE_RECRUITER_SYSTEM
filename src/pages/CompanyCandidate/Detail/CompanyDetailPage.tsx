import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Globe,
  Users,
  Calendar,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

import "./CompanyDetailPage.scss";
import type { CompanyResponse } from "../../../types/admin/company.type";
import { companyServices } from "../../../services/admin/company.service";
import { getImageUrl } from "../../../helper/loadImage.util";

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await companyServices.getById(id);
        setCompany(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công ty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        Đang tải thông tin doanh nghiệp...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="error-container">
        Không tìm thấy thông tin doanh nghiệp.
      </div>
    );
  }

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "C";

  return (
    <div className="company-detail-page">
      {/* Hero Banner Container */}
      <div className="cdp-banner-wrapper">
        {/* Giả lập cover image mặc định vì API không có coverUrl */}
        <div
          className="cover-image"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')",
          }}
        ></div>

        <div className="profile-overlap-card">
          <div className="profile-main">
            <div className="avatar-wrapper">
              {company.avatarUrl ? (
                <img
                  src={getImageUrl(company.avatarUrl)}
                  alt={company.name}
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-fallback">
                  {getInitial(company.name)}
                </div>
              )}
            </div>

            <div className="profile-info">
              <h1>{company.name}</h1>
              <div className="meta-row">
                <span className="meta-item">
                  <MapPin size={16} />{" "}
                  {company.location?.name || "Chưa cập nhật"}
                </span>
                {company.website && (
                  <span className="meta-item">
                    <Globe size={16} />{" "}
                    {company.website.replace(/^https?:\/\//, "")}
                  </span>
                )}
                <span className="meta-item">
                  <Users size={16} />{" "}
                  {company.companySize
                    ? `${company.companySize} Employees`
                    : "N/A"}
                </span>
                <span className="meta-item">
                  <Calendar size={16} /> Est. {company.establishedYear || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="website-btn"
              >
                <Globe size={16} /> Website
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="cdp-content-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="info-card">
            <h2 className="card-title">
              <Building2 size={20} color="#7c3aed" /> Giới thiệu công ty
            </h2>
            <div className="card-body description-content">
              {company.description ? (
                <p>{company.description}</p>
              ) : (
                <p className="no-data">
                  Doanh nghiệp chưa cập nhật bài viết giới thiệu.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="info-card">
            <h2 className="card-title">Thông tin liên hệ</h2>
            <div className="card-body lists">
              <div className="list-item">
                <div className="icon-wrap map">
                  <MapPin size={16} />
                </div>
                <div className="text-wrap">
                  <span className="label">Headquarters</span>
                  <p className="value">
                    {company.addressDetail}{" "}
                    {company.location ? `, ${company.location.name}` : ""}
                  </p>
                </div>
              </div>

              <div className="list-item">
                <div className="icon-wrap mail">
                  <Mail size={16} />
                </div>
                <div className="text-wrap">
                  <span className="label">Email</span>
                  <a href={`mailto:${company.email}`} className="value link">
                    {company.email}
                  </a>
                </div>
              </div>

              <div className="list-item">
                <div className="icon-wrap phone">
                  <Phone size={16} />
                </div>
                <div className="text-wrap">
                  <span className="label">Phone</span>
                  <p className="value">{company.phone || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">Thông tin doanh nghiệp</h2>
            <div className="card-body">
              <div className="business-stats-grid">
                <div className="stat-box">
                  <span className="stat-label">SIZE</span>
                  <p className="stat-value">
                    {company.companySize
                      ? company.companySize.toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="stat-box">
                  <span className="stat-label">ESTABLISHED</span>
                  <p className="stat-value">
                    {company.establishedYear || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;

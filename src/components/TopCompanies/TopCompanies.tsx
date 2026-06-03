import React, { useEffect, useState } from "react";
import { companyServices } from "../../services/recruiter/company.service"; // Đảm bảo đường dẫn import chuẩn xác
import type { CompanyResponse } from "../../types/recruiter/company.type";
import "./TopCompanies.scss";
import { getImageUrl } from "../../helper/loadImage.util";
import { useNavigate } from "react-router-dom";

// Bảng màu cho logo mặc định (fallback)
const FALLBACK_COLORS = [
  { bg: "#e0f2fe", color: "#0284c7" },
  { bg: "#fce7f3", color: "#db2777" },
  { bg: "#fef3c7", color: "#d97706" },
  { bg: "#f3e8ff", color: "#7c3aed" },
];

const TopCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        setLoading(true);
        // Lấy 4 công ty nổi bật/mới nhất
        const res = await companyServices.getAll({
          size: 4,
          sortBy: "id", // Bạn có thể tùy chỉnh sortBy theo API
          sortDir: "desc",
        });
        setCompanies(res.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách công ty hàng đầu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "C";

  return (
    <section className="top-companies">
      <div className="container">
        <h2 className="section-title">Công ty hàng đầu</h2>

        {loading ? (
          <div className="loading-state">
            Đang tải thông tin doanh nghiệp...
          </div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            Hiện chưa có công ty nào trên hệ thống.
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map((company, index) => {
              const colorScheme =
                FALLBACK_COLORS[index % FALLBACK_COLORS.length];

              return (
                <div
                  className="company-card"
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                >
                  <div className="company-logo-wrapper">
                    {company.avatarUrl ? (
                      <img
                        src={getImageUrl(company.avatarUrl)}
                        alt={company.name}
                      />
                    ) : (
                      <div
                        className="logo-fallback"
                        style={{
                          backgroundColor: colorScheme.bg,
                          color: colorScheme.color,
                        }}
                      >
                        {getInitial(company.name)}
                      </div>
                    )}
                  </div>

                  <h3 title={company.name}>
                    {company.name.length > 25
                      ? company.name.substring(0, 25) + "..."
                      : company.name}
                  </h3>

                  <div className="company-info">
                    <p className="address-text" title={company.addressDetail}>
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      {company.addressDetail
                        ? company.addressDetail.length > 30
                          ? company.addressDetail.substring(0, 30) + "..."
                          : company.addressDetail
                        : "Chưa cập nhật"}
                    </p>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="material-symbols-outlined">
                          language
                        </span>
                        Website
                      </a>
                    ) : (
                      <span className="no-website">
                        <span className="material-symbols-outlined">
                          language
                        </span>
                        Chưa cập nhật
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="action-wrapper">
          <button
            className="view-more-btn"
            onClick={() => navigate("/companies")}
          >
            Xem thêm công ty
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;

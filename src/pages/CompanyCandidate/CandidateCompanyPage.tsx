import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./CandidateCompanyPage.scss";
import type { CompanyResponse } from "../../types/admin/company.type";
import { companyServices } from "../../services/admin/company.service";
import { getImageUrl } from "../../helper/loadImage.util";

const PAGE_SIZE = 9;

// Bảng màu ngẫu nhiên cho logo chữ
const LOGO_COLORS = [
  { bg: "#e0f2fe", color: "#0284c7" },
  { bg: "#fce7f3", color: "#db2777" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fef3c7", color: "#d97706" },
  { bg: "#f3e8ff", color: "#7c3aed" },
];

const CandidateCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyServices.getAll({
        keyword: keyword || undefined,
        page: page,
        size: PAGE_SIZE,
        sortBy: "id",
        sortDir: "desc",
      });
      setCompanies(res.content);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput);
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase() : "CO";

  const getColorScheme = (id: string) => {
    const num = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return LOGO_COLORS[num % LOGO_COLORS.length];
  };

  return (
    <div className="candidate-company-page">
      {/* Hero Banner Section */}
      <div className="ccp-hero">
        <div className="hero-content">
          <h1>Khám phá các công ty hàng đầu</h1>
          <p>
            Tìm kiếm môi trường làm việc lý tưởng tiếp theo của bạn trong số
            hàng ngàn doanh nghiệp hàng đầu.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Tên công ty, từ khóa..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="ccp-container">
        <div className="ccp-header-filters">
          <div className="result-count">Hiển thị kết quả tìm kiếm</div>
          <div className="sort-by">
            <span>Sắp xếp theo:</span>
            <select>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Đang tải danh sách công ty...</div>
        ) : companies.length === 0 ? (
          <div className="empty-state">Không tìm thấy công ty nào phù hợp.</div>
        ) : (
          <div className="company-grid">
            {companies.map((company) => {
              const colors = getColorScheme(company.id);
              return (
                <div key={company.id} className="company-card">
                  <div className="card-header">
                    {company.avatarUrl ? (
                      <img
                        src={getImageUrl(company.avatarUrl)}
                        alt={company.name}
                        className="company-logo"
                      />
                    ) : (
                      <div
                        className="company-logo-fallback"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.color,
                        }}
                      >
                        {getInitial(company.name)}
                      </div>
                    )}
                    <span className="top-employer-badge">✓ Top Employer</span>
                  </div>

                  <h3
                    className="company-name"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    {company.name}
                  </h3>

                  <div className="company-meta">
                    <span className="meta-item">
                      <MapPin size={14} /> {company.location?.name || "N/A"}
                    </span>
                    <span className="meta-item">
                      <Users size={14} />{" "}
                      {company.companySize ? `${company.companySize}+` : "N/A"}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} /> {company.establishedYear || "N/A"}
                    </span>
                  </div>

                  <p className="company-desc">
                    {company.description
                      ? company.description.length > 120
                        ? company.description.substring(0, 120) + "..."
                        : company.description
                      : "Chưa có mô tả chi tiết."}
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn-detail"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      Xem chi tiết
                    </button>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-website"
                      >
                        Website
                      </a>
                    ) : (
                      <button className="btn-website disabled" disabled>
                        Website
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="ccp-pagination">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`page-btn ${page === idx ? "active" : ""}`}
                onClick={() => setPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCompanyPage;

import React, { useEffect, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, Building } from "lucide-react";
import "./CompanyManagerPage.scss";

import type { CompanyResponse } from "../../../types/admin/company.type";
import { companyServices } from "../../../services/admin/company.service";
import FormCompanyDetail from "./Form/FormCompanyDetail";
import { getImageUrl } from "../../../helper/loadImage.util";

const PAGE_SIZE = 10;
const LOGO_COLORS = [
  { bg: "#e0f2fe", color: "#0284c7" }, // Xanh dương
  { bg: "#fce7f3", color: "#db2777" }, // Hồng
  { bg: "#f0fdf4", color: "#16a34a" }, // Xanh lá
  { bg: "#fef3c7", color: "#d97706" }, // Vàng
];

const CompanyManagerPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // States bộ lọc & phân trang
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Map lưu trữ màu sắc logo fallback cố định theo ID công ty
  const [companyColorMap, setCompanyColorMap] = useState<
    Record<string, { bg: string; color: string }>
  >({});

  // States quản lý Modal xem chi tiết công ty
  const [openDetailForm, setOpenDetailForm] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyResponse | null>(null);

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
      setTotalElements(res.totalElements);

      // Gán màu fallback ngẫu nhiên cố định cho những doanh nghiệp thiếu avatar
      setCompanyColorMap((prev) => {
        const newMap = { ...prev };
        res.content.forEach((company) => {
          if (!newMap[company.id]) {
            const randomScheme =
              LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
            newMap[company.id] = randomScheme;
          }
        });
        return newMap;
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách doanh nghiệp:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi thay đổi trang hoặc gõ tìm kiếm từ khóa
  useEffect(() => {
    fetchCompanies();
  }, [page, keyword]);

  // Phân cấp màu sắc hiển thị Badge quy mô nhân sự
  const getSizeClass = (size: number) => {
    if (!size) return "size-default";
    if (size <= 50) return "size-small";
    if (size <= 200) return "size-medium";
    return "size-large";
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "C";
  };

  return (
    <div className="company-manager-page">
      {/* Header */}
      <div className="cmp-header">
        <h1>Quản lý công ty</h1>
        <p>Manage and monitor registered companies on the platform.</p>
      </div>

      {/* Toolbar */}
      <div className="cmp-toolbar-card">
        <div className="search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, email or location..."
            value={keyword}
            onChange={(e) => {
              setPage(0);
              setKeyword(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="cmp-table-card">
        <div className="table-responsive">
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>COMPANY NAME</th>
                <th style={{ width: "25%" }}>CONTACT INFO</th>
                <th style={{ width: "20%" }}>LOCATION</th>
                <th style={{ width: "15%" }}>SIZE</th>
                <th style={{ width: "10%" }} className="text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Đang tải thông tin dữ liệu doanh nghiệp...
                  </td>
                </tr>
              )}
              {!loading && companies.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Không tìm thấy doanh nghiệp nào phù hợp.
                  </td>
                </tr>
              )}
              {!loading &&
                companies.map((company) => {
                  const colorScheme = companyColorMap[company.id] || {
                    bg: "#f1f5f9",
                    color: "#475569",
                  };
                  return (
                    <tr key={company.id}>
                      <td>
                        <div className="company-info">
                          {company.avatarUrl ? (
                            <img
                              src={getImageUrl(company.avatarUrl)}
                              alt=""
                              className="company-logo-img"
                            />
                          ) : (
                            <div
                              className="company-logo-fallback"
                              style={{
                                backgroundColor: colorScheme.bg,
                                color: colorScheme.color,
                              }}
                            >
                              {getInitial(company.name)}
                            </div>
                          )}
                          <span className="main-text">{company.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span className="main-text font-normal">
                            {company.email}
                          </span>
                          <span className="sub-text">
                            {company.phone || "Chưa cập nhật"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="regular-text">
                          {company.location?.name || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`size-badge ${getSizeClass(company.companySize)}`}
                        >
                          {company.companySize
                            ? `${company.companySize} nhân sự`
                            : "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view-btn"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedCompany(company);
                              setOpenDetailForm(true);
                            }}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="cmp-pagination">
          <div className="showing-text">
            Showing <strong>{page * PAGE_SIZE + 1}</strong> to{" "}
            <strong>{Math.min((page + 1) * PAGE_SIZE, totalElements)}</strong>{" "}
            of <strong>{totalElements}</strong> companies
          </div>
          <div className="page-controls">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
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
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết thông tin công ty */}
      {openDetailForm && selectedCompany && (
        <FormCompanyDetail
          open={openDetailForm}
          company={selectedCompany}
          onClose={() => {
            setOpenDetailForm(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanyManagerPage;

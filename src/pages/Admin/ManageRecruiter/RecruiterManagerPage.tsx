import React, { useEffect, useState } from "react";
import {
  Search,
  Building2,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./RecruiterManagerPage.scss";
import type { RecruiterResponse } from "../../../types/admin/recruiter-manager.type";
import { recruiterManagerServices } from "../../../services/admin/recruiter-manager.service";
import FormRecruiterDetail from "./Form/FormRecruiterDetail";

const PAGE_SIZE = 10;
const AVATAR_COLORS = [
  { bg: "#e9d5ff", color: "#7c3aed" }, // Tím
  { bg: "#e0e7ff", color: "#4f46e5" }, // Xanh dương
  { bg: "#fae8ff", color: "#c026d3" }, // Hồng
  { bg: "#fef3c7", color: "#d97706" }, // Vàng
];

const RecruiterManagerPage: React.FC = () => {
  const [recruiters, setRecruiters] = useState<RecruiterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  // Phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Lưu trữ mã màu fallback ngẫu nhiên cố định theo email nhà tuyển dụng
  const [colorMap, setColorMap] = useState<
    Record<string, { bg: string; color: string }>
  >({});

  // Quản lý Modal chi tiết
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] =
    useState<RecruiterResponse | null>(null);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const res = await recruiterManagerServices.search({
        keyword: keyword || undefined,
        page: page,
        size: PAGE_SIZE,
        sortBy: "name",
        sortDir: "desc",
      });

      setRecruiters(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);

      // Thiết lập bảng màu ngẫu nhiên cho avatar text fallback
      setColorMap((prev) => {
        const newMap = { ...prev };
        res.content.forEach((rec) => {
          if (!newMap[rec.email]) {
            const randomScheme =
              AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
            newMap[rec.email] = randomScheme;
          }
        });
        return newMap;
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhà tuyển dụng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, [page, keyword]);

  // Hành động Approve nhanh hồ sơ tuyển dụng trực tiếp từ bảng dữ liệu
  const handleApprove = async (id: string) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn phê duyệt tài khoản nhà tuyển dụng này?",
      )
    )
      return;
    try {
      await recruiterManagerServices.approveRecruiter(id);
      fetchRecruiters(); // Reload danh sách sau khi duyệt thành công
    } catch (error) {
      console.error("Lỗi phê duyệt tài khoản nhà tuyển dụng:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "RE";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="recruiter-manager-page">
      {/* Header */}
      <div className="rmp-header">
        <h1>Quản lý nhà tuyển dụng</h1>
        <p>View, search, and manage recruiter accounts in the system.</p>
      </div>

      {/* Toolbar */}
      <div className="rmp-toolbar-card">
        <div className="search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm kiếm thông tin của nhà tuyển dụng......."
            value={keyword}
            onChange={(e) => {
              setPage(0);
              setKeyword(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rmp-table-card">
        <div className="table-responsive">
          <table className="rmp-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>RECRUITER NAME</th>
                <th style={{ width: "20%" }}>POSITION</th>
                <th style={{ width: "25%" }}>COMPANY</th>
                <th style={{ width: "15%" }}>TRẠNG THÁI</th>
                <th style={{ width: "10%" }} className="text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Đang truy vấn dữ liệu nhà tuyển dụng...
                  </td>
                </tr>
              )}
              {!loading && recruiters.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Không tìm thấy tài khoản nhà tuyển dụng nào.
                  </td>
                </tr>
              )}
              {!loading &&
                recruiters.map((recruiter, idx) => {
                  const scheme = colorMap[recruiter.email] || {
                    bg: "#f1f5f9",
                    color: "#475569",
                  };
                  // Trả về rowKey duy nhất
                  const rowKey = recruiter.email || idx.toString();

                  return (
                    <tr key={rowKey}>
                      <td>
                        <div className="recruiter-info">
                          {/* Lưu ý: Interface gốc trả về avatarUrl, bạn có thể chỉnh lại cho khớp với API response thực tế */}
                          <div
                            className="avatar-fallback"
                            style={{
                              backgroundColor: scheme.bg,
                              color: scheme.color,
                            }}
                          >
                            {getInitials(recruiter.name)}
                          </div>
                          <div className="details">
                            <span className="main-text">{recruiter.name}</span>
                            <span className="sub-text">{recruiter.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="regular-text">
                          {recruiter.position || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <div className="company-info">
                          <div className="company-icon">
                            <Building2 size={16} />
                          </div>
                          <span className="regular-text">
                            {recruiter.companyName || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Cột hiển thị Trạng thái tĩnh kết hợp nút Duyệt trực tiếp nếu là Chờ xác minh */}
                      <td>
                        <div className="status-cell">
                          {recruiter.recruiterStatus === "HOAT_DONG" ? (
                            <span className="status-pill active">
                              Hoạt động
                            </span>
                          ) : recruiter.recruiterStatus === "CHO_XAC_MINH" ? (
                            <div className="pending-action-wrapper">
                              <span className="status-pill pending">
                                Chờ xác minh
                              </span>
                              <div className="inline-actions">
                                {/* Sử dụng email làm định danh ID tạm thời gửi xuống hàm approve nếu interface không định nghĩa id */}
                                <button
                                  className="action-btn confirm"
                                  title="Phê duyệt tài khoản"
                                  onClick={() => handleApprove(recruiter.id)}
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="status-pill blocked">Bị khóa</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view-btn"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedRecruiter(recruiter);
                              setOpenDetail(true);
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
        <div className="rmp-pagination">
          <div className="showing-text">
            Showing <strong>{page * PAGE_SIZE + 1}</strong> to{" "}
            <strong>{Math.min((page + 1) * PAGE_SIZE, totalElements)}</strong>{" "}
            of <strong>{totalElements}</strong> entries
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

      {/* Modal chi tiết thông tin nhà tuyển dụng */}
      {openDetail && selectedRecruiter && (
        <FormRecruiterDetail
          open={openDetail}
          recruiter={selectedRecruiter}
          onClose={() => {
            setOpenDetail(false);
            setSelectedRecruiter(null);
          }}
        />
      )}
    </div>
  );
};

export default RecruiterManagerPage;

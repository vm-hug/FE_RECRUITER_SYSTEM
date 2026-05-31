import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./CandidateManagerPage.scss";
import { candidateManagerServices } from "../../../services/admin/candidate-manager.service";
import type {
  CandidateResponseManager,
  UserStatus,
} from "../../../types/admin/candidate-manager.type";
import type {
  EducationLevel,
  Level,
  WorkFormat,
} from "../../../types/common.type";

import commonServices from "../../../services/commonServices.service";
import FormCandidate from "./Form/FormCandidate";
import { getImageUrl } from "../../../helper/loadImage.util";

const PAGE_SIZE = 10;

const CandidateManagerPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateResponseManager[]>([]);
  const [loading, setLoading] = useState(false);

  // States danh mục bộ lọc hệ thống
  const [levels, setLevels] = useState<Level[]>([]);
  const [workFormats, setWorkFormats] = useState<WorkFormat[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);

  // States bộ lọc & phân trang đang chọn
  const [keyword, setKeyword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedWorkFormat, setSelectedWorkFormat] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State cập nhật trạng thái nhanh inline
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<UserStatus>("HOAT_DONG");

  // States quản lý Modal Xem chi tiết & Xem CV
  const [openForm, setOpenForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateResponseManager | null>(null);
  const [activeCvUrl, setActiveCvUrl] = useState<string | null>(null);

  // 1. Tải toàn bộ danh mục bộ lọc từ API dùng chung
  useEffect(() => {
    const fetchFilterCategories = async () => {
      try {
        const [lvlData, formatData, eduData] = await Promise.all([
          commonServices.getLevel(),
          commonServices.getWorkFormats(),
          commonServices.getEducationLevels(),
        ]);
        setLevels(lvlData);
        setWorkFormats(formatData);
        setEducationLevels(eduData);
      } catch (error) {
        console.error("Lỗi khi tải danh mục bộ lọc:", error);
      }
    };
    fetchFilterCategories();
  }, []);

  // 2. Hàm gọi API tìm kiếm ứng viên phân trang
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await candidateManagerServices.search({
        keyword: keyword || undefined,
        levelId: selectedLevel || undefined,
        workFormatId: selectedWorkFormat || undefined,
        page: page,
        size: PAGE_SIZE,
        sortBy: "id",
        sortDir: "desc",
      });
      setCandidates(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng viên:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, keyword, selectedLevel, selectedWorkFormat, selectedEducation]);

  // 3. Reset bộ lọc về mặc định
  const handleResetFilters = () => {
    setKeyword("");
    setSelectedLevel("");
    setSelectedWorkFormat("");
    setSelectedEducation("");
    setPage(0);
  };

  const handleStatusChange = (id: string, newStatus: UserStatus) => {
    setEditingRowId(id);
    setTempStatus(newStatus);
  };

  const confirmStatusUpdate = async (id: string) => {
    try {
      await candidateManagerServices.updateStatus(id, { status: tempStatus });
      setEditingRowId(null);
      fetchCandidates();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái ứng viên:", error);
    }
  };

  const cancelStatusUpdate = () => {
    setEditingRowId(null);
  };

  // Trả về class màu sắc hiển thị động theo trạng thái của Backend
  const getStatusClass = (status: UserStatus) => {
    switch (status) {
      case "HOAT_DONG":
        return "active";
      case "CHO_XAC_MINH":
        return "pending";
      case "BI_KHOA":
        return "cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="candidate-manager-page">
      {/* Header */}
      <div className="cmp-header">
        <h1>Quản lý ứng viên</h1>
        <p>
          Quản lý, tìm kiếm và theo dõi hồ sơ ứng viên trên hệ thống quản trị.
        </p>
      </div>

      {/* Toolbar bộ lọc */}
      <div className="cmp-toolbar-card">
        <div className="toolbar-filters">
          <div className="filter-item search-item">
            <label>Tìm kiếm</label>
            <div className="input-wrapper">
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={keyword}
                onChange={(e) => {
                  setPage(0);
                  setKeyword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="filter-item">
            <label>Cấp bậc</label>
            <select
              className="filter-select-element"
              value={selectedLevel}
              onChange={(e) => {
                setPage(0);
                setSelectedLevel(e.target.value);
              }}
            >
              <option value="">Tất cả cấp bậc</option>
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Hình thức làm việc</label>
            <select
              className="filter-select-element"
              value={selectedWorkFormat}
              onChange={(e) => {
                setPage(0);
                setSelectedWorkFormat(e.target.value);
              }}
            >
              <option value="">Tất cả hình thức</option>
              {workFormats.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Trình độ học vấn</label>
            <select
              className="filter-select-element"
              value={selectedEducation}
              onChange={(e) => {
                setPage(0);
                setSelectedEducation(e.target.value);
              }}
            >
              <option value="">Tất cả trình độ</option>
              {educationLevels.map((edu) => (
                <option key={edu.id} value={edu.id}>
                  {edu.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="reset-btn" onClick={handleResetFilters}>
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="cmp-table-card">
        <div className="table-responsive">
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>AVATAR</th>
                <th style={{ width: "22%" }}>HỌ VÀ TÊN</th>
                <th style={{ width: "20%" }}>LIÊN HỆ</th>
                <th style={{ width: "12%" }}>LEVEL</th>
                <th style={{ width: "15%" }}>MỨC LƯƠNG</th>
                <th style={{ width: "15%" }}>TRẠNG THÁI</th>
                <th style={{ width: "5%" }}>CV</th>
                <th style={{ width: "8%" }} className="text-right">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    Đang tải hồ sơ ứng viên...
                  </td>
                </tr>
              )}
              {!loading && candidates.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    Không có dữ liệu ứng viên phù hợp.
                  </td>
                </tr>
              )}
              {!loading &&
                candidates.map((candidate) => {
                  const isEditing = editingRowId === candidate.id;
                  const displayStatus = isEditing
                    ? tempStatus
                    : candidate.candidateStatus;

                  return (
                    <tr key={candidate.id}>
                      <td>
                        {candidate.avatarUrl ? (
                          <img
                            src={getImageUrl(candidate.avatarUrl)}
                            alt=""
                            className="avatar-img"
                          />
                        ) : (
                          <div className="avatar-fallback">
                            {candidate.firstName?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="info-cell">
                          <span className="main-text">
                            {candidate.lastName} {candidate.firstName}
                          </span>
                          <span className="sub-text">
                            {candidate.location?.name || "Chưa cập nhật"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="info-cell">
                          <span className="main-text font-normal">
                            {candidate.email}
                          </span>
                          <span className="sub-text">
                            {candidate.phone || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="level-badge purple">
                          {candidate.level?.name || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <span className="salary-text">
                          {candidate.desiredSalary
                            ? `${candidate.desiredSalary.toLocaleString()} USD`
                            : "Thỏa thuận"}
                        </span>
                      </td>

                      {/* Cột Trạng thái inline select */}
                      <td>
                        <div className="status-cell">
                          <select
                            className={`status-select ${getStatusClass(displayStatus)}`}
                            value={displayStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                candidate.id,
                                e.target.value as UserStatus,
                              )
                            }
                          >
                            <option value="HOAT_DONG">Hoạt động</option>
                            <option value="CHO_XAC_MINH">Chờ xác minh</option>
                            <option value="BI_KHOA">Bị khóa</option>
                          </select>

                          {isEditing && (
                            <div className="inline-actions">
                              <button
                                className="action-btn confirm"
                                onClick={() =>
                                  confirmStatusUpdate(candidate.id)
                                }
                              >
                                <Check size={14} />
                              </button>
                              <button
                                className="action-btn cancel"
                                onClick={cancelStatusUpdate}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          className={`cv-icon-btn ${candidate.cvUrl ? "active" : "disabled"}`}
                          disabled={!candidate.cvUrl}
                          title={
                            candidate.cvUrl
                              ? "Xem tài liệu CV"
                              : "Chưa tải CV lên"
                          }
                          onClick={() => setActiveCvUrl(candidate.cvUrl)}
                        >
                          <FileText size={18} />
                        </button>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view-btn"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setOpenForm(true);
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
            Hiển thị <strong>{page * PAGE_SIZE + 1}</strong> đến{" "}
            <strong>{Math.min((page + 1) * PAGE_SIZE, totalElements)}</strong>{" "}
            trong số <strong>{totalElements}</strong> ứng viên
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

      {/* Modal chi tiết thông tin ứng viên */}
      {openForm && selectedCandidate && (
        <FormCandidate
          open={openForm}
          candidateId={selectedCandidate.id}
          onClose={() => {
            setOpenForm(false);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* Modal Iframe xem CV trực tiếp */}
      {activeCvUrl && (
        <div
          className="cv-preview-overlay"
          onClick={() => setActiveCvUrl(null)}
        >
          <div
            className="cv-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-preview-btn"
              onClick={() => setActiveCvUrl(null)}
            >
              ✕
            </button>
            <iframe
              src={getImageUrl(activeCvUrl)}
              title="Candidate CV Preview"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagerPage;

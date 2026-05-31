import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import "./AuthorPage.scss";
import type { AuthorResponse } from "../../../types/admin/author.type";
import { authorServices } from "../../../services/admin/author.service";
import FormAuthor from "./Form/FormAuthor";
import { getImageUrl } from "../../../helper/loadImage.util";

const PAGE_SIZE = 5;
const BADGE_COLORS = ["blue", "pink", "gray", "purple"];

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<AuthorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Map lưu trữ màu sắc cố định ngẫu nhiên theo ID tác giả để không bị đổi màu khi re-render
  const [authorColorMap, setAuthorColorMap] = useState<Record<string, string>>(
    {},
  );

  // States quản lý Modal Form
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(
    null,
  );

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await authorServices.getAll({
        keyword: searchKeyword || undefined,
        page: page,
        size: PAGE_SIZE,
        sortBy: "id",
        sortDir: "desc",
      });

      setAuthors(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);

      // Tạo màu ngẫu nhiên cố định cho những tác giả mới chưa có trong map
      setAuthorColorMap((prev) => {
        const newMap = { ...prev };
        res.content.forEach((author) => {
          if (!newMap[author.id]) {
            const randomColor =
              BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];
            newMap[author.id] = randomColor;
          }
        });
        return newMap;
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách tác giả:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi thay đổi trang hoặc gõ từ khóa tìm kiếm
  useEffect(() => {
    fetchAuthors();
  }, [page, searchKeyword]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tác giả này không?")) return;
    try {
      await authorServices.delete(id);
      fetchAuthors();
    } catch (error) {
      console.error("Lỗi khi xóa tác giả:", error);
    }
  };

  return (
    <div className="author-page">
      {/* Header */}
      <div className="ap-header-wrapper">
        <div className="ap-header-text">
          <h1>Quản lý tác giả</h1>
          <p>Quản lý thông tin tác giả bài viết trên nền tảng.</p>
        </div>
      </div>

      {/* Toolbar (Search & Add) */}
      <div className="ap-toolbar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm kiếm tác giả theo tên..."
            value={searchKeyword}
            onChange={(e) => {
              setPage(0);
              setSearchKeyword(e.target.value);
            }}
          />
        </div>

        <button
          className="create-btn"
          onClick={() => {
            setFormMode("create");
            setSelectedAuthor(null);
            setOpenForm(true);
          }}
        >
          <Plus size={18} /> Thêm tác giả
        </button>
      </div>

      {/* Main Table */}
      <div className="ap-table-card">
        <div className="table-responsive">
          <table className="ap-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>ID</th>
                <th style={{ width: "15%" }}>AVATAR</th>
                <th style={{ width: "30%" }}>TÊN TÁC GIẢ</th>
                <th style={{ width: "20%" }}>CHỨC VỤ</th>
                <th style={{ width: "15%" }} className="text-right">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ padding: "24px", color: "#64748b" }}
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!loading && authors.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ padding: "24px", color: "#64748b" }}
                  >
                    Không tìm thấy tác giả nào.
                  </td>
                </tr>
              )}
              {!loading &&
                authors.map((author) => {
                  const badgeColor = authorColorMap[author.id] || "gray";
                  return (
                    <tr key={author.id}>
                      <td>
                        <span className="author-id">#{author.id}</span>
                      </td>
                      <td>
                        {author.avatarUrl ? (
                          <img
                            src={getImageUrl(author.avatarUrl)}
                            alt={author.name}
                            className="author-avatar"
                          />
                        ) : (
                          <div className="author-avatar-fallback">
                            {author.name?.charAt(0).toUpperCase() || (
                              <User size={16} />
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="author-name">{author.name}</span>
                      </td>
                      <td>
                        <span className={`position-badge ${badgeColor}`}>
                          {author.position}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-btn view-btn"
                            title="Xem"
                            onClick={() => {
                              setSelectedAuthor(author);
                              setFormMode("view");
                              setOpenForm(true);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="icon-btn edit-btn"
                            title="Sửa"
                            onClick={() => {
                              setSelectedAuthor(author);
                              setFormMode("edit");
                              setOpenForm(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn delete-btn"
                            title="Xóa"
                            onClick={() => handleDelete(author.id)}
                          >
                            <Trash2 size={16} />
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
        <div className="ap-pagination">
          <div className="showing-text">
            Hiển thị <strong>{page * PAGE_SIZE + 1}</strong> -{" "}
            <strong>{Math.min((page + 1) * PAGE_SIZE, totalElements)}</strong>{" "}
            của <strong>{totalElements}</strong> tác giả
          </div>
          <div className="page-controls">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-btn ${page === index ? "active" : ""}`}
                onClick={() => setPage(index)}
              >
                {index + 1}
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

      {/* Modal Form component */}
      {openForm && (
        <FormAuthor
          open={openForm}
          mode={formMode}
          author={selectedAuthor}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false);
            fetchAuthors();
          }}
        />
      )}
    </div>
  );
};

export default AuthorPage;

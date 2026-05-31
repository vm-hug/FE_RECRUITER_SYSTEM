import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ArticleManagerPage.scss";
import type { CategoryArticleResponse } from "../../../types/articles/categoryArticle/category.type";
import type {
  ArticleResponse,
  ArticleStatus,
} from "../../../types/admin/article.type";
import { categoryArticleService } from "../../../services/articles/category/category.service";
import { articleServices } from "../../../services/admin/article.service";
import FormArticle from "./Form/FormArticle";
import { getImageUrl } from "../../../helper/loadImage.util";

const PAGE_SIZE = 10;

const ArticleManagerPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [categories, setCategories] = useState<CategoryArticleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // States bộ lọc & phân trang
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Thay đổi trạng thái inline nhanh
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<ArticleStatus>("DRAFT");

  // States quản lý Modal Form (Thêm / Sửa / Xem)
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedArticle, setSelectedArticle] =
    useState<ArticleResponse | null>(null);

  // Tải danh mục bài viết ban đầu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryArticleService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Tải danh sách bài viết theo bộ lọc từ API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleServices.search({
        keyword: keyword || undefined,
        categoryId: selectedCategory || undefined,
        status: (selectedStatus as ArticleStatus) || undefined,
        page: page,
        size: PAGE_SIZE,
        sortBy: "createdAt",
        sortDir: "desc",
      });
      setArticles(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, keyword, selectedCategory, selectedStatus]);

  const handleStatusChange = (id: string, newStatus: ArticleStatus) => {
    setEditingRowId(id);
    setTempStatus(newStatus);
  };

  const confirmStatusUpdate = async (id: string) => {
    try {
      await articleServices.updateStatus(id, { status: tempStatus });
      setEditingRowId(null);
      fetchArticles(); // Tải lại danh sách sau khi lưu thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const cancelStatusUpdate = () => {
    setEditingRowId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?"))
      return;
    try {
      await articleServices.delete(id);
      fetchArticles();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  return (
    <div className="article-manager-page">
      {/* Header */}
      <div className="amp-header-wrapper">
        <div className="amp-header-text">
          <h1>Quản lý bài viết</h1>
          <p>Quản lý nội dung cẩm nang nghề nghiệp</p>
        </div>
        <button
          className="create-btn"
          onClick={() => {
            setFormMode("create");
            setSelectedArticle(null);
            setOpenForm(true);
          }}
        >
          <Plus size={18} /> Thêm bài viết
        </button>
      </div>

      {/* Toolbar */}
      <div className="amp-toolbar-card">
        <div className="toolbar-left">
          <div className="search-box">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề, tác giả..."
              value={keyword}
              onChange={(e) => {
                setPage(0);
                setKeyword(e.target.value);
              }}
            />
          </div>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => {
              setPage(0);
              setSelectedCategory(e.target.value);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => {
              setPage(0);
              setSelectedStatus(e.target.value);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="amp-table-card">
        <div className="table-responsive">
          <table className="amp-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>THUMBNAIL</th>
                <th style={{ width: "35%" }}>TIÊU ĐỀ</th>
                <th style={{ width: "15%" }}>TÁC GIẢ</th>
                <th style={{ width: "15%" }}>DANH MỤC</th>
                <th style={{ width: "15%" }}>TRẠNG THÁI</th>
                <th style={{ width: "10%" }}>NGÀY TẠO</th>
                <th style={{ width: "10%" }} className="text-right">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Đang tải dữ liệu bài viết...
                  </td>
                </tr>
              )}
              {!loading && articles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Không có bài viết nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
              {!loading &&
                articles.map((article) => {
                  const isEditing = editingRowId === article.id;
                  const displayStatus = isEditing ? tempStatus : article.status;

                  return (
                    <tr key={article.id}>
                      <td>
                        {article.thumbnailUrl ? (
                          <img
                            src={getImageUrl(article.thumbnailUrl)}
                            alt="Thumbnail"
                            className="article-thumb"
                          />
                        ) : (
                          <div className="article-thumb-fallback">
                            <ImageIcon size={20} color="#94a3b8" />
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="article-title">{article.title}</span>
                      </td>
                      <td>
                        <div className="author-info">
                          {article.authorAvatar ? (
                            <img
                              src={getImageUrl(article.authorAvatar)}
                              alt=""
                              className="author-img-thumb"
                            />
                          ) : (
                            <div className="author-avatar-initial">
                              {article.authorName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="author-name">
                            {article.authorName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="category-text">
                          {article.categoryName}
                        </span>
                      </td>

                      <td>
                        <div className="status-cell">
                          <select
                            className={`status-badge-select ${displayStatus.toLowerCase()}`}
                            value={displayStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                article.id,
                                e.target.value as ArticleStatus,
                              )
                            }
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="DELETED">DELETED</option>
                          </select>

                          {isEditing && (
                            <div className="inline-actions">
                              <button
                                className="action-btn confirm"
                                onClick={() => confirmStatusUpdate(article.id)}
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
                        <span className="date-text">
                          {new Date(article.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view-btn"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedArticle(article);
                              setFormMode("view");
                              setOpenForm(true);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="icon-btn edit-btn"
                            title="Chỉnh sửa"
                            onClick={() => {
                              setSelectedArticle(article);
                              setFormMode("edit");
                              setOpenForm(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn delete-btn"
                            title="Xóa"
                            onClick={() => handleDelete(article.id)}
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
        <div className="amp-pagination">
          <div className="showing-text">
            Hiển thị <strong>{page * PAGE_SIZE + 1}</strong> -{" "}
            <strong>{Math.min((page + 1) * PAGE_SIZE, totalElements)}</strong>{" "}
            của <strong>{totalElements}</strong> bài viết
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

      {/* Form Dialog Modal */}
      {openForm && (
        <FormArticle
          open={openForm}
          mode={formMode}
          article={selectedArticle}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false);
            fetchArticles();
          }}
        />
      )}
    </div>
  );
};

export default ArticleManagerPage;

import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

import "./FormArticle.scss";
import type {
  ArticlePayload,
  ArticleResponse,
  ArticleStatus,
} from "../../../../types/admin/article.type";
import type { CategoryArticleResponse } from "../../../../types/articles/categoryArticle/category.type";
import type { AuthorResponse } from "../../../../types/admin/author.type";
import { categoryArticleService } from "../../../../services/articles/category/category.service";
import { authorServices } from "../../../../services/admin/author.service";
import { articleServices } from "../../../../services/admin/article.service";
import { getImageUrl } from "../../../../helper/loadImage.util";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  article?: ArticleResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FormArticle: React.FC<Props> = ({
  mode,
  article,
  onClose,
  onSuccess,
}) => {
  const isView = mode === "view";
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States chứa danh mục gốc hệ thống từ API
  const [categories, setCategories] = useState<CategoryArticleResponse[]>([]);
  const [authors, setAuthors] = useState<AuthorResponse[]>([]);

  const [formData, setFormData] = useState<ArticlePayload>({
    title: "",
    slug: "",
    content: "",
    authorId: "",
    categoryId: "",
    status: "DRAFT",
    thumbnailFile: null,
  });

  // Tải danh mục và tác giả từ API khi Modal mở ra
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const [catData, authorData] = await Promise.all([
          categoryArticleService.getAll(),
          authorServices.getAll({ page: 0, size: 100 }), // Lấy danh sách authors rộng rãi để chọn
        ]);
        setCategories(catData);
        setAuthors(authorData.content || []);
      } catch (error) {
        console.error("Lỗi khi tải thông tin danh mục / tác giả:", error);
      }
    };
    fetchRequiredData();
  }, []);

  // Điền dữ liệu cũ vào Form nếu là chỉnh sửa hoặc xem chi tiết
  useEffect(() => {
    if (article) {
      setPreview(article.thumbnailUrl || "");
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        content: article.content || "",
        authorId: article.authorId || "",
        categoryId: article.categoryId || "",
        status: article.status || "DRAFT",
        thumbnailFile: null,
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      if (mode === "create") {
        await articleServices.create(formData);
      } else if (mode === "edit" && article) {
        await articleServices.update(article.id, formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý bài viết:", error);
      alert("Gặp lỗi trong quá trình lưu bài viết. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="article-form-overlay" onClick={onClose}>
      <div className="article-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="form-header">
          <div>
            <h2>
              {mode === "create" && "Tạo bài viết cẩm nang mới"}
              {mode === "edit" && "Cập nhật bài viết"}
              {mode === "view" && "Chi tiết bài viết"}
            </h2>
            <p className="sub-text">
              Soạn thảo bài viết định hướng nghề nghiệp, cẩm nang tuyển dụng
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="form-body">
          {/* TIÊU ĐỀ & TRẠNG THÁI */}
          <div className="form-section">
            <div className="grid-2-col">
              <div className="input-group">
                <label>
                  Tiêu đề bài viết <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text font-bold">{formData.title}</p>
                ) : (
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nhập tiêu đề hấp dẫn, chuẩn SEO..."
                  />
                )}
              </div>

              <div className="grid-2-col">
                <div className="input-group">
                  <label>Đường dẫn Slug (Tùy chọn)</label>
                  {isView ? (
                    <p className="view-text">
                      {formData.slug || "Tự động sinh"}
                    </p>
                  ) : (
                    <input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="bi-quyet-viet-cv-it"
                    />
                  )}
                </div>
                <div className="input-group">
                  <label>Trạng thái hiển thị</label>
                  {isView ? (
                    <p className="view-text badge-text">{formData.status}</p>
                  ) : (
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as ArticleStatus,
                        })
                      }
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DELETED">DELETED</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* CHỌN TÁC GIẢ & DANH MỤC */}
            <div className="grid-2-col">
              <div className="input-group">
                <label>
                  Tác giả bài viết <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{article?.authorName}</p>
                ) : (
                  <select
                    required
                    value={formData.authorId}
                    onChange={(e) =>
                      setFormData({ ...formData, authorId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn tác giả biên soạn --</option>
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name} ({auth.position})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="input-group">
                <label>
                  Chuyên mục nội dung <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{article?.categoryName}</p>
                ) : (
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn chuyên mục phân loại --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* BANNER THUMBNAIL */}
          <div className="form-section">
            <label className="section-label">Hình ảnh Thumbnail đại diện</label>
            <div className="upload-container">
              {!isView && (
                <label className="upload-box">
                  <Upload size={24} color="#7c3aed" />
                  <span>Tải ảnh bìa bài viết lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, thumbnailFile: file });
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
              {preview && (
                <div className="image-preview-wrapper">
                  <img
                    src={
                      preview.startsWith("blob:")
                        ? preview
                        : getImageUrl(preview)
                    }
                    alt="Thumbnail Article"
                    className="preview-img"
                  />
                </div>
              )}
            </div>
          </div>

          {/* NỘI DUNG BÀI VIẾT CHUYÊN SÂU */}
          <div className="form-section">
            <div className="input-group">
              <label>
                Nội dung bài viết chi tiết <span className="required">*</span>
              </label>
              {isView ? (
                <div
                  className="view-html-content"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              ) : (
                <textarea
                  required
                  className="article-textarea"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Hỗ trợ viết mã HTML hoặc văn bản thường để đăng bài viết..."
                />
              )}
            </div>
          </div>

          {/* Footer nút hành động */}
          {!isView && (
            <div className="form-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={submitting}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Đang xử lý..."
                  : mode === "create"
                    ? "Đăng bài viết"
                    : "Cập nhật bài viết"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormArticle;

import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

import "./FormAuthor.scss";
import type {
  AuthorPayload,
  AuthorResponse,
} from "../../../../types/admin/author.type";
import { authorServices } from "../../../../services/admin/author.service";
import { getImageUrl } from "../../../../helper/loadImage.util";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  author?: AuthorResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FormAuthor: React.FC<Props> = ({ mode, author, onClose, onSuccess }) => {
  const isView = mode === "view";
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<AuthorPayload>({
    name: "",
    position: "",
    avatarUrl: null,
  });

  useEffect(() => {
    if (author) {
      setPreview(author.avatarUrl || "");
      setFormData({
        name: author.name || "",
        position: author.position || "",
        avatarUrl: null, // Không ghi đè string URL vào File object payload
      });
    }
  }, [author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      if (mode === "create") {
        await authorServices.create(formData);
      } else if (mode === "edit" && author) {
        await authorServices.update(author.id, formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin tác giả:", error);
      alert("Đã xảy ra lỗi hệ thống, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="author-form-overlay" onClick={onClose}>
      <div className="author-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="form-header">
          <div>
            <h2>
              {mode === "create" && "Thêm tác giả mới"}
              {mode === "edit" && "Cập nhật tác giả"}
              {mode === "view" && "Chi tiết hồ sơ tác giả"}
            </h2>
            <p className="sub-text">
              Cập nhật đầy đủ thông tin định danh tác giả trên hệ thống bài viết
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="form-body">
          {/* PHẦN HÌNH ẢNH AVATAR */}
          <div className="form-section text-center-upload">
            <label className="section-title">Hình ảnh đại diện</label>
            <div className="upload-avatar-container">
              {!isView && (
                <label className="upload-avatar-box">
                  <Upload size={20} color="#7c3aed" />
                  <span>Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, avatarUrl: file });
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
              <div className="avatar-preview-wrapper">
                {preview ? (
                  <img
                    src={getImageUrl(preview)}
                    alt="Avatar"
                    className="preview-img"
                  />
                ) : (
                  <div className="preview-fallback">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PHẦN THÔNG TIN CHỮ */}
          <div className="form-section">
            <div className="input-group">
              <label>
                Họ và tên tác giả <span className="required">*</span>
              </label>
              {isView ? (
                <p className="view-text font-bold">{formData.name}</p>
              ) : (
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên đầy đủ (Ví dụ: Nguyễn Văn A)"
                />
              )}
            </div>

            <div className="input-group">
              <label>
                Chức vụ / Vị trí công tác <span className="required">*</span>
              </label>
              {isView ? (
                <p className="view-text">{formData.position}</p>
              ) : (
                <input
                  required
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="Ví dụ: Chuyên gia Nhân sự, Biên tập viên..."
                />
              )}
            </div>
          </div>

          {/* Footer nút điều hướng */}
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
                    ? "Thêm tác giả"
                    : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAuthor;

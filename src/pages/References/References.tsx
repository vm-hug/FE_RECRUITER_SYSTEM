import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import "./References.scss";
import type { Reference } from "../../types/candidate/candidate.type"; // đường dẫn tùy cấu trúc của bạn
import referenceService from "../../services/candidate/reference.service";

interface ReferenceFormData {
  name: string;
  position: string;
  company: string;
  phone: string;
  contactInfo: string;
  relationship: string;
}

const emptyForm: ReferenceFormData = {
  name: "",
  position: "",
  company: "",
  phone: "",
  contactInfo: "",
  relationship: "",
};

export default function References() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReferenceFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch danh sách khi mount
  const fetchReferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await referenceService.getMyReferences();
      setReferences(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tham chiếu:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  // Mở form thêm
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  // Mở form sửa
  const openEditForm = (id: string) => {
    const ref = references.find((r) => r.id === id);
    if (!ref) return;
    setEditingId(id);
    setFormData({
      name: ref.name,
      position: ref.position || ref.relationship,
      company: ref.companyName,
      phone: ref.phone || "",
      contactInfo: ref.contactInfo,
      relationship: ref.relationship,
    });
    setIsFormOpen(true);
  };

  // Xoá
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người tham chiếu này?"))
      return;
    try {
      await referenceService.delete(id);
      setReferences((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá:", error);
      alert("Không thể xoá. Vui lòng thử lại.");
    }
  };

  // Lưu form (thêm hoặc sửa)
  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.position.trim() ||
      !formData.company.trim()
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    // Chuẩn bị dữ liệu theo interface Reference
    const referenceData = {
      name: formData.name.trim(),
      companyName: formData.company.trim(),
      position: formData.position.trim(),
      phone: formData.phone.trim(),
      contactInfo: formData.contactInfo.trim(), // có thể tách riêng nếu cần
      relationship: formData.relationship.trim(),
      initials: formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };

    setIsSaving(true);
    try {
      if (editingId) {
        // Cập nhật
        const updated = await referenceService.update(editingId, referenceData);
        setReferences((prev) =>
          prev.map((r) => (r.id === editingId ? updated : r)),
        );
      } else {
        // Thêm mới
        const created = await referenceService.create(
          referenceData as Omit<Reference, "id">,
        );
        setReferences((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Không thể lưu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="references">
        <div className="references__header">
          <h2 className="references__title">Người tham chiếu</h2>
        </div>
        <div className="references__body">
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="references">
      <div className="references__header">
        <h2 className="references__title">Người tham chiếu</h2>
        <button
          className="references__add-btn"
          aria-label="Thêm người tham chiếu"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Thêm
        </button>
      </div>

      <div className="references__body">
        {references.length === 0 ? (
          <p className="references__empty">Chưa có người tham chiếu nào.</p>
        ) : (
          references.map((ref) => (
            <div key={ref.id} className="references__card">
              <div className="references__user-info">
                <div className="references__initials">{ref.initials}</div>
                <div>
                  <h4 className="references__name">{ref.name}</h4>
                  <p className="references__details">
                    <span className="references__relationship">
                      {ref.relationship}
                    </span>
                    <span> tại </span>
                    <span className="references__company">
                      {ref.companyName}
                    </span>
                    <span> • </span>
                    <span className="references__phone">{ref.contactInfo}</span>
                  </p>
                </div>
              </div>

              <div className="references__actions">
                <button
                  className="references__action-btn edit"
                  aria-label="Sửa"
                  onClick={() => openEditForm(ref.id)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="references__action-btn delete"
                  aria-label="Xoá"
                  onClick={() => handleDelete(ref.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal form thêm/sửa */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editingId ? "Sửa" : "Thêm"} Người tham chiếu
              </h3>
              <button
                className="modal__close"
                onClick={() => setIsFormOpen(false)}
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>
            <p className="modal__description">
              Thêm thông tin người có thể xác nhận kỹ năng và kinh nghiệm làm
              việc của bạn.
            </p>

            <div className="modal__form">
              <label className="form-group">
                <span>Tên người tham chiếu *</span>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </label>
              <label className="form-group">
                <span>Chức vụ *</span>
                <input
                  type="text"
                  placeholder="VD: Giám đốc Kỹ thuật"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </label>
              <label className="form-group">
                <span>Công ty *</span>
                <input
                  type="text"
                  placeholder="VD: Công ty TNHH Giải pháp Công nghệ"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </label>
              <label className="form-group">
                <span>Số điện thoại</span>
                <input
                  type="tel"
                  placeholder="090 123 4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </label>
              <label className="form-group">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="nguyenvana@example.com"
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                />
              </label>
              <label className="form-group">
                <span>Mối quan hệ / Ghi chú</span>
                <textarea
                  placeholder="Mô tả ngắn gọn về mối quan hệ công việc (VD: Quản lý trực tiếp tại dự án X)"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relationship: e.target.value,
                    })
                  }
                  rows={3}
                />
              </label>
            </div>

            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setIsFormOpen(false)}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                className="modal__btn modal__btn--save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? "Đang lưu..."
                  : editingId
                    ? "Cập nhật"
                    : "Lưu tham chiếu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

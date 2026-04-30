import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Briefcase } from "lucide-react";
import "./WorkExperience.scss";
import type { WorkExperience } from "../../types/candidate/candidate.type";
import workExperienceService from "../../services/candidate/workExperience.service";

interface ExperienceFormData {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const emptyForm: ExperienceFormData = {
  jobTitle: "",
  companyName: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

export default function WorkExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workExperienceService.getMyExperiences();
      console.log("data", data);
      setExperiences(data);
    } catch (error) {
      console.error("Lỗi khi tải kinh nghiệm:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Hàm định dạng ngày tháng hiển thị
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      year: "numeric",
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    setEditingId(id);
    setFormData({
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
      isCurrent: exp.isCurrent,
      description: exp.description || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá kinh nghiệm này?")) return;
    try {
      await workExperienceService.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Xoá thất bại:", error);
      alert("Không thể xoá. Vui lòng thử lại.");
    }
  };

  const handleSave = async () => {
    if (
      !formData.jobTitle.trim() ||
      !formData.companyName.trim() ||
      !formData.startDate
    ) {
      alert(
        "Vui lòng điền đầy đủ các trường bắt buộc: Chức danh, Công ty, Ngày bắt đầu.",
      );
      return;
    }

    const payload = {
      jobTitle: formData.jobTitle.trim(),
      companyName: formData.companyName.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      isCurrent: formData.isCurrent,
      description: formData.description.trim(),
    };

    console.log(`PayLoad : ${payload}`);

    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await workExperienceService.update(editingId, payload);
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingId ? updated : e)),
        );
      } else {
        const created = await workExperienceService.create(
          payload as Omit<WorkExperience, "id">,
        );
        setExperiences((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Lưu thất bại:", error);
      alert("Không thể lưu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="work-experience">
        <div className="work-experience__header">
          <h2 className="work-experience__title">Kinh nghiệm làm việc</h2>
        </div>
        <div className="work-experience__body">
          <p className="work-experience__loading">Đang tải...</p>
        </div>
      </section>
    );
  }

  const sortedExperiences = [...experiences].sort((a, b) => {
    const getDate = (exp: WorkExperience) => {
      if (exp.isCurrent) return new Date();
      return new Date(exp.endDate || exp.startDate);
    };

    return getDate(a).getTime() - getDate(b).getTime();
  });

  return (
    <section className="work-experience">
      <div className="work-experience__header">
        <h2 className="work-experience__title">Kinh nghiệm làm việc</h2>
        <button
          className="work-experience__add-btn"
          aria-label="Thêm kinh nghiệm"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Thêm kinh nghiệm
        </button>
      </div>

      <div className="work-experience__body">
        {experiences.length === 0 ? (
          <div className="work-experience__empty">
            <Briefcase size={48} strokeWidth={1} />
            <p>Chưa có kinh nghiệm làm việc</p>
            <button className="work-experience__cta-add" onClick={openAddForm}>
              <Plus size={16} />
              Thêm kinh nghiệm đầu tiên
            </button>
          </div>
        ) : (
          <div className="work-experience__timeline">
            {sortedExperiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                <div className="experience-card__indicator">
                  <div className="experience-card__dot" />
                  <div className="experience-card__line" />
                </div>
                <div className="experience-card__content">
                  <div className="experience-card__header">
                    <h3 className="experience-card__title">{exp.jobTitle}</h3>
                    <div className="experience-card__actions">
                      <button
                        className="experience-card__action-btn edit"
                        aria-label="Sửa"
                        onClick={() => openEditForm(exp.id)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="experience-card__action-btn delete"
                        aria-label="Xoá"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="experience-card__company">{exp.companyName}</p>
                  <p className="experience-card__duration">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Hiện tại" : formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="experience-card__description">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editingId ? "Sửa" : "Thêm"} kinh nghiệm
              </h3>
              <button
                className="modal__close"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal__form">
              <div className="form-group">
                <span>Chức danh *</span>
                <input
                  type="text"
                  placeholder="VD: Frontend Developer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <span>Công ty *</span>
                <input
                  type="text"
                  placeholder="VD: Công ty TNHH ABC"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <span>Ngày bắt đầu *</span>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <span>Ngày kết thúc</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? "" : formData.endDate,
                    })
                  }
                />
                <span>Tôi đang làm việc tại đây</span>
              </label>
              <div className="form-group">
                <span>Mô tả</span>
                <textarea
                  placeholder="Mô tả công việc, thành tựu..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
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
                    : "Lưu kinh nghiệm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

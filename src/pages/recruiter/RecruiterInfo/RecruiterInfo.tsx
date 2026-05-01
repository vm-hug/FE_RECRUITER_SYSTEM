import { useState } from "react";
import type { UserResponse } from "../../../types/candidate/candidate.type";
import { userServices } from "../../../services/userServices.service";
import "./RecruiterInfo.scss";
import { Mail, Pencil, User, Briefcase, X } from "lucide-react";

interface RecruiterInfoProps {
  data: UserResponse | null;
  onRefresh: () => void;
}

const RecruiterInfo = ({ data, onRefresh }: RecruiterInfoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
  });

  const openModal = () => {
    setFormData({
      name: data?.recruiter?.name || "",
      position: data?.recruiter?.position || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên và Vị trí");
      return;
    }

    setIsSaving(true);
    try {
      // Gọi API cập nhật
      await userServices.updateRecruiter({
        name: formData.name.trim(),
        position: formData.position.trim(),
      });

      onRefresh();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const recruiter = data?.recruiter;

  return (
    <>
      <div className="recruiter-card">
        {/* HEADER */}
        <div className="recruiter-card__header">
          <h3>Thông tin nhà tuyển dụng</h3>
          <button className="edit-btn" onClick={openModal}>
            <Pencil size={14} />
            Chỉnh sửa
          </button>
        </div>

        {/* BODY */}
        <div className="recruiter-card__body">
          <div className="avatar">
            {recruiter?.name?.charAt(0)?.toUpperCase() || "R"}
          </div>

          <h2 className="name">{recruiter?.name || "Chưa cập nhật"}</h2>

          <span className="position">
            {recruiter?.position || "Chưa có vị trí"}
          </span>

          <div className="divider" />

          <div className="info">
            <div className="info-item">
              <Mail size={16} />
              <span>{data?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHỈNH SỬA */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal__header">
              <h2>Cập nhật thông tin</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="edit-modal__body">
              {/* Full Name */}
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              {/* Job Title / Position */}
              <div className="form-group">
                <label>Job Title / Position</label>
                <div className="input-wrapper">
                  <Briefcase className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Nhập chức danh"
                  />
                </div>
              </div>

              {/* Contact Email (Read-only) */}
              <div className="form-group">
                <label>
                  Contact Email <span>(Read-only)</span>
                </label>
                <div className="input-wrapper disabled">
                  <Mail className="input-icon" size={18} />
                  <input type="email" value={data?.email || ""} disabled />
                </div>
              </div>
            </div>

            <div className="edit-modal__footer">
              <button
                className="btn-cancel"
                onClick={closeModal}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecruiterInfo;

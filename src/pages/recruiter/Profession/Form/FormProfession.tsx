import React, { useEffect, useState } from "react";
import "./FormProfession.scss";
import type {
  ProfessionRequest,
  ProfessionResponse,
} from "../../../../types/recruiter/profession.type";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";

  initialData?: ProfessionResponse | null;

  onClose: () => void;

  onSubmit: (data: ProfessionRequest) => Promise<void>;
}

const FormProfession: React.FC<Props> = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProfessionRequest>({
    name: "",
    description: "",
  });

  const isView = mode === "view";

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <div className="profession-modal-overlay">
      <div className="profession-modal">
        <div className="modal-header">
          <h2>
            {mode === "create" && "Thêm ngành nghề"}

            {mode === "edit" && "Cập nhật ngành nghề"}

            {mode === "view" && "Chi tiết ngành nghề"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Tên ngành nghề</label>

            <input
              disabled={isView}
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>

            <textarea
              rows={5}
              disabled={isView}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {!isView && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Hủy
            </button>

            <button className="submit-btn" onClick={handleSubmit}>
              {mode === "create" ? "Thêm" : "Cập nhật"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormProfession;

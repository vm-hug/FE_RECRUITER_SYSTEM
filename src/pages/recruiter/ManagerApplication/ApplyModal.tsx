import React, { useState } from "react";
import { managerApplicationService } from "../../../services/recruiter/managerApplication.service";
import "./ApplyModal.scss";

interface Props {
  jobId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyModal: React.FC<Props> = ({ jobId, onClose, onSuccess }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await managerApplicationService.create({
        jobId,
        cvFile: cvFile || undefined,
      });
      alert("Nộp đơn thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi nộp đơn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nộp đơn ứng tuyển</h2>
        <input
          type="file"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
        />
        <p>
          <small>(Để trống nếu muốn dùng CV trong Profile)</small>
        </p>
        <div className="button-group">
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Xác nhận nộp đơn"}
          </button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};
export default ApplyModal;

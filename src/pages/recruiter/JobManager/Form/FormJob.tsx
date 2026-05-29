import React, { useEffect, useState } from "react";
import { X, Upload, Calendar, DollarSign, Percent } from "lucide-react";
import {
  JOB_STATUS,
  type JobPayload,
  type JobResponse,
} from "../../../../types/recruiter/job.type";
import { jobServices } from "../../../../services/recruiter/job.service";

import "./FormJob.scss";
import commonServices from "../../../../services/commonServices.service";
import type {
  EducationLevel,
  Level,
  Profession,
  WorkFormat,
} from "../../../../types/common.type";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "view";
  job?: JobResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FormJob: React.FC<Props> = ({ mode, job, onClose, onSuccess }) => {
  const isView = mode === "view";
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States danh mục hệ thống từ API chung
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [workFormats, setWorkFormats] = useState<WorkFormat[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);

  const [formData, setFormData] = useState<JobPayload>({
    jobCode: "",
    title: "",
    professionId: "",
    description: "",
    requirements: "",
    experience: "",
    levelId: "",
    educationLevelId: "",
    workFormatId: "",
    salaryMin: "",
    salaryMax: "",
    moneyCurrent: "USD",
    jobStatus: JOB_STATUS.DRAFT,
    contactEmail: "",
    gpa: "",
    avatarJob: null,
    expiredAt: "",
  });

  // 1. Fetch dữ liệu danh mục hệ thống khi component mount
  useEffect(() => {
    const fetchCommonData = async () => {
      try {
        const [profData, levelData, formatData, eduData] = await Promise.all([
          commonServices.getProfession(),
          commonServices.getLevel(),
          commonServices.getWorkFormats(),
          commonServices.getEducationLevels(),
        ]);
        setProfessions(profData);
        setLevels(levelData);
        setWorkFormats(formatData);
        setEducationLevels(eduData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu danh mục:", error);
      }
    };
    fetchCommonData();
  }, []);

  // 2. Điền dữ liệu cũ vào Form khi ở chế độ Edit hoặc View
  useEffect(() => {
    if (job) {
      setPreview(job.avatarJob);
      const formattedDate = job.expiredAt
        ? new Date(job.expiredAt).toISOString().split("T")[0]
        : "";

      setFormData({
        jobCode: job.jobCode || "",
        title: job.title || "",
        professionId: job.professionId || "",
        description: job.description || "",
        requirements: job.requirements || "",
        experience: job.experience || "",
        levelId: job.levelId || "",
        educationLevelId: job.educationLevelId || "",
        workFormatId: job.workFormatId || "",
        salaryMin: job.salaryMin ?? "",
        salaryMax: job.salaryMax ?? "",
        moneyCurrent: job.moneyCurrent || "USD",
        jobStatus: job.jobStatus || JOB_STATUS.DRAFT,
        contactEmail: job.contactEmail || "",
        gpa: job.gpa ?? "",
        avatarJob: null, // Không ghi đè File object từ string URL cũ
        expiredAt: formattedDate,
      });
    }
  }, [job]);

  // 3. Xử lý submit gửi dữ liệu qua Service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      // Chuẩn hóa định dạng thời gian sang LocalDateTime (yyyy-MM-ddTHH:mm:ss)
      let formattedExpiredAt = formData.expiredAt;
      if (formData.expiredAt && !formData.expiredAt.includes("T")) {
        // Thêm giờ cuối ngày 23:59:59 vào ngày được chọn
        formattedExpiredAt = `${formData.expiredAt}T23:59:59`;
      }

      // Chuẩn hóa dữ liệu trước khi gửi đi
      const payload: JobPayload = {
        ...formData,
        salaryMin: formData.salaryMin !== "" ? Number(formData.salaryMin) : "",
        salaryMax: formData.salaryMax !== "" ? Number(formData.salaryMax) : "",
        gpa: formData.gpa !== "" ? Number(formData.gpa) : "",
        expiredAt: formattedExpiredAt, // Gửi chuỗi ngày kèm giờ chuẩn cấu trúc
        avatarJob: formData.avatarJob || null,
      };

      if (mode === "create") {
        await jobServices.create(payload);
      } else if (mode === "edit" && job) {
        await jobServices.update(job.id, payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý công việc:", error);
      alert("Đã xảy ra lỗi, vui lòng kiểm tra lại thông tin form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-form-overlay" onClick={onClose}>
      <div className="job-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="form-header">
          <div>
            <h2>
              {mode === "create" && "Tạo công việc mới"}
              {mode === "edit" && "Cập nhật công việc"}
              {mode === "view" && "Chi tiết công việc"}
            </h2>
            <p className="sub-text">
              Thông tin minh bạch giúp tiếp cận đúng ứng viên tiềm năng
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="form-body">
          {/* PHẦN 1: THÔNG TIN CHUNG */}
          <div className="form-section">
            <h3 className="section-title">1. Thông tin chung</h3>
            <div className="grid-2-col">
              <div className="input-group">
                <label>
                  Tiêu đề công việc <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{formData.title}</p>
                ) : (
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ví dụ: Senior Backend Developer"
                  />
                )}
              </div>

              <div className="grid-2-col">
                <div className="input-group">
                  <label>
                    Mã công việc <span className="required">*</span>
                  </label>
                  {isView ? (
                    <p className="view-text">{formData.jobCode}</p>
                  ) : (
                    <input
                      required
                      value={formData.jobCode}
                      onChange={(e) =>
                        setFormData({ ...formData, jobCode: e.target.value })
                      }
                      placeholder="Ví dụ: JOB-2026"
                    />
                  )}
                </div>
                <div className="input-group">
                  <label>Trạng thái</label>
                  {isView ? (
                    <p className="view-text badge-text">{formData.jobStatus}</p>
                  ) : (
                    <select
                      value={formData.jobStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobStatus: e.target.value as any,
                        })
                      }
                    >
                      <option value={JOB_STATUS.DRAFT}>DRAFT</option>
                      <option value={JOB_STATUS.OPEN}>OPEN</option>
                      <option value={JOB_STATUS.CLOSED}>CLOSED</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-3-col">
              {/* PROFESSION SELECT */}
              <div className="input-group">
                <label>
                  Ngành nghề <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{job?.professionName}</p>
                ) : (
                  <select
                    required
                    value={formData.professionId}
                    onChange={(e) =>
                      setFormData({ ...formData, professionId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn ngành nghề --</option>
                    {professions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* LEVEL SELECT */}
              <div className="input-group">
                <label>
                  Cấp bậc <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{job?.levelName}</p>
                ) : (
                  <select
                    required
                    value={formData.levelId}
                    onChange={(e) =>
                      setFormData({ ...formData, levelId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn cấp bậc --</option>
                    {levels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* WORK FORMAT SELECT */}
              <div className="input-group">
                <label>Hình thức làm việc</label>
                {isView ? (
                  <p className="view-text">
                    {job?.workFormatName || "Chưa cập nhật"}
                  </p>
                ) : (
                  <select
                    value={formData.workFormatId}
                    onChange={(e) =>
                      setFormData({ ...formData, workFormatId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn hình thức --</option>
                    {workFormats.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* PHẦN 2: HÌNH ẢNH BANNER */}
          <div className="form-section">
            <h3 className="section-title">2. Hình ảnh hiển thị</h3>
            <div className="upload-container">
              {!isView && (
                <label className="upload-box">
                  <Upload size={24} color="#6b46c1" />
                  <span>Chọn ảnh đại diện bài đăng</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, avatarJob: file });
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
              {preview && (
                <div className="image-preview-wrapper">
                  <img src={preview} alt="Job Banner" className="preview-img" />
                </div>
              )}
            </div>
          </div>

          {/* PHẦN 3: YÊU CẦU CHI TIẾT */}
          <div className="form-section">
            <h3 className="section-title">3. Yêu cầu & Tiêu chí tuyển dụng</h3>
            <div className="grid-3-col">
              <div className="input-group">
                <label>Kinh nghiệm</label>
                {isView ? (
                  <p className="view-text">
                    {formData.experience || "Không yêu cầu"}
                  </p>
                ) : (
                  <input
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="Ví dụ: 1-2 năm kinh nghiệm"
                  />
                )}
              </div>

              {/* EDUCATION LEVEL SELECT */}
              <div className="input-group">
                <label>Trình độ học vấn</label>
                {isView ? (
                  <p className="view-text">
                    {job?.educationLevelName || "Không yêu cầu"}
                  </p>
                ) : (
                  <select
                    value={formData.educationLevelId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationLevelId: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Không yêu cầu --</option>
                    {educationLevels.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="input-group">
                <label>Điểm GPA tối thiểu</label>
                {isView ? (
                  <p className="view-text">{formData.gpa || "Không xét"}</p>
                ) : (
                  <div className="input-with-icon">
                    <Percent size={16} />
                    <input
                      type="number"
                      step="0.1"
                      value={formData.gpa}
                      onChange={(e) =>
                        setFormData({ ...formData, gpa: e.target.value })
                      }
                      placeholder="Thang điểm 4"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>
                Mô tả công việc <span className="required">*</span>
              </label>
              {isView ? (
                <p className="view-text textarea-text">
                  {formData.description}
                </p>
              ) : (
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nêu chi tiết các trách nhiệm công việc..."
                />
              )}
            </div>

            <div className="input-group">
              <label>
                Yêu cầu công việc <span className="required">*</span>
              </label>
              {isView ? (
                <p className="view-text textarea-text">
                  {formData.requirements}
                </p>
              ) : (
                <textarea
                  required
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  placeholder="Yêu cầu kỹ năng chuyên môn, công nghệ sử dụng..."
                />
              )}
            </div>
          </div>

          {/* PHẦN 4: LƯƠNG & LIÊN HỆ */}
          <div className="form-section">
            <h3 className="section-title">4. Chế độ lương & Hạn nhận</h3>
            <div className="grid-3-col">
              <div className="input-group">
                <label>Mức lương từ</label>
                {isView ? (
                  <p className="view-text">{formData.salaryMin || "0"}</p>
                ) : (
                  <div className="input-with-icon">
                    <DollarSign size={16} />
                    <input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMin: e.target.value })
                      }
                      placeholder="Tối thiểu"
                    />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Mức lương đến</label>
                {isView ? (
                  <p className="view-text">
                    {formData.salaryMax || "Thỏa thuận"}
                  </p>
                ) : (
                  <div className="input-with-icon">
                    <DollarSign size={16} />
                    <input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMax: e.target.value })
                      }
                      placeholder="Tối đa"
                    />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Đơn vị tiền tệ</label>
                {isView ? (
                  <p className="view-text">{formData.moneyCurrent}</p>
                ) : (
                  <select
                    value={formData.moneyCurrent}
                    onChange={(e) =>
                      setFormData({ ...formData, moneyCurrent: e.target.value })
                    }
                  >
                    <option value="USD">USD ($)</option>
                    <option value="VND">VND (đ)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <label>
                  Email liên hệ nhận CV <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">{formData.contactEmail}</p>
                ) : (
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="example@company.com"
                  />
                )}
              </div>

              <div className="input-group">
                <label>
                  Hạn chót ứng tuyển <span className="required">*</span>
                </label>
                {isView ? (
                  <p className="view-text">
                    {formData.expiredAt
                      ? new Date(formData.expiredAt).toLocaleDateString()
                      : ""}
                  </p>
                ) : (
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <input
                      type="date"
                      required
                      value={formData.expiredAt}
                      onChange={(e) =>
                        setFormData({ ...formData, expiredAt: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer nút điều hướng hành động */}
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
                    ? "Xác nhận tạo"
                    : "Lưu cập nhật"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormJob;

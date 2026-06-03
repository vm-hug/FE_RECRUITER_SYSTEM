import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  UploadCloud,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Download,
} from "lucide-react";
import "./AICVScoringPage.scss";

const AICVScoringPage: React.FC = () => {
  // State giả lập cho quá trình phân tích
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(true); // Đặt true để hiển thị luôn kết quả theo thiết kế

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Giả lập API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="ai-scoring-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <Sparkles className="sparkle-icon" size={24} />
          <h1>AI CV Scoring & Matching</h1>
        </div>
        <p>
          Phân tích chuyên sâu và so sánh độ phù hợp của ứng viên với yêu cầu
          công việc.
        </p>
      </div>

      <div className="scoring-container">
        {/* --- CỘT TRÁI: THÔNG TIN ĐẦU VÀO --- */}
        <div className="input-section card">
          <div className="section-header">
            <FileText size={20} className="text-blue-600" />
            <h2>Thông tin đầu vào</h2>
          </div>

          <div className="form-group">
            <label>Job Description (Mô tả công việc)</label>
            <textarea
              placeholder="Dán nội dung JD vào đây để AI đối chiếu..."
              defaultValue="Tìm kiếm Backend Developer có kinh nghiệm với Java, Spring Boot, và thiết kế RESTful API..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Tải lên CV Ứng viên</label>
            <div className="upload-dropzone">
              <UploadCloud size={32} className="text-slate-400" />
              <p className="upload-title">
                <strong>Kéo thả CV hoặc click để tải lên</strong>
              </p>
              <p className="upload-subtitle">
                Hỗ trợ định dạng PDF, DOCX (Tối đa 5MB)
              </p>
            </div>
          </div>

          <button
            className={`analyze-btn ${isAnalyzing ? "loading" : ""}`}
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Sparkles size={18} />
            {isAnalyzing ? "AI Đang Phân Tích..." : "Bắt đầu AI Phân tích"}
          </button>
        </div>

        {/* --- CỘT PHẢI: KẾT QUẢ ĐÁNH GIÁ --- */}
        {hasResult && (
          <div className="result-section card">
            <div className="section-header space-between">
              <div className="title-left">
                <BarChart2 size={20} className="text-slate-600" />
                <h2>Kết quả đánh giá</h2>
              </div>
              <span className="badge-recommended">🔥 Highly Recommended</span>
            </div>

            {/* Khối Điểm số & Tóm tắt */}
            <div className="summary-block">
              <div className="score-box">
                {/* SVG Donut Chart */}
                <div className="donut-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart blue">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray="87, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      87%
                    </text>
                  </svg>
                </div>
                <p>ĐỘ PHÙ HỢP</p>
              </div>

              <div className="ai-summary-box">
                <div className="summary-text">
                  <div className="sub-title">
                    <FileText size={14} /> AI TÓM TẮT
                  </div>
                  <p>
                    "CV phù hợp với vị trí Backend Developer. Ứng viên có kinh
                    nghiệm vững chắc về hệ thống phân tán và tối ưu hóa hiệu
                    suất cơ sở dữ liệu. Tuy nhiên, thiếu kinh nghiệm thực tế với
                    môi trường Cloud Native."
                  </p>
                </div>

                <div className="ats-progress">
                  <div className="ats-label">
                    <span className="flex-center gap-2">
                      <CheckCircle2 size={14} className="text-blue-500" /> Khả
                      năng vượt qua ATS
                    </span>
                    <span>92/100</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Khối Kỹ năng */}
            <div className="skills-grid">
              <div className="skill-box matched">
                <div className="box-title text-green">
                  <CheckCircle2 size={16} /> KỸ NĂNG PHÙ HỢP
                </div>
                <div className="tags">
                  <span>Java</span>
                  <span>Spring Boot</span>
                  <span>PostgreSQL</span>
                  <span>RESTful API</span>
                  <span>Microservices</span>
                </div>
              </div>

              <div className="skill-box missing">
                <div className="box-title text-orange">
                  <AlertTriangle size={16} /> KỸ NĂNG THIẾU SÓT
                </div>
                <div className="tags">
                  <span>Kubernetes</span>
                  <span>AWS (EC2, S3)</span>
                  <span>CI/CD Pipelines</span>
                </div>
              </div>
            </div>

            {/* Khối Điểm mạnh / Yếu */}
            <div className="analysis-grid">
              <div className="analysis-box">
                <div className="box-title">ĐIỂM MẠNH</div>
                <ul>
                  <li>Nền tảng kiến trúc phần mềm tốt.</li>
                  <li>Kinh nghiệm lead nhóm nhỏ (3 người).</li>
                  <li>Có sản phẩm thực tế chứng minh năng lực.</li>
                </ul>
              </div>
              <div className="analysis-box">
                <div className="box-title">ĐIỂM CẦN LƯU Ý</div>
                <ul>
                  <li>Chưa có kinh nghiệm dự án scale lớn (&gt;1M users).</li>
                  <li>Tiếng Anh giao tiếp chưa được thể hiện rõ.</li>
                </ul>
              </div>
            </div>

            {/* Khối Đề xuất phỏng vấn */}
            <div className="interview-suggestions">
              <div className="box-title text-blue">
                <Lightbulb size={16} /> AI ĐỀ XUẤT PHỎNG VẤN
              </div>
              <div className="suggestion-grid">
                <div className="suggestion-card">
                  <strong>Kiểm tra System Design</strong>
                  <p>
                    Yêu cầu ứng viên thiết kế lại một module trong dự án cũ để
                    scale lên 10x traffic.
                  </p>
                </div>
                <div className="suggestion-card">
                  <strong>Bổ khuyết Cloud</strong>
                  <p>
                    Hỏi về khả năng tự học AWS/K8s hoặc kinh nghiệm sử dụng các
                    tool tương đương.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="action-footer">
              <button className="btn-outline">
                <RefreshCw size={16} /> Phân tích lại
              </button>
              <button className="btn-primary">
                <Download size={16} /> Xuất Báo Cáo PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICVScoringPage;

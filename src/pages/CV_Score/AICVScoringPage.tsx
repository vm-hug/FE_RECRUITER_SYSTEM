import React, { useState, useRef, useEffect } from "react";
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

import type { CVAnalysisResult } from "../../types/ai/cv_analyze.type";
import "./AICVScoringPage.scss";
import { useAnalyzeCV } from "../../hooks/ai/useAnalyzeCV";

const AICVScoringPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(
    null,
  );

  // Thêm State để quản lý thanh tiến trình (Loading Bar)
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const loadingIntervalRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: analyzeCV, isPending } = useAnalyzeCV();

  // Dọn dẹp interval khi component unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const startSimulatedProgress = () => {
    setLoadingProgress(0);
    // Tăng tiến trình chậm dần, dừng ở 95% cho đến khi API trả về
    loadingIntervalRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          if (loadingIntervalRef.current)
            clearInterval(loadingIntervalRef.current);
          return 95;
        }
        // Công thức tăng chậm dần: bước tăng càng nhỏ khi tiến trình càng cao
        const step = Math.random() * 5 + (95 - prev) / 10;
        return Math.min(prev + step, 95);
      });
    }, 400);
  };

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      alert("Vui lòng nhập Mô tả công việc (Job Description)!");
      return;
    }
    if (!selectedFile) {
      alert("Vui lòng tải lên CV của ứng viên!");
      return;
    }

    setAnalysisResult(null); // Clear kết quả cũ
    startSimulatedProgress(); // Bắt đầu chạy thanh loading bar

    analyzeCV(
      { jobDescription, file: selectedFile },
      {
        onSuccess: (data) => {
          if (loadingIntervalRef.current)
            clearInterval(loadingIntervalRef.current);
          setLoadingProgress(100); // Cho thanh trượt nhảy lên 100%

          // Chờ thanh trượt chạy xong animation 100% rồi mới hiện kết quả
          setTimeout(() => {
            setAnalysisResult(data);
          }, 600);
        },
        onError: (error) => {
          if (loadingIntervalRef.current)
            clearInterval(loadingIntervalRef.current);
          setLoadingProgress(0);
          console.error("Lỗi phân tích CV:", error);
          alert(
            "Đã có lỗi xảy ra trong quá trình phân tích CV. Vui lòng thử lại sau.",
          );
        },
      },
    );
  };

  const handleReset = () => {
    setJobDescription("");
    setSelectedFile(null);
    setAnalysisResult(null);
    setLoadingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isPending}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Tải lên CV Ứng viên</label>
            <div
              className={`upload-dropzone ${selectedFile ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                hidden
              />
              <UploadCloud
                size={32}
                className={selectedFile ? "text-blue-500" : "text-slate-400"}
              />
              <p className="upload-title">
                <strong>
                  {selectedFile
                    ? selectedFile.name
                    : "Kéo thả CV hoặc click để tải lên"}
                </strong>
              </p>
              <p className="upload-subtitle">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "Hỗ trợ định dạng PDF, DOCX (Tối đa 5MB)"}
              </p>
            </div>
          </div>

          {/* Wrapper Nút Bấm & Thanh Loading */}
          <div className="analyze-action-wrapper">
            <button
              className={`analyze-btn ${isPending ? "loading" : ""}`}
              onClick={handleAnalyze}
              disabled={isPending || !selectedFile || !jobDescription.trim()}
            >
              <Sparkles size={18} />
              {isPending ? "Hệ thống AI đang xử lý..." : "Bắt đầu AI Phân tích"}
            </button>

            {/* Thanh Loading Bar hiển thị khi isPending */}
            {isPending && (
              <div className="loading-bar-container">
                <div className="loading-texts">
                  <span className="loading-status">
                    Đang đọc tài liệu & trích xuất ngữ cảnh...
                  </span>
                  <span className="loading-percent">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill shimmer"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- CỘT PHẢI: KẾT QUẢ ĐÁNH GIÁ --- */}
        {analysisResult && (
          <div className="result-section card animate-fade-in">
            <div className="section-header space-between">
              <div className="title-left">
                <BarChart2 size={20} className="text-slate-600" />
                <h2>Kết quả đánh giá</h2>
              </div>
              {analysisResult.match_percentage >= 80 && (
                <span className="badge-recommended">🔥 Highly Recommended</span>
              )}
            </div>

            {/* Khối Điểm số & Tóm tắt */}
            <div className="summary-block">
              <div className="score-box">
                {/* SVG Donut Chart */}
                <div className="donut-chart">
                  <svg
                    viewBox="0 0 36 36"
                    className={`circular-chart ${analysisResult.match_percentage >= 70 ? "blue" : "orange"}`}
                  >
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${analysisResult.match_percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      {Math.round(analysisResult.match_percentage)}%
                    </text>
                  </svg>
                </div>
                <p>ĐỘ PHÙ HỢP</p>
              </div>

              <div className="ai-summary-box">
                <div className="summary-text">
                  <div className="sub-title">
                    <FileText size={14} /> AI TÓM TẮT CHUNG
                  </div>
                  <p>"{analysisResult.summary.summary_text}"</p>
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    Khuyến nghị: {analysisResult.summary.recommendation}
                  </p>
                </div>

                <div className="ats-progress">
                  <div className="ats-label">
                    <span className="flex-center gap-2">
                      <CheckCircle2 size={14} className="text-blue-500" /> Khả
                      năng vượt qua ATS
                    </span>
                    <span>{Math.round(analysisResult.ats_pass_rate)}/100</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${analysisResult.ats_pass_rate >= 75 ? "bg-green-500" : "bg-orange-500"}`}
                      style={{ width: `${analysisResult.ats_pass_rate}%` }}
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
                  {analysisResult.matched_skills &&
                  analysisResult.matched_skills.length > 0 ? (
                    analysisResult.matched_skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic border-none bg-transparent">
                      Không tìm thấy kỹ năng phù hợp
                    </span>
                  )}
                </div>
              </div>

              <div className="skill-box missing">
                <div className="box-title text-orange">
                  <AlertTriangle size={16} /> KỸ NĂNG THIẾU SÓT
                </div>
                <div className="tags">
                  {analysisResult.missing_skills &&
                  analysisResult.missing_skills.length > 0 ? (
                    analysisResult.missing_skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic border-none bg-transparent">
                      Đáp ứng đầy đủ kỹ năng yêu cầu
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Khối Điểm mạnh / Yếu */}
            <div className="analysis-grid">
              <div className="analysis-box">
                <div className="box-title">ĐIỂM MẠNH</div>
                <ul>
                  {analysisResult.strengths &&
                  analysisResult.strengths.length > 0 ? (
                    analysisResult.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">
                      Chưa phát hiện điểm mạnh nổi bật
                    </li>
                  )}
                </ul>
              </div>
              <div className="analysis-box">
                <div className="box-title">ĐIỂM CẦN LƯU Ý</div>
                <ul>
                  {analysisResult.points_to_note &&
                  analysisResult.points_to_note.length > 0 ? (
                    analysisResult.points_to_note.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">
                      Không có điểm trừ đáng lưu ý
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Khối Đề xuất phỏng vấn */}
            {analysisResult.interview_suggestions &&
              analysisResult.interview_suggestions.length > 0 && (
                <div className="interview-suggestions">
                  <div className="box-title text-blue">
                    <Lightbulb size={16} /> AI ĐỀ XUẤT PHỎNG VẤN
                  </div>
                  <div className="suggestion-grid">
                    {analysisResult.interview_suggestions.map(
                      (suggestion, index) => (
                        <div className="suggestion-card" key={index}>
                          <strong>{suggestion.title}</strong>
                          <p>{suggestion.description}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Footer Actions */}
            <div className="action-footer">
              <button className="btn-outline" onClick={handleReset}>
                <RefreshCw size={16} /> Phân tích lại hồ sơ khác
              </button>
              <button className="btn-primary" onClick={() => window.print()}>
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

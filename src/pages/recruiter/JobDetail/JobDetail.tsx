import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jobServices } from "../../../services/recruiter/job.service"; // Đổi đường dẫn theo project của bạn
import type { JobResponse } from "../../../types/recruiter/job.type";
import {
  FiClock,
  FiDollarSign,
  FiHeart,
  FiMapPin,
  FiSend,
  FiAward,
  FiBriefcase,
  FiMonitor,
  FiStar,
  FiMail,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import "./JobDetail.scss";

// Utility function (có thể đưa ra file helper chung)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const getAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const JobDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Giả định route của bạn là /jobs/:slug
  const [job, setJob] = useState<JobResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const res = await jobServices.getBySlug(slug);

        console.log("data :", res);

        setJob(res as any);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công việc:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [slug]);

  if (isLoading)
    return <div className="loading-state">Đang tải dữ liệu...</div>;
  if (!job) return <div className="error-state">Không tìm thấy công việc!</div>;

  const tabs = [
    { id: "overview", label: "Chi tiết công việc" },
    { id: "description", label: "Mô tả" },
    { id: "requirements", label: "Yêu cầu ứng viên" },
    { id: "contact", label: "Liên hệ" },
  ];

  return (
    <div className="job-detail-page">
      {/* Header Card */}
      <div className="header-card">
        <div className="job-logo">
          <img
            src={getAssetUrl(job.avatarJob) || "/default-company-logo.png"}
            alt={job.companyName}
          />
        </div>
        <div className="job-header-info">
          <h1 className="job-title">{job.title}</h1>
          <p className="company-name">{job.companyName}</p>

          <div className="job-meta">
            <span className="badge badge-salary">
              <FiDollarSign /> {job.salaryMin} - {job.salaryMax}{" "}
              {job.moneyCurrent} / year
            </span>
            <span className="badge badge-location">
              <FiMapPin /> {job.locationName}
            </span>
            <span className="badge badge-expire">
              <FiClock /> Expires: {formatDate(job.expiredAt)}
            </span>
          </div>

          <div className="job-actions">
            <button className="btn-apply">
              Nộp đơn ngay <FiSend />
            </button>
            <button className="btn-save">
              <FiHeart /> Lưu tin
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="content-card">
        {activeTab === "overview" && (
          <div className="tab-overview">
            <h2>Chi tiết công việc</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">MÃ CÔNG VIỆC</span>
                <span className="value">{job.jobCode || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="label">CHỨC DANH</span>
                <span className="value">{job.title}</span>
              </div>
              <div className="info-item">
                <span className="label">NGÀNH NGHỀ</span>
                <span className="value">{job.professionName}</span>
              </div>
              <div className="info-item">
                <span className="label">MỨC LƯƠNG</span>
                <span className="value highlight-text">
                  ${job.salaryMin} - ${job.salaryMax} / year
                </span>
              </div>
            </div>

            <h3 className="section-title">Yêu cầu công việc</h3>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{
                __html:
                  job.requirements?.replace(/\n/g, "<br />") ||
                  "Đang cập nhật...",
              }}
            />
          </div>
        )}

        {activeTab === "description" && (
          <div className="tab-description">
            <h2>Mô tả công việc</h2>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{
                __html:
                  job.description?.replace(/\n/g, "<br />") ||
                  "Đang cập nhật...",
              }}
            />
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="tab-requirements">
            <h2>Yêu cầu ứng viên</h2>
            <div className="req-grid">
              <div className="req-card">
                <FiAward className="icon icon-purple" />
                <span className="req-label">Cấp bậc</span>
                <span className="req-badge badge-purple">
                  {job.levelName || "N/A"}
                </span>
              </div>
              <div className="req-card">
                <FiBriefcase className="icon icon-blue" />
                <span className="req-label">Kinh nghiệm</span>
                <span className="req-badge badge-blue">
                  {job.experience || "N/A"}
                </span>
              </div>
              <div className="req-card">
                <MdOutlineSchool className="icon icon-green" />
                <span className="req-label">Học vấn</span>
                <span className="req-badge badge-green">
                  {job.educationLevelName || "N/A"}
                </span>
              </div>
              <div className="req-card">
                <FiMonitor className="icon icon-pink" />
                <span className="req-label">Loại công việc</span>
                <span className="req-badge badge-pink">
                  {job.workFormatName || "N/A"}
                </span>
              </div>
              <div className="req-card">
                <FiStar className="icon icon-yellow" />
                <span className="req-label">GPA tối thiểu</span>
                <span className="req-badge badge-yellow">
                  GPA: {job.gpa ? `${job.gpa} / 4.0` : "Không yêu cầu"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="tab-contact">
            <h2>Thông tin liên hệ</h2>
            <div className="contact-list">
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FiMail />
                </div>
                <div className="contact-info">
                  <span className="label">EMAIL LIÊN HỆ</span>
                  <span className="value">
                    {job.contactEmail || "Đang cập nhật..."}
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FiMapPin />
                </div>
                <div className="contact-info">
                  <span className="label">ĐỊA CHỈ CÔNG TY</span>
                  <span className="value">
                    {job.companyAddressDetail || "Đang cập nhật..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;

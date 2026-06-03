import React, { useEffect, useState } from "react";
import { jobServices } from "../../services/recruiter/job.service"; // Đảm bảo đường dẫn import chuẩn xác
import type { JobResponse } from "../../types/recruiter/job.type";
import "./FeaturedJobs.scss";
import { getImageUrl } from "../../helper/loadImage.util";
import { useNavigate } from "react-router-dom";

const FeaturedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        // Lấy 3 việc làm mới nhất đang ở trạng thái OPEN
        const res = await jobServices.search({
          size: 3,
          jobStatus: "OPEN",
          sortBy: "createAt",
          sortDir: "desc",
        });
        setJobs(res.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách việc làm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  // Lấy chữ cái đầu làm logo nếu không có ảnh
  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "J";

  return (
    <section className="featured-jobs">
      <div className="container">
        <h2 className="section-title">Việc làm nổi bật</h2>

        {loading ? (
          <div className="loading-state">Đang tải việc làm...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">Hiện chưa có việc làm nổi bật nào.</div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-header">
                  {job.avatarJob ? (
                    <img
                      src={getImageUrl(job.avatarJob)}
                      alt={job.companyName}
                      className="company-logo"
                    />
                  ) : (
                    <div className="company-logo-fallback">
                      {getInitial(job.companyName)}
                    </div>
                  )}
                  <div className="job-title-group">
                    <h3 title={job.title}>
                      {job.title.length > 50
                        ? job.title.substring(0, 50) + "..."
                        : job.title}
                    </h3>
                    <p>{job.companyName}</p>
                  </div>
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    {job.locationName || "Chưa cập nhật"}
                  </div>
                  <div className="detail-item">
                    <span className="material-symbols-outlined">payments</span>
                    {job.salaryMin && job.salaryMax
                      ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.moneyCurrent}`
                      : "Thỏa thuận"}
                  </div>
                  <div className="detail-item">
                    <span className="material-symbols-outlined">schedule</span>
                    {job.workFormatName || "Chưa cập nhật"}
                  </div>
                </div>

                <button
                  className="apply-btn"
                  onClick={() => navigate(`/job/${job.slug}`)}
                >
                  Ứng tuyển ngay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;

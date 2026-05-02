import { useEffect, useState, type ChangeEvent } from "react";
import { useCommonData } from "../../../hooks/useCommonData";
import type {
  JobResponse,
  JobSearchParams,
} from "../../../types/recruiter/job.type";
import { jobServices } from "../../../services/recruiter/job.service";
import "./Job.scss";
import {
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiFilter,
  FiHeart,
  FiMapPin,
  FiMonitor,
  FiSearch,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { FaLevelUpAlt } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const getAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
};

const Job: React.FC = () => {
  const navigate = useNavigate();
  const {
    levels,
    educationLevels,
    workFormats,
    locations,
    professions,
    isLoading,
  } = useCommonData();

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filterForm, setFilterForm] = useState<JobSearchParams>({
    title: "",
    companyId: "",
    locationId: "",
    professionId: "",
    levelId: "",
    educationLevelId: "",
    workFormatId: "",
    page: 0,
    size: 10,
    sortBy: "createAt",
    sortDir: "desc",
  });

  const fetchJobs = async (params: JobSearchParams) => {
    try {
      const res = await jobServices.search(params);

      console.log("data :", res);

      setJobs(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm việc làm:", error);
    }
  };

  useEffect(() => {
    fetchJobs(filterForm);
  }, [filterForm.page, filterForm.sortBy]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setFilterForm((prev) => ({ ...prev, page: 0 })); // Reset về trang 1 khi lọc mới
    fetchJobs({ ...filterForm, page: 0 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilterForm((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="job-page">
      {/* Breadcrumb & Title */}
      <div className="job-header">
        <p className="breadcrumb">
          Trang chủ {">"} <span>Tuyển dụng</span>
        </p>
        <h1 className="page-title">
          Tuyển dụng{" "}
          <span className="highlight">{totalElements.toLocaleString()}</span>{" "}
          việc làm mới nhất năm 2024
        </h1>
      </div>

      {/* Filter Section */}
      <div className="filter-box">
        <div className="filter-grid">
          <div className="input-group">
            <FiSearch className="icon" />
            <input
              name="title"
              value={filterForm.title}
              onChange={handleInputChange}
              placeholder="Job Title, Keywords..."
            />
          </div>
          <div className="input-group">
            <BiBuildingHouse className="icon" />
            <input
              name="companyId"
              value={filterForm.companyId}
              onChange={handleInputChange}
              placeholder="Company Name"
            />
          </div>
          <div className="select-group">
            <FiMapPin className="icon" />
            <select
              name="locationId"
              value={filterForm.locationId}
              onChange={handleInputChange}
            >
              <option value="">Location</option>
              {locations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <FiBriefcase className="icon" />
            <select
              name="professionId"
              value={filterForm.professionId}
              onChange={handleInputChange}
            >
              <option value="">Profession</option>
              {professions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <FaLevelUpAlt className="icon" />
            <select
              name="levelId"
              value={filterForm.levelId}
              onChange={handleInputChange}
            >
              <option value="">Level</option>
              {levels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <MdOutlineSchool className="icon" />
            <select
              name="educationLevelId"
              value={filterForm.educationLevelId}
              onChange={handleInputChange}
            >
              <option value="">Education</option>
              {educationLevels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <FiMonitor className="icon" />
            <select
              name="workFormatId"
              value={filterForm.workFormatId}
              onChange={handleInputChange}
            >
              <option value="">Work Format</option>
              {workFormats.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <FiDollarSign className="icon" />
            <select
              name="salaryMax"
              value={filterForm.salaryMax || ""}
              onChange={handleInputChange}
            >
              <option value="">Salary Range</option>
              <option value="1000">Dưới $1,000</option>
              <option value="3000">$1,000 - $3,000</option>
              <option value="5000">Trên $3,000</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn-filter" onClick={handleFilterSubmit}>
            <FiFilter /> Lọc việc làm
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="job-list-section">
          {/* List Header */}
          <div className="list-header">
            <span>
              Showing {(filterForm.page ?? 0) * (filterForm.size ?? 10) + 1}-
              {Math.min(
                ((filterForm.page ?? 0) + 1) * (filterForm.size ?? 10),
                totalElements,
              )}{" "}
              of {totalElements} jobs
            </span>
            <div className="sort-pills">
              <button
                className={filterForm.sortBy === "createAt" ? "active" : ""}
                onClick={() =>
                  setFilterForm({ ...filterForm, sortBy: "createAt" })
                }
              >
                Mới nhất
              </button>
              <button
                className={filterForm.sortBy === "salaryMax" ? "active" : ""}
                onClick={() =>
                  setFilterForm({ ...filterForm, sortBy: "salaryMax" })
                }
              >
                Lương cao
              </button>
              <button
                className={filterForm.sortBy === "expiredAt" ? "active" : ""}
                onClick={() =>
                  setFilterForm({ ...filterForm, sortBy: "expiredAt" })
                }
              >
                Hạn gần
              </button>
            </div>
          </div>

          {/* Job Items */}
          <div className="job-list">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => navigate(`/job/${job.slug}`)}
              >
                <div className="job-logo">
                  <img
                    src={
                      getAssetUrl(job.avatarJob) || "/default-company-logo.png"
                    }
                    alt={job.companyName}
                  />
                </div>
                <div className="job-info">
                  <div className="job-title-row">
                    <h3>{job.title}</h3>
                    <FiHeart className="heart-icon" />
                  </div>
                  <p className="company-name">{job.companyName}</p>

                  <div className="job-meta">
                    <span className="salary">
                      <FiDollarSign /> {job.salaryMin} - {job.salaryMax}{" "}
                      {job.moneyCurrent}
                    </span>
                    <span className="dot">•</span>
                    <span className="location">
                      <FiMapPin /> {job.locationName}
                    </span>
                    <span className="dot">•</span>
                    <span className="time">
                      <FiClock /> {formatTimeAgo(job.createAt)}
                    </span>
                  </div>

                  <div className="job-tags">
                    <span className="tag">{job.workFormatName}</span>
                    <span className="tag">{job.levelName}</span>
                    <span className="tag">{job.professionName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange((filterForm.page ?? 0) - 1)}
                disabled={filterForm.page === 0}
              >
                &lt; Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-num ${filterForm.page === i ? "active" : ""}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange((filterForm.page ?? 0) + 1)}
                disabled={(filterForm.page ?? 0) === totalPages - 1}
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="job-alert-card">
            <h3>Create Job Alert</h3>
            <p>
              Never miss an opportunity. Get notified when new jobs match your
              criteria.
            </p>
            <button className="btn-subscribe">Subscribe Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Vừa xong";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );
  if (diffInHours < 24)
    return `Posted ${diffInHours > 0 ? diffInHours : 1} hours ago`;
  return `Posted ${Math.floor(diffInHours / 24)} days ago`;
};

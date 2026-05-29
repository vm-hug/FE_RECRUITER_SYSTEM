import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Briefcase,
} from "lucide-react";

import "./JobManagerPage.scss";
import {
  JOB_STATUS,
  type JobResponse,
  type JobStatus,
} from "../../../types/recruiter/job.type";
import { jobServices } from "../../../services/recruiter/job.service";

import FormJob from "./Form/FormJob";
import { getImageUrl } from "../../../helper/loadImage.util";
import type { Profession } from "../../../types/common.type";
import commonServices from "../../../services/commonServices.service";

const JobManagerPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [title, setTitle] = useState("");
  const [jobStatus, setJobStatus] = useState<JobStatus | "">("");
  const [professionId, setProfessionId] = useState<string>("");
  const [professions, setProfessions] = useState<Profession[]>([]);

  // status temp
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<JobStatus>(JOB_STATUS.DRAFT);

  // FORM
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);

  // Gọi API lấy danh sách ngành nghề thực tế cho bộ lọc
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const res = await commonServices.getProfession();
        setProfessions(res);
      } catch (error) {
        console.error("Error fetching professions:", error);
      }
    };
    fetchProfessions();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobServices.searchByRecruiter({
        page,
        size,
        title,
        jobStatus: jobStatus || undefined,
        professionId: professionId || undefined,
      });

      setJobs(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, title, jobStatus, professionId]);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá công việc này?")) return;
    try {
      await jobServices.delete(id);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  // UPDATE STATUS
  const handleConfirmStatus = async (id: string) => {
    try {
      await jobServices.updateJobStatus(id, {
        jobStatus: tempStatus,
      });
      setEditingStatusId(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="job-manager-page">
      {/* HEADER */}
      <div className="jm-header-wrapper">
        <div className="jm-header-text">
          <h1>Quản lý công việc</h1>
          <p>Manage and track all your job postings.</p>
        </div>

        <button
          className="create-btn"
          onClick={() => {
            setFormMode("create");
            setSelectedJob(null);
            setOpenForm(true);
          }}
        >
          <Plus size={18} />
          Create Job
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="jm-toolbar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search by title..."
            value={title}
            onChange={(e) => {
              setPage(0);
              setTitle(e.target.value);
            }}
          />
        </div>

        <div className="filter-group">
          {/* SEARCH BY PROFESSION */}
          <select
            className="filter-dropdown"
            value={professionId}
            onChange={(e) => {
              setPage(0);
              setProfessionId(e.target.value);
            }}
          >
            <option value="">All Professions</option>
            {professions.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>

          {/* SEARCH BY STATUS */}
          <select
            className="filter-dropdown"
            value={jobStatus}
            onChange={(e) => {
              setPage(0);
              setJobStatus(e.target.value as JobStatus | "");
            }}
          >
            <option value="">All Status</option>
            <option value={JOB_STATUS.OPEN}>OPEN</option>
            <option value={JOB_STATUS.DRAFT}>DRAFT</option>
            <option value={JOB_STATUS.CLOSED}>CLOSED</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="jm-card">
        <div className="table-responsive">
          <table className="jm-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Profession</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Expired</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="job-info">
                        {job.avatarJob ? (
                          <img
                            src={getImageUrl(job.avatarJob)}
                            alt=""
                            className="job-avatar"
                          />
                        ) : (
                          <div className="company-logo">
                            <Briefcase size={20} />
                          </div>
                        )}
                        <div className="details">
                          <span className="title">{job.title}</span>
                          <span className="meta">{job.locationName}</span>
                        </div>
                      </div>
                    </td>

                    <td>{job.companyName}</td>
                    <td>{job.professionName}</td>
                    <td>
                      {job.salaryMin} - {job.salaryMax} {job.moneyCurrent}
                    </td>

                    {/* STATUS */}
                    <td>
                      <div className="status-wrapper">
                        <select
                          className={`status-select ${
                            editingStatusId === job.id
                              ? tempStatus.toLowerCase()
                              : job.jobStatus.toLowerCase()
                          }`}
                          value={
                            editingStatusId === job.id
                              ? tempStatus
                              : job.jobStatus
                          }
                          onChange={(e) => {
                            setEditingStatusId(job.id);
                            setTempStatus(e.target.value as JobStatus);
                          }}
                        >
                          <option value={JOB_STATUS.OPEN}>OPEN</option>
                          <option value={JOB_STATUS.DRAFT}>DRAFT</option>
                          <option value={JOB_STATUS.CLOSED}>CLOSED</option>
                        </select>

                        {editingStatusId === job.id && (
                          <div className="status-actions">
                            <button
                              className="confirm-btn"
                              onClick={() => handleConfirmStatus(job.id)}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingStatusId(null)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>{new Date(job.expiredAt).toLocaleDateString()}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn view-btn"
                          onClick={() => {
                            setSelectedJob(job);
                            setFormMode("view");
                            setOpenForm(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="icon-btn edit-btn"
                          onClick={() => {
                            setSelectedJob(job);
                            setFormMode("edit");
                            setOpenForm(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="jm-pagination">
          <div className="showing-text">
            Showing <strong>{page * size + 1}</strong> -
            <strong> {Math.min((page + 1) * size, totalElements)}</strong> of{" "}
            <strong>{totalElements}</strong>
          </div>

          <div className="page-controls">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-btn ${page === index ? "active" : ""}`}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* FORM */}
      {openForm && (
        <FormJob
          open={openForm}
          mode={formMode}
          job={selectedJob}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
};

export default JobManagerPage;

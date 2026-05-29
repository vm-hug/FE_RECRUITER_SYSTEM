import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  FileText,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./ApplicationManagerPage.scss";
import {
  ApplicationStatus,
  type ApplicationResponse,
} from "../../../types/recruiter/application.type";
import { managerApplicationService } from "../../../services/recruiter/managerApplication.service";
import {
  statusClassMap,
  statusLabelMap,
} from "../../../helper/applicationStatus";
import { getImageUrl } from "../../../helper/loadImage.util";

const PAGE_SIZE = 10;

const ApplicationManagerPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ApplicationStatus | undefined
  >(undefined);
  const [editingStatus, setEditingStatus] = useState<
    Record<string, ApplicationStatus>
  >({});
  const [cvModal, setCvModal] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await managerApplicationService.getAll({
        page,
        size: PAGE_SIZE,
        status: statusFilter,
      });
      setApplications(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    setEditingStatus((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleConfirmStatus = async (id: string) => {
    try {
      const status = editingStatus[id];
      await managerApplicationService.updateStatus(id, status);
      setEditingStatus((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });
      fetchApplications();
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelStatus = (id: string) => {
    setEditingStatus((prev) => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  return (
    <div className="app-manager-page">
      <div className="am-header">
        <h1>Quản lý ứng tuyển</h1>
        <p>Review and manage candidate applications.</p>
      </div>

      <div className="am-card">
        <div className="am-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <Search size={18} color="#94a3b8" />
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter || ""}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                    ? (e.target.value as ApplicationStatus)
                    : undefined,
                )
              }
            >
              <option value="">All Status</option>
              {Object.values(ApplicationStatus).map((status) => (
                <option key={status} value={status}>
                  {statusLabelMap[status]}
                </option>
              ))}
            </select>
          </div>

          <button className="export-btn">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="table-responsive">
          <table className="am-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Status</th>
                <th>Date</th>
                <th>CV</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => {
                const currentStatus = editingStatus[app.id] || app.status;
                const changed =
                  editingStatus[app.id] && editingStatus[app.id] !== app.status;

                console.log("cv", cvModal);

                return (
                  <tr key={app.id}>
                    <td>
                      <div className="candidate-info">
                        <div className="avatar">
                          {app.candidateUrl ? (
                            <img
                              src={getImageUrl(app.candidateUrl)}
                              alt={app.candidateName}
                            />
                          ) : (
                            app.candidateName?.charAt(0)
                          )}
                        </div>
                        <div className="details">
                          <span className="name">{app.candidateName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="job-title">{app.jobTitle}</td>

                    <td>
                      <select
                        className={`status-select-badge ${statusClassMap[currentStatus] || "applied"}`}
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            app.id,
                            e.target.value as ApplicationStatus,
                          )
                        }
                      >
                        {Object.values(ApplicationStatus).map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="status-option"
                          >
                            {statusLabelMap[status]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="date">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="resume-link"
                        onClick={() => setCvModal(app.cvUrl)}
                      >
                        <FileText size={16} />
                        Xem CV
                      </button>
                    </td>

                    <td>
                      <div className="action-buttons">
                        {changed && (
                          <>
                            <button
                              className="icon-btn approve"
                              onClick={() => handleConfirmStatus(app.id)}
                            >
                              <Check size={16} />
                            </button>

                            <button
                              className="icon-btn reject"
                              onClick={() => handleCancelStatus(app.id)}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {loading && <p className="loading-text">Loading...</p>}
        </div>

        <div className="am-pagination">
          <div className="showing-text">
            Showing {applications.length} of {totalElements}
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

      {cvModal && (
        <div className="cv-modal-overlay" onClick={() => setCvModal(null)}>
          <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setCvModal(null)}>
              ✕
            </button>
            <iframe
              src={getImageUrl(cvModal)}
              title="CV Preview"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagerPage;

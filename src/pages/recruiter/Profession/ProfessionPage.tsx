import React, { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./ProfessionPage.scss";
import type {
  ProfessionRequest,
  ProfessionResponse,
} from "../../../types/recruiter/profession.type";
import { professionServices } from "../../../services/recruiter/profession.service";
import FormProfession from "./Form/FormProfession";

const PAGE_SIZE = 10;

const ProfessionPage: React.FC = () => {
  const [professions, setProfessions] = useState<ProfessionResponse[]>([]);

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [openForm, setOpenForm] = useState(false);

  const [mode, setMode] = useState<"create" | "edit" | "view">("create");

  const [selectedProfession, setSelectedProfession] =
    useState<ProfessionResponse | null>(null);

  const fetchProfessions = async () => {
    try {
      const res = await professionServices.getAll({
        keyword,
        page,
        size: PAGE_SIZE,
      });

      setProfessions(res.content);

      setTotalPages(res.totalPages);

      setTotalElements(res.totalElements);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, [page, keyword]);

  const handleCreate = async (data: ProfessionRequest) => {
    await professionServices.create(data);

    setOpenForm(false);

    fetchProfessions();
  };

  const handleUpdate = async (data: ProfessionRequest) => {
    if (!selectedProfession) return;

    await professionServices.update(selectedProfession.id, data);

    setOpenForm(false);

    fetchProfessions();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa ngành nghề này?",
    );

    if (!confirmDelete) return;

    await professionServices.delete(id);

    fetchProfessions();
  };

  return (
    <div className="profession-page">
      <div className="prof-header">
        <h1>Quản lý ngành nghề</h1>

        <p>Quản lý danh sách ngành nghề tuyển dụng</p>
      </div>

      <div className="prof-toolbar-card">
        <div className="search-box">
          <Search size={18} color="#64748b" />

          <input
            type="text"
            placeholder="Tìm kiếm ngành nghề..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);

              setPage(0);
            }}
          />
        </div>

        <button
          className="create-btn"
          onClick={() => {
            setMode("create");

            setSelectedProfession(null);

            setOpenForm(true);
          }}
        >
          <Plus size={18} />
          Thêm ngành nghề
        </button>
      </div>

      <div className="prof-table-card">
        <div className="table-responsive">
          <table className="prof-table">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>NGÀNH NGHỀ</th>

                <th style={{ width: "60%" }}>MÔ TẢ</th>

                <th style={{ width: "15%" }} className="text-right">
                  THAO TÁC
                </th>
              </tr>
            </thead>

            <tbody>
              {professions.map((prof) => (
                <tr key={prof.id}>
                  <td>
                    <span className="prof-name">{prof.name}</span>
                  </td>

                  <td>
                    <span className="prof-desc">{prof.description}</span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn view-btn"
                        onClick={() => {
                          setMode("view");

                          setSelectedProfession(prof);

                          setOpenForm(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="icon-btn edit-btn"
                        onClick={() => {
                          setMode("edit");

                          setSelectedProfession(prof);

                          setOpenForm(true);
                        }}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(prof.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prof-pagination">
          <div className="showing-text">
            Hiển thị <strong>{professions.length}</strong> trên{" "}
            <strong>{totalElements}</strong> kết quả
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

      <FormProfession
        open={openForm}
        mode={mode}
        initialData={selectedProfession}
        onClose={() => setOpenForm(false)}
        onSubmit={mode === "edit" ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default ProfessionPage;

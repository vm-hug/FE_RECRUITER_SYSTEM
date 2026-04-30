import { useEffect, useState } from "react";
import { Plus, Edit3, X } from "lucide-react";

import type { CandidateSkill } from "../../types/candidate/candidate.type";
import type { Skill } from "../../types/candidate/candidate.type";

import "./CandidateSkill.scss";
import candidateSkillService from "../../services/candidate/candidateSkill.service";
import skillServices from "../../services/candidate/skill.service";

export default function CandidateSkillPage() {
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    skillId: "",
    skillLevel: "BEGINNER" as CandidateSkill["skillLevel"],
  });
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
    fetchAllSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await candidateSkillService.getMySkills();
      setSkills(data);
    } catch (error) {
      console.error("Load skills failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const data = await skillServices.getAll();
      setAllSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ skillId: "", skillLevel: "BEGINNER" });
    setIsModalOpen(true);
  };

  const openEditModal = (candidateSkill: CandidateSkill) => {
    setEditingId(candidateSkill.id);
    setFormData({
      skillId: candidateSkill.skillId, // không dùng trong update nhưng giữ để hiển thị
      skillLevel: candidateSkill.skillLevel,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá kỹ năng này?")) return;
    try {
      await candidateSkillService.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Không thể xoá. Vui lòng thử lại.");
    }
  };

  const handleSave = async () => {
    if (!formData.skillId && !editingId) {
      alert("Vui lòng chọn kỹ năng.");
      return;
    }
    try {
      if (editingId) {
        // Update chỉ gửi skillLevel (theo service)
        const updated = await candidateSkillService.update(editingId, {
          skillLevel: formData.skillLevel,
        });
        setSkills((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s)),
        );
      } else {
        // Create
        const created = await candidateSkillService.create({
          skillId: formData.skillId,
          skillLevel: formData.skillLevel,
        });
        setSkills((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Lưu thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <section className="candidate-skill">
      <div className="candidate-skill__header">
        <h2 className="candidate-skill__title">Kỹ năng</h2>
        <button className="candidate-skill__add-btn" onClick={openAddModal}>
          <Plus size={18} />
          Thêm
        </button>
      </div>

      <div className="candidate-skill__body">
        {skills.length === 0 ? (
          <p className="candidate-skill__empty">Chưa có kỹ năng nào.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="candidate-skill__tag">
              <span>{skill.skillName}</span>
              <span className="candidate-skill__level">
                ({skill.skillLevel})
              </span>
              <div className="candidate-skill__tag-actions">
                <button
                  className="candidate-skill__action-btn edit"
                  onClick={() => openEditModal(skill)}
                >
                  <Edit3 size={12} />
                </button>
                <button
                  className="candidate-skill__action-btn remove"
                  onClick={() => handleDelete(skill.id)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editingId ? "Sửa" : "Thêm"} kỹ năng
              </h3>
              <button
                className="modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal__form">
              {/* Chọn kỹ năng (chỉ hiện khi thêm mới, khi sửa thì hiển thị readOnly) */}
              {editingId ? (
                <div className="form-group">
                  <span>Kỹ năng</span>
                  <input
                    type="text"
                    value={
                      skills.find((s) => s.id === editingId)?.skillName || ""
                    }
                    readOnly
                    disabled
                  />
                </div>
              ) : (
                <div className="form-group">
                  <span>Chọn kỹ năng</span>
                  <select
                    value={formData.skillId}
                    onChange={(e) =>
                      setFormData({ ...formData, skillId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn kỹ năng --</option>
                    {allSkills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.skillName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Chọn cấp độ */}
              <div className="form-group">
                <span>Cấp độ</span>
                <select
                  value={formData.skillLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skillLevel: e.target
                        .value as CandidateSkill["skillLevel"],
                    })
                  }
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            <div className="modal__actions">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="modal__btn modal__btn--save"
                onClick={handleSave}
              >
                {editingId ? "Cập nhật" : "Lưu kỹ năng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useState, useEffect } from "react";
import { LayoutGrid, Settings, LogOut } from "lucide-react";
import { userServices } from "../../services/userServices.service";

import PersonalInfo from "../PersonalInfo/PersonalInfo";
import References from "../References/References";
import CandidateSkill from "../CandidateSkill/CandidateSkill";

import "./CandidateProfile.scss";
import WorkExperiencePage from "../WorkExperience/WorkExperience";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authServices.service";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const getAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
};

export default function CandidateProfile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userServices.getMyInfo();
        setUserInfo(res);
      } catch (error) {
        console.error("Lỗi khi tải thông tin user sidebar:", error);
      }
    };
    fetchUser();
  }, []);

  const candidate = userInfo?.candidate;
  const avatarSrc = candidate?.avatarUrl
    ? getAssetUrl(candidate.avatarUrl)
    : null;
  const fullName = candidate
    ? `${candidate.firstName} ${candidate.lastName}`
    : "Đang tải...";
  //   const title = candidate?.careerObjective ? "Candidate" : "Candidate";

  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          await authService.logout({ token: token });
        }
      } catch (error) {
        console.log("Lổi khi đăng xuất", error);
      } finally {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  };

  return (
    <div className="candidate-layout">
      {/* SIDEBAR */}
      <aside className="candidate-sidebar">
        <div className="candidate-sidebar__profile">
          <div className="avatar-wrapper">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {candidate?.firstName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{fullName}</h3>
            <p className="profile-email">{userInfo?.email || "Đang tải..."}</p>
          </div>
        </div>

        <nav className="candidate-sidebar__nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutGrid size={20} />
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            Settings
          </button>

          <div className="nav-divider"></div>

          <button className="nav-item nav-item--danger" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="candidate-main">
        {activeTab === "overview" && (
          <div className="overview-content">
            <PersonalInfo />
            <WorkExperiencePage />

            {/* Grid 2 cột cho Người tham chiếu và Kỹ năng */}
            <div className="bottom-grid">
              <References />
              <CandidateSkill />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-content">
            <div className="empty-state">
              <h2>Cài đặt tài khoản</h2>
              <p>Chức năng đang được phát triển...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

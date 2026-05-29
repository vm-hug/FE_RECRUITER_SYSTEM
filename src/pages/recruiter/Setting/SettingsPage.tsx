import React, { useState } from "react";
import { Lock, Bell, LogOut } from "lucide-react";
import "./SettingsPage.scss";

const SettingsPage: React.FC = () => {
  // Quản lý tab đang active (ví dụ sau này bạn làm thêm phần Thông báo)
  const [activeTab, setActiveTab] = useState<"security" | "notifications">(
    "security",
  );

  // Quản lý state của form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic gọi API đổi mật khẩu ở đây
    console.log("Form data:", passwordForm);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="sp-header">
        <h1>Cài đặt tài khoản</h1>
        <p>Quản lý thông tin cá nhân, bảo mật và tùy chọn thông báo của bạn.</p>
      </div>

      <div className="sp-container">
        {/* Left Sidebar */}
        <aside className="sp-sidebar">
          <nav className="sp-menu">
            <button
              className={`menu-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} /> Bảo mật
            </button>
            <button
              className={`menu-item ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={18} /> Thông báo
            </button>
          </nav>

          <div className="sp-sidebar-footer">
            <div className="divider"></div>
            <div className="version-info">Phiên bản 1.0.0</div>
            <button className="logout-btn">
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="sp-content">
          {activeTab === "security" && (
            <div className="security-section">
              <div className="section-header">
                <h2>Bảo mật</h2>
                <p>
                  Đảm bảo tài khoản của bạn an toàn bằng cách sử dụng mật khẩu
                  mạnh.
                </p>
              </div>

              <hr className="section-divider" />

              <form onSubmit={handleSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu mới"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="coming-soon">
              <Bell size={48} color="#cbd5e1" />
              <h3>Cài đặt thông báo</h3>
              <p>Tính năng đang được phát triển.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

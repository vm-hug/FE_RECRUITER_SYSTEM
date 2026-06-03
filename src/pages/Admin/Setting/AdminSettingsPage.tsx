import React, { useEffect, useState } from "react";
import { LogOut, UserCircle2, Lock, EyeOff, Eye } from "lucide-react";
import "./AdminSettingsPage.scss";
import { jwtDecode } from "jwt-decode";
import { authService } from "../../../services/authServices.service";
import { useNavigate } from "react-router-dom";

const AdminSettingsPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          setEmail(decodedToken.sub);
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  }, []);

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
        navigate("/admin/login");
      }
    }
  };

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="asp-header">
        <div className="asp-header-left">
          <h1>Cài đặt hệ thống</h1>
          <p>Quản lý tài khoản, bảo mật và tùy chọn hiển thị giao diện.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

      {/* Card 1: Thông tin tài khoản */}
      <div className="asp-card">
        <div className="card-header">
          <UserCircle2 size={20} className="icon-purple" />
          <h2>Thông tin tài khoản</h2>
        </div>

        <div className="card-body account-info">
          <div className="form-section">
            <div className="form-group">
              <label>Tên hiển thị</label>
              <input type="text" defaultValue="Quản trị viên Cấp cao" />
            </div>

            <div className="form-group">
              <label>Email liên hệ</label>
              <input type="email" value={email} />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Đổi mật khẩu */}
      <div className="asp-card">
        <div className="card-header">
          <Lock size={20} className="icon-purple" />
          <h2>Đổi mật khẩu</h2>
        </div>

        <div className="card-body password-change">
          <div className="form-group full-width">
            <label>Mật khẩu hiện tại</label>
            <div className="input-with-icon">
              <input
                type={showCurrentPassword ? "text" : "password"}
                defaultValue="password123"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label>Mật khẩu mới</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group half-width">
              <label>Xác nhận mật khẩu</label>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="form-actions">
            <button className="update-btn">Cập nhật mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

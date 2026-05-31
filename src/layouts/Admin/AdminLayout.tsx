import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Users,
  Building,
  Briefcase,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import "./AdminLayout.scss";

const AdminLayout: React.FC = () => {
  const navItems = [
    {
      path: "/admin/dashboard-admin",
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
    },
    {
      path: "/admin/authors",
      icon: <UserCheck size={20} />,
      label: "Manager Author",
    },
    {
      path: "/admin/articles",
      icon: <FileText size={20} />,
      label: "Manager Articles",
    },
    {
      path: "/admin/candidates",
      icon: <Users size={20} />,
      label: "Manager Candidate",
    },
    {
      path: "/admin/companies",
      icon: <Building size={20} />,
      label: "Manager Company",
    },
    {
      path: "/admin/recruiters",
      icon: <Briefcase size={20} />,
      label: "Manager Recruiter",
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar - Dark Theme */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>4NTH ADMIN</h2>
          <p>Job Portal Admin</p>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <Settings size={20} />
            <span>Setting</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Header - Purple Theme */}
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="dot"></span>
            </button>
            <div className="user-profile">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=random"
                alt="Admin"
              />
              <span>Quản trị viên</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  FileText,
  MessageSquare,
  User,
  Settings,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import "./DashboardLayout.scss";

const DashboardLayout: React.FC = () => {
  const navItems = [
    {
      path: "/dashboard-recruiter",
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
    },
    { path: "/profession", icon: <Briefcase size={20} />, label: "Profession" },
    { path: "/recruiter-info", icon: <User size={20} />, label: "Profile" },
    {
      path: "/applications",
      icon: <Users size={20} />,
      label: "Application Manager",
    },
    { path: "/manager-job", icon: <FileText size={20} />, label: "Job" },
    {
      path: "/recruiter/inbox",
      icon: <MessageSquare size={20} />,
      label: "Chat",
    },
    { path: "/settings", icon: <Settings size={20} />, label: "Setting" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <img
              src="https://ui-avatars.com/api/?name=Recruiter+Admin&background=random"
              alt="Avatar"
            />
            <div className="user-info">
              <h4>Recruiter Admin</h4>
              <p>recruiter@4nth.com</p>
            </div>
          </div>
        </div>

        <button className="post-job-btn">
          <Plus size={18} /> Post New Job
        </button>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="brand">4NTH JobFinder</div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} color="#999" />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="notification-btn">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content (Pages) */}
        <main className="content-area">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          <p>© 2026 4NTH JobFinder Portal. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#help">Help Center</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

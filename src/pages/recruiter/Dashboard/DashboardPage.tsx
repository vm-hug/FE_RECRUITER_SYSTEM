import React from "react";
import {
  Calendar,
  Download,
  Briefcase,
  Users,
  Zap,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import "./DashboardPage.scss";
import StatCard from "../../../components/Recruiter/StatCard";

const DashboardPage: React.FC = () => {
  // Dữ liệu giả lập cho biểu đồ
  const barData = [
    { name: "Jan", val: 30 },
    { name: "Feb", val: 45 },
    { name: "Mar", val: 85 },
    { name: "Apr", val: 40 },
    { name: "May", val: 50 },
  ];

  const areaData = [
    { name: "Jan", val: 20 },
    { name: "Feb", val: 30 },
    { name: "Mar", val: 45 },
    { name: "Apr", val: 60 },
    { name: "May", val: 55 },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dp-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Welcome back, here's what's happening with your job listings today.
          </p>
        </div>
        <div className="dp-actions">
          <button className="btn-light">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="btn-primary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard
          title="Total Jobs"
          value="12"
          icon={<Briefcase size={20} />}
          trend="+2%"
          trendUp={true}
        />
        <StatCard
          title="Total Applications"
          value="154"
          icon={<Users size={20} />}
          trend="+14%"
          trendUp={true}
        />
        <StatCard title="Active Jobs" value="8" icon={<Zap size={20} />} />
        <StatCard title="Expired Jobs" value="4" icon={<XCircle size={20} />} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Applications per month</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                {/* Sử dụng một màu solid làm mặc định, nếu muốn gradient ở Bar cần định nghĩa <defs> */}
                <Bar
                  dataKey="val"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Jobs created per month</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#ec4899"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row (Mockup cấu trúc) */}
      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <h3>Recent Applications</h3>
            <span className="view-all">View All</span>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="td-user">
                    <span className="avatar">AJ</span> Alex Johnson
                  </div>
                </td>
                <td>Senior Frontend Dev</td>
                <td>
                  <span className="badge warning">Pending</span>
                </td>
                <td>Oct 24, 2023</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Recent Jobs</h3>
            <span className="view-all">View All</span>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Profession</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Senior Frontend Dev</td>
                <td>Engineering</td>
                <td>
                  <span className="badge success">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

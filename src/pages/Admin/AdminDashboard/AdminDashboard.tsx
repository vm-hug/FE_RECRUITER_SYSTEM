import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  MousePointerClick,
  FileClock,
  UserPlus,
  Banknote,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminDashboard.scss";

// --- Reusable Component cho Thẻ Thống Kê ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down";
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType,
  iconBg,
  iconColor,
}) => (
  <div className="stat-card">
    <div className="sc-header">
      <div
        className="sc-icon"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      {trend && (
        <span className={`sc-trend ${trendType}`}>
          {trendType === "up" ? "+" : ""}
          {trend}
        </span>
      )}
    </div>
    <div className="sc-body">
      <p className="sc-title">{title}</p>
      <h3 className="sc-value">{value}</h3>
    </div>
  </div>
);

// --- Dữ liệu Mock cho Biểu đồ ---
const areaData = [
  { name: "T1", uv: 1000 },
  { name: "T2", uv: 2000 },
  { name: "T3", uv: 3000 },
  { name: "T4", uv: 5000 },
  { name: "T5", uv: 4000 },
  { name: "T6", uv: 6000 },
  { name: "T7", uv: 7500 },
];

const barData = [
  { name: "IT", value: 850, fill: "#7c3aed" },
  { name: "Marketing", value: 620, fill: "#be185d" },
  { name: "Sales", value: 500, fill: "#4b5563" },
  { name: "Finance", value: 400, fill: "#8b5cf6" },
  { name: "HR", value: 250, fill: "#db2777" },
];

const pieData = [
  { name: "Đang tuyển", value: 60, fill: "#7c3aed" },
  { name: "Chờ duyệt", value: 20, fill: "#9333ea" },
  { name: "Hết hạn", value: 20, fill: "#be185d" },
];

// --- Main Page Component ---
const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard-page">
      {/* Row 1: Thẻ Thống Kê Chính */}
      <div className="dashboard-grid top-stats">
        <StatCard
          title="Tổng số ứng viên"
          value="12,450"
          trend="12%"
          trendType="up"
          icon={<Users size={24} />}
          iconBg="#f3e8ff"
          iconColor="#7c3aed"
        />
        <StatCard
          title="Tổng số công ty"
          value="3,820"
          trend="5%"
          trendType="up"
          icon={<Building2 size={24} />}
          iconBg="#fce7f3"
          iconColor="#db2777"
        />
        <StatCard
          title="Tin tuyển dụng"
          value="8,910"
          trend="-2%"
          trendType="down"
          icon={<Briefcase size={24} />}
          iconBg="#f1f5f9"
          iconColor="#64748b"
        />
        <StatCard
          title="Lượt ứng tuyển"
          value="45,200"
          trend="24%"
          trendType="up"
          icon={<MousePointerClick size={24} />}
          iconBg="#f3e8ff"
          iconColor="#7c3aed"
        />
      </div>

      {/* Row 2: Biểu đồ Area & Bar */}
      <div className="dashboard-grid charts-row">
        <div className="card chart-card area-chart-card">
          <div className="card-header">
            <h3>Xu hướng ứng tuyển</h3>
            <select className="filter-select">
              <option>Tháng này</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={areaData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card bar-chart-card">
          <div className="card-header">
            <h3>Top ngành nghề</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Donut Chart & Các thẻ nhỏ */}
      <div className="dashboard-grid bottom-stats">
        <div className="card chart-card donut-chart-card">
          <div className="card-header">
            <h3>Trạng thái tin tuyển dụng</h3>
          </div>
          <div className="chart-wrapper center-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card simple-stat">
          <div className="icon-circle red">
            <FileClock size={24} />
          </div>
          <p>Tin chờ duyệt</p>
          <h3>145</h3>
        </div>

        <div className="card simple-stat">
          <div className="icon-circle blue">
            <UserPlus size={24} />
          </div>
          <p>Ứng viên mới</p>
          <h3>890</h3>
        </div>

        <div className="card gradient-stat">
          <div className="icon-circle white-purple">
            <Banknote size={24} />
          </div>
          <p>Doanh thu</p>
          <h3>1.2B đ</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

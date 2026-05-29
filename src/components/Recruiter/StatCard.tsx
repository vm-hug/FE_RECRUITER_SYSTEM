import React from "react";
import "./StatCard.scss";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
}) => {
  return (
    <div className="stat-card">
      <div className="sc-header">
        <div className="sc-icon">{icon}</div>
        {trend && (
          <div className={`sc-trend ${trendUp ? "up" : "down"}`}>
            {trendUp ? "↗" : "↘"} {trend}
          </div>
        )}
      </div>
      <div className="sc-content">
        <span className="sc-title">{title}</span>
        <h3 className="sc-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;

import React from "react";
import "./HealthBar.css";

interface HealthBarProps {
  currentHp: number;
  maxHp: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHp, maxHp }) => {
  const percentage = Math.max(0, Math.min((currentHp / maxHp) * 100, 100));
  const isLow = percentage <= 25;

  return (
    <div className={`health-bar-container ${isLow ? "low" : ""}`}>
      <div className="health-info">
        <span className="health-icon">❤️</span>
        <span className="health-text">
          {currentHp} / {maxHp}
        </span>
      </div>
      <div className="health-bg">
        <div className="health-fill" style={{ width: `${percentage}%` }}>
          <div className="health-shine"></div>
        </div>
      </div>
    </div>
  );
};

export default HealthBar;

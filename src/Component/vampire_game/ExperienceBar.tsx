import React from "react";
import "./ExperienceBar.css";

interface ExperienceBarProps {
  currentXp: number;
  maxXp: number;
  level: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentXp,
  maxXp,
  level,
}) => {
  const percentage = Math.min((currentXp / maxXp) * 100, 100);

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-info">
        <span className="xp-level">Lv. {level}</span>
        <span className="xp-text">
          {currentXp} / {maxXp} XP
        </span>
      </div>
      <div className="xp-bar-bg">
        <div className="xp-bar-fill" style={{ width: `${percentage}%` }}>
          <div className="xp-bar-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBar;

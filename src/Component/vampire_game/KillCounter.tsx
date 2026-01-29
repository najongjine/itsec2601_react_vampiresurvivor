import React from "react";
import "./KillCounter.css";

interface KillCounterProps {
  kills: number;
}

const KillCounter: React.FC<KillCounterProps> = ({ kills }) => {
  return (
    <div className="kill-counter-container">
      <span className="kill-icon">💀</span>
      <span className="kill-count">{kills.toLocaleString()}</span>
    </div>
  );
};

export default KillCounter;

import React from "react";
import "./UpgradeCard.css";

export interface UpgradeInfo {
  id: string;
  name: string;
  description: string;
  level: number;
  icon: string;
  rarity: "common" | "rare" | "epic";
  type: "weapon" | "passive";
}

interface UpgradeCardProps {
  upgrade: UpgradeInfo;
  onSelect: (upgrade: UpgradeInfo) => void;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ upgrade, onSelect }) => {
  return (
    <div
      className={`upgrade-card rarity-${upgrade.rarity}`}
      onClick={() => onSelect(upgrade)}
      id={`upgrade-card-${upgrade.id}`}
    >
      <div className="card-inner">
        <div className="card-header">
          <div className="upgrade-icon">{upgrade.icon}</div>
          <div className="upgrade-title-group">
            <h3 className="upgrade-name">{upgrade.name}</h3>
            <span className="upgrade-rarity-badge">{upgrade.rarity}</span>
          </div>
        </div>

        <p className="upgrade-description">{upgrade.description}</p>

        <div className="upgrade-footer">
          <span className="current-level">
            Lv.{upgrade.level} → Lv.{upgrade.level + 1}
          </span>
        </div>
      </div>
      <div className="card-glint"></div>
    </div>
  );
};

export default UpgradeCard;

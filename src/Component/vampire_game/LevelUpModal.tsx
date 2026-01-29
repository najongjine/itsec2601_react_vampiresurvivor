import React, { useEffect } from "react";
import UpgradeCard, { UpgradeInfo } from "./UpgradeCard";
import "./LevelUpModal.css";

interface LevelUpModalProps {
  upgrades: UpgradeInfo[];
  onSelect: (upgrade: UpgradeInfo) => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ upgrades, onSelect }) => {
  useEffect(() => {
    // Add class to body to prevent scrolling if needed
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-overlay" id="level-up-modal">
      <div className="modal-content">
        <header className="modal-header">
          <h2 className="modal-title">LEVEL UP!</h2>
          <p className="modal-subtitle">CHOOSE YOUR UPGRADE</p>
        </header>

        <div className="cards-container">
          {upgrades.map((upgrade, index) => (
            <div
              key={upgrade.id}
              className="card-wrapper"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <UpgradeCard upgrade={upgrade} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;

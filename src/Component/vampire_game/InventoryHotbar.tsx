import React from "react";
import "./InventoryHotbar.css";
import { UpgradeInfo } from "./UpgradeCard";

interface InventoryHotbarProps {
  weapons: UpgradeInfo[];
  passives: UpgradeInfo[];
}

const MAX_SLOTS = 6;

const InventoryHotbar: React.FC<InventoryHotbarProps> = ({
  weapons,
  passives,
}) => {
  const renderSlots = (items: UpgradeInfo[], type: "weapon" | "passive") => {
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      const item = items[i];
      slots.push(
        <div
          key={`${type}-${i}`}
          className={`inventory-slot ${item ? "occupied" : "empty"}`}
        >
          {item ? (
            <>
              <span className="slot-icon">{item.icon}</span>
              <span className="slot-level">{item.level}</span>
            </>
          ) : (
            <div className="slot-placeholder"></div>
          )}
        </div>,
      );
    }
    return slots;
  };

  return (
    <div className="inventory-hotbar">
      <div className="hotbar-row weapons-row">
        {renderSlots(weapons, "weapon")}
      </div>
      <div className="hotbar-row passives-row">
        {renderSlots(passives, "passive")}
      </div>
    </div>
  );
};

export default InventoryHotbar;

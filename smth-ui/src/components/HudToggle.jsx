import React from "react";
import '../styles/HudToggle.css';

/**
 * HUD Toggle Button
 */
export default function HudToggle({
  value = false,
  onChange,
  label = "TOGGLE",
  onText = "ON",
  offText = "OFF",
  disabled = false,
}) {
  return (
    <div className="hud-toggle">
      <span className="hud-toggle-label">{label}</span>

      <button
        className={`hud-toggle-btn ${value ? "on" : "off"}`}
        onClick={() => !disabled && onChange?.(!value)}
        disabled={disabled}
      >
        <span className="hud-toggle-thumb" />
        <span className="hud-toggle-text">
          {value ? onText : offText}
        </span>
      </button>
    </div>
  );
}

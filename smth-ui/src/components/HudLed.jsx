import React from "react";
import "../styles/HudLed.css";

/**
 * HUD Circular LED Indicator
 */
export default function HudLed({
  status = "off", // off | green | yellow | red | blue
  size = "1em",   // responsive (em, px, rem)
  label,
}) {
  return (
    <div className="hud-led-wrapper">
      <span
        className={`hud-led ${status}`}
        style={{ width: size, height: size }}
      />
      {label && <span className="hud-led-label">{label}</span>}
    </div>
  );
}

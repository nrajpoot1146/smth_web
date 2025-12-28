import React, { useEffect, useRef, useState } from "react";
import '../styles/HudToggle.css';

/**
 * HUD Gauge – Responsive / Fixed with Color Levels
 */
export default function HudGauge({
  value = 0,
  min = 0,
  max = 100,
  unit = "",
  label = "Sensor",

  /* OPTIONAL SIZE */
  width,
  height,

  /* COLOR THRESHOLDS */
  lowThreshold = 0.6,   // 60% of range
  highThreshold = 0.85, // 85% of range

  strokeWidthRatio = 0.08,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(200);

  const isFixed = typeof width === "number" && typeof height === "number";

  useEffect(() => {
    if (isFixed) {
      setSize(Math.min(width, height));
      return;
    }

    const observer = new ResizeObserver(entries => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setSize(Math.min(width, height));
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isFixed, width, height]);

  /* Normalize value */
  const percentage = Math.min(
    Math.max((value - min) / (max - min), 0),
    1
  );

  /* Dynamic Color */
  const getColor = () => {
    if (percentage < lowThreshold) return "var(--success)";
    if (percentage < highThreshold) return "var(--warning)";
    return "var(--error)";
  };

  const color = getColor();

  const radius = size / 2;
  const strokeWidth = radius * strokeWidthRatio;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - percentage * circumference;

  /* Auto-scale text */
  const valueFontSize = radius * 0.45;
  const unitFontSize = radius * 0.18;
  const labelFontSize = radius * 0.16;

  return (
    <div
      ref={containerRef}
      style={{
        width: isFixed ? width : "100%",
        height: isFixed ? height : "100%",
        minWidth: 120,
        minHeight: 120,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Ring */}
        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Active Ring */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{
            transition: "stroke-dashoffset 0.5s ease, stroke 0.3s",
            filter: `drop-shadow(0 0 10px ${color})`,
          }}
        />

        {/* Center Value */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="glow"
          fill={color}
          fontSize={valueFontSize}
          fontFamily="Orbitron"
        >
          {value}
          <tspan fontSize={unitFontSize} dx="4" dy="-8">
            {unit}
          </tspan>
        </text>

        {/* Label */}
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={labelFontSize}
          letterSpacing="0.14em"
        >
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

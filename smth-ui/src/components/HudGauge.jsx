import React, { useEffect, useRef, useState } from "react";

/**
 * HUD Gauge – TRUE Responsive (Down to ~48px)
 */
export default function HudGauge({
  value = 0,
  min = 0,
  max = 100,
  unit = "",
  label = "Sensor",

  width,
  height,

  lowThreshold = 0.6,
  highThreshold = 0.85,

  strokeWidthRatio = 0.08,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(100);

  const isFixed = typeof width === "number" && typeof height === "number";

  useEffect(() => {
    if (isFixed) {
      setSize(Math.min(width, height));
      return;
    }

    const observer = new ResizeObserver(entries => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;

      // Allow very small sizes but keep sane minimum
      setSize(Math.max(Math.min(width, height), 48));
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
  const color =
    percentage < lowThreshold
      ? "var(--success)"
      : percentage < highThreshold
        ? "var(--warning)"
        : "var(--error)";

  const radius = (size / 2);

  /* Clamp stroke width */
  const strokeWidth = Math.max(radius * strokeWidthRatio, 2);
  const normalizedRadius = radius - strokeWidth * 0.9;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - percentage * circumference;

  /* Responsive Font Sizes (CLAMPED) */
  const valueFontSize = Math.max(radius * 0.45, 10);
  const unitFontSize = Math.max(radius * 0.18, 7);
  const labelFontSize = Math.max(radius * 0.14, 6);

  return (
    <div
      ref={containerRef}
      style={{
        width: isFixed ? width : "100%",
        height: isFixed ? height : "100%",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="hudGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
            transition: "stroke-dashoffset 0.4s ease, stroke 0.3s",
            filter: "url(#hudGlow)",
          }}
        />

        {/* Center Value */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={valueFontSize}
          fontFamily="Orbitron"
          style={{
            transition: "stroke-dashoffset 0.4s ease, stroke 0.3s",
            filter: "url(#hudGlow)",
          }}
        >
          {value}
          <tspan fontSize={unitFontSize} dx="2" dy="-4">
            {unit}
          </tspan>
        </text>

        {/* Label */}
        {size > 70 && (
          <text
            x="50%"
            y="66%"
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize={labelFontSize}
            letterSpacing="0.12em"
            style={{
              transition: "stroke-dashoffset 0.4s ease, stroke 0.3s",
              filter: "url(#hudGlow)",
            }}
          >
            {label.toUpperCase()}
          </text>
        )}
      </svg>
    </div>
  );
}

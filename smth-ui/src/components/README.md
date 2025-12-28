<code>
🧪 Usage Examples
🔹 Responsive (Default)
<div style={{ width: "100%", height: 280 }}>
  <HudGauge value={36} unit="°C" label="TEMP" />
</div>

🔹 Fixed Size
<HudGauge
  value={72}
  unit="%"
  label="HUMIDITY"
  width={240}
  height={240}
/>

🔹 Grid Friendly
<div className="dashboard">
  <HudGauge value={36} unit="°C" />
  <HudGauge value={68} unit="%" />
  <HudGauge value={101} unit="kPa" />
</div>
</code>
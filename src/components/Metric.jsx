export default function Metric({ icon, color, value, label }) {
  return (
    <div className="metric">
      <span className={`metric-icon ${color}`}>{icon}</span>
      <span>
        <b>{value}</b>
        <small>{label}</small>
      </span>
    </div>
  );
}

export default function QuickStat({ icon, title, number, color, onClick }) {
  return (
    <button className="quick-stat" onClick={onClick}>
      <span className={`quick-icon ${color}`}>{icon}</span>
      <span>
        <small>{title}</small>
        <b>{number}</b>
        <i>View all ↗</i>
      </span>
    </button>
  );
}

export default function Empty({ title, text, action, onAction }) {
  return (
    <div className="empty-state">
      <div>✧</div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="primary-btn" onClick={onAction}>
          {action} →
        </button>
      )}
    </div>
  );
}


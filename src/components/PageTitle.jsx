export default function PageTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="page-title">
      <span className="eyebrow">✦ {eyebrow}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

export default function MetricCard({ title, badge, badgeClassName = "", value, note, valueClassName = "" }) {
  return (
    <article className="dashboard-card metric-card">
      <div className="metric-top">
        <span className="eyebrow">{title}</span>
        {badge ? <span className={badgeClassName}>{badge}</span> : null}
      </div>
      <div className={`metric-value ${valueClassName}`.trim()}>{value}</div>
      {note ? <p className="muted-copy">{note}</p> : null}
    </article>
  );
}

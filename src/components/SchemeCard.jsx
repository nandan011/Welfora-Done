// SchemeCard: Demonstrates <Link> to dynamic routes (/scheme/:id) for shareable URLs
import { Link } from 'react-router-dom';
import { HeartIcon, ClockIcon } from './Icons';

export default function SchemeCard({ scheme, saved, onSave, onOpen }) {
  const fitScore = scheme.fit?.score ?? scheme.match;

  return (
    <article className="scheme-card">
      <div className="scheme-card-top">
        <div className={`scheme-symbol ${scheme.color}`}>{scheme.icon}</div>
        <button
          className={`save-heart ${saved ? 'saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${scheme.name} from saved schemes` : `Save ${scheme.name}`}
          onClick={onSave}
          title={saved ? 'Remove from saved' : 'Save scheme'}
        >
          <HeartIcon size={18} filled={saved} />
        </button>
      </div>

      <span className="category-tag">{scheme.category}</span>
      <Link to={`/scheme/${scheme.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{scheme.name}</h3>
      </Link>
      <p>{scheme.description}</p>

      <div className="scheme-card-foot">
        <span className="match-pill">✦ {fitScore}% potential fit</span>
        <span className="scheme-deadline" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <ClockIcon size={13} /> {scheme.deadline}
        </span>
      </div>

      <div className="scheme-card-actions">
        {onOpen && (
          <button className="outline-btn" onClick={onOpen}>
            Details
          </button>
        )}
        {/* Link: Shareable URL navigation using React Router */}
        <Link to={`/scheme/${scheme.id}`} className="primary-btn">
          View Full Details
        </Link>
      </div>
    </article>
  );
}

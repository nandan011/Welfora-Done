import { useEffect } from 'react';

export default function EligibilityModal({ scheme, eligibility, profileName, onClose }) {
  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fitScore = scheme.fit?.score ?? scheme.match ?? 60;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="eligibility-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="elig-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>

        <div className="elig-modal-header">
          <div className={`scheme-symbol ${scheme.color}`}>{scheme.icon}</div>
          <div>
            <h2 id="elig-modal-title">Eligibility Check</h2>
            <p>{scheme.name}</p>
          </div>
        </div>

        <div className="elig-modal-disclaimer">
          ⓘ This is an indicative check based on your Welfora profile. It does not constitute an official eligibility determination.
        </div>

        <div className="elig-profile-section">
          <h3>Your Profile</h3>
          <div className="elig-profile-grid">
            <div className="elig-profile-row">
              <span>Name</span>
              <b>{profileName || 'Not provided'}</b>
            </div>
            <div className="elig-profile-row">
              <span>Age</span>
              <b>{eligibility.age ? `${eligibility.age} years` : 'Not provided'}</b>
            </div>
            <div className="elig-profile-row">
              <span>State</span>
              <b>{eligibility.state || 'Not provided'}</b>
            </div>
            <div className="elig-profile-row">
              <span>Occupation</span>
              <b>{eligibility.occupation || 'Not provided'}</b>
            </div>
            <div className="elig-profile-row">
              <span>Annual Income</span>
              <b>{eligibility.income ? `₹${Number(eligibility.income).toLocaleString('en-IN')}` : 'Not provided'}</b>
            </div>
          </div>
        </div>

        <div className="elig-scheme-section">
          <h3>Scheme Eligibility Criteria</h3>
          <p className="elig-scheme-text">{scheme.eligibility}</p>
        </div>

        <div className="elig-result-section">
          <div className={`elig-result-badge ${fitScore >= 70 ? 'high' : fitScore >= 50 ? 'medium' : 'low'}`}>
            <span className="elig-result-score">{fitScore}%</span>
            <span className="elig-result-label">Potential Fit</span>
          </div>
          <div className="elig-result-text">
            {fitScore >= 70
              ? 'This scheme may be highly relevant to your profile. Review the official eligibility criteria to confirm.'
              : fitScore >= 50
              ? 'This scheme may be relevant to your profile. Check the official eligibility requirements.'
              : 'This scheme may be less closely matched to your current profile, but you may still qualify — check the official portal.'}
          </div>

          {scheme.fit?.reasons && (
            <div className="elig-reasons">
              <h4>Relevance notes:</h4>
              <ul>
                {scheme.fit.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="elig-modal-actions">
          {scheme.applicationLink && (
            <a
              href={scheme.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-btn"
            >
              Go to Official Portal ↗
            </a>
          )}
          <button className="outline-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { HeartIcon } from './Icons';

export default function SchemeModal({ scheme, onClose, isSaved, onToggleSave, onApply }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!scheme) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="scheme-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scheme-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close"
          aria-label="Close scheme details"
          onClick={onClose}
        >
          ×
        </button>

        <div className={`scheme-symbol large ${scheme.color}`}>
          {scheme.icon}
        </div>

        <span className="eyebrow">
          {scheme.category.toUpperCase()} · DEMO SUMMARY
        </span>

        <h2 id="scheme-modal-title">{scheme.name}</h2>
        <p className="modal-description">{scheme.description}</p>

        <div className="modal-facts">
          <div>
            <small>Potential benefit</small>
            <b>{scheme.benefit}</b>
          </div>
          <div>
            <small>Deadline</small>
            <b>{scheme.deadline}</b>
          </div>
          <div>
            <small>Coverage</small>
            <b>{scheme.state}</b>
          </div>
          <div>
            <small>Eligibility overview</small>
            <b>{scheme.eligibility}</b>
          </div>
        </div>

        <div className="official-note">
          ⓘ <span>Before applying, verify current eligibility, documents, deadlines and application links through the relevant official government portal.</span>
        </div>

        <div className="modal-actions">
          <button
            className="outline-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => onToggleSave(scheme.id)}
          >
            <HeartIcon size={16} filled={isSaved} />
            <span>{isSaved ? 'Saved' : 'Save scheme'}</span>
          </button>
          <button
            className="primary-btn"
            onClick={() => {
              const url = scheme.applicationLink || 'https://www.myscheme.gov.in';
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            Track Scheme <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

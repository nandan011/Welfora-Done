// SchemeDetailPage: Demonstrates dynamic routing with useParams (:id) and programmatic back navigation
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EligibilityModal from '../components/EligibilityModal';
import { useWelfora } from '../context/WelforaContext';

const TABS = ['Overview', 'Eligibility', 'Documents', 'How to Apply'];

export default function SchemeDetailPage({ scheme: propScheme, onBack }) {
  // useParams: reads :id from URL dynamic route /scheme/:id
  const { id } = useParams();
  // useNavigate: programmatic back navigation
  const navigate = useNavigate();
  const { schemes, assessedSchemes, saved, toggleSave, eligibility, profileName } = useWelfora();

  const allSchemesList = assessedSchemes && assessedSchemes.length > 0 ? assessedSchemes : (schemes || []);
  const scheme = propScheme || allSchemesList.find(s => String(s.id) === String(id));

  const [activeTab, setActiveTab] = useState('Overview');
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  const handleBack = onBack || (() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/explore');
    }
  });

  if (!scheme) {
    return (
      <section className="page-content">
        <div className="empty-state">
          <h2>Scheme Not Found</h2>
          <p>We couldn't find a scheme matching this ID. Please explore available schemes.</p>
          <button className="outline-btn" onClick={() => navigate('/explore')}>← Back to Schemes</button>
        </div>
      </section>
    );
  }

  const isSaved = saved.includes(scheme.id);
  const fitScore = scheme.fit?.score ?? scheme.match ?? 60;

  return (
    <section className="page-content scheme-detail-page">
      {/* Back button */}
      <button className="back-link" onClick={handleBack}>
        ← Back to schemes
      </button>

      {/* Scheme Header */}
      <div className="scheme-detail-header panel">
        <div className="scheme-detail-icon-wrap">
          <div className={`scheme-symbol large ${scheme.color}`}>{scheme.icon}</div>
        </div>
        <div className="scheme-detail-meta">
          <span className="eyebrow">{scheme.category?.toUpperCase()} · {scheme.state}</span>
          <h1 className="scheme-detail-title">{scheme.name}</h1>
          <p className="scheme-detail-desc">{scheme.description}</p>
          <div className="scheme-detail-chips">
            <span className="match-pill">✦ {fitScore}% potential fit</span>
            {scheme.deadline && (
              <span className="scheme-deadline-chip">◷ {scheme.deadline}</span>
            )}
            {scheme.tag && (
              <span className="category-tag">{scheme.tag}</span>
            )}
          </div>
        </div>
        <div className="scheme-detail-actions-col">
          <button
            className={`save-btn-lg ${isSaved ? 'saved' : ''}`}
            onClick={() => toggleSave(scheme.id)}
            aria-pressed={isSaved}
          >
            {isSaved ? '♥ Saved' : '♡ Save Scheme'}
          </button>
          <button
            className="outline-btn"
            onClick={() => setShowEligibilityModal(true)}
          >
            Check My Eligibility
          </button>
          <button
            className="primary-btn"
            onClick={() => {
              const url = scheme.applicationLink || 'https://www.myscheme.gov.in';
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            Track Scheme →
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="scheme-tabs" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`scheme-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="scheme-tab-content panel" role="tabpanel">

        {activeTab === 'Overview' && (
          <div className="tab-overview">
            <h2>About This Scheme</h2>
            <p>{scheme.description}</p>

            <div className="overview-facts-grid">
              <div className="overview-fact">
                <small>Potential Benefit</small>
                <b>{scheme.benefit || 'Check official portal for benefit details'}</b>
              </div>
              <div className="overview-fact">
                <small>Coverage</small>
                <b>{scheme.state}</b>
              </div>
              <div className="overview-fact">
                <small>Category</small>
                <b>{scheme.category}</b>
              </div>
              <div className="overview-fact">
                <small>Deadline</small>
                <b>{scheme.deadline}</b>
              </div>
            </div>

            {scheme.applicationLink && (
              <div className="official-link-block">
                <span>🔗</span>
                <div>
                  <b>Official Application Portal</b>
                  <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer">
                    {scheme.applicationLink}
                  </a>
                </div>
              </div>
            )}

            <div className="official-note">
              ⓘ <span>Always verify current eligibility criteria, deadlines and application procedures on the official government portal before applying.</span>
            </div>
          </div>
        )}

        {activeTab === 'Eligibility' && (
          <div className="tab-eligibility">
            <h2>Eligibility Information</h2>
            <div className="eligibility-info-block">
              <p>{scheme.eligibility}</p>
            </div>

            <div className="profile-match-block">
              <h3>Your Profile vs. This Scheme</h3>
              <div className="profile-match-grid">
                <div className="match-row">
                  <span className="match-label">Your State</span>
                  <span className="match-value">{eligibility.state || 'Not set'}</span>
                  <span className="match-scheme">Scheme covers: {scheme.state}</span>
                </div>
                <div className="match-row">
                  <span className="match-label">Your Occupation</span>
                  <span className="match-value">{eligibility.occupation || 'Not set'}</span>
                </div>
                <div className="match-row">
                  <span className="match-label">Your Age</span>
                  <span className="match-value">{eligibility.age ? `${eligibility.age} years` : 'Not set'}</span>
                </div>
                <div className="match-row">
                  <span className="match-label">Annual Income</span>
                  <span className="match-value">{eligibility.income ? `₹${Number(eligibility.income).toLocaleString('en-IN')}` : 'Not set'}</span>
                </div>
              </div>

              {scheme.fit?.reasons && (
                <div className="fit-reasons">
                  <h4>Why this scheme may be relevant:</h4>
                  <ul>
                    {scheme.fit.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              <div className="eligibility-disclaimer">
                ⓘ This analysis is for guidance only. Welfora does not confirm official eligibility.
                Terms may have changed — check the official portal.
              </div>

              <button
                className="primary-btn mt-1"
                onClick={() => setShowEligibilityModal(true)}
              >
                Check My Eligibility Details
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="tab-documents">
            <h2>Documents That May Be Required</h2>
            <p className="documents-note">
              Document requirements vary. Confirm the exact list on the official scheme portal.
            </p>
            {scheme.documents && scheme.documents.length > 0 ? (
              <ul className="documents-list">
                {scheme.documents.map((doc, i) => (
                  <li key={i} className="document-item">
                    <span className="doc-icon">📄</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Document details are not available in the demo data. Please check the official scheme portal.</p>
            )}
            <div className="official-note">
              ⓘ <span>The above list is indicative. Official requirements may differ. Always verify on the scheme's official portal.</span>
            </div>
          </div>
        )}

        {activeTab === 'How to Apply' && (
          <div className="tab-apply">
            <h2>How to Apply</h2>
            {scheme.howToApply ? (
              <div className="how-to-apply-block">
                <p>{scheme.howToApply}</p>
              </div>
            ) : (
              <p>Application information is not available in the demo. Please visit the official scheme portal.</p>
            )}

            <div className="apply-steps">
              <div className="apply-step">
                <div className="step-num">1</div>
                <div>
                  <b>Check Eligibility</b>
                  <p>Review the eligibility tab above and verify on the official portal.</p>
                </div>
              </div>
              <div className="apply-step">
                <div className="step-num">2</div>
                <div>
                  <b>Gather Documents</b>
                  <p>Prepare all required documents from the Documents tab above.</p>
                </div>
              </div>
              <div className="apply-step">
                <div className="step-num">3</div>
                <div>
                  <b>Apply Online or Offline</b>
                  <p>Visit the official portal or nearest government office to submit your application.</p>
                </div>
              </div>
              <div className="apply-step">
                <div className="step-num">4</div>
                <div>
                  <b>Track Scheme</b>
                  <p>Use the Track Scheme button above to open the official government portal.</p>
                </div>
              </div>
            </div>

            {scheme.applicationLink && (
              <a
                href={scheme.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn apply-link-btn"
              >
                Go to Official Portal ↗
              </a>
            )}

            <div className="official-note">
              ⓘ <span>Welfora is a discovery tool. We do not process applications. Always apply through official government channels.</span>
            </div>
          </div>
        )}
      </div>

      {/* Eligibility Modal */}
      {showEligibilityModal && (
        <EligibilityModal
          scheme={scheme}
          eligibility={eligibility}
          profileName={profileName}
          onClose={() => setShowEligibilityModal(false)}
        />
      )}
    </section>
  );
}

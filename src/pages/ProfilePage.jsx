import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { SettingsIcon, SunIcon, MoonIcon, CompassIcon } from '../components/Icons';
import { useWelfora } from '../context/WelforaContext';
import './ProfilePage.css';

export default function ProfilePage({ go }) {
  // useNavigate: route between Profile and Settings / Explore
  const navigate = useNavigate();
  const {
    profileName,
    authSession,
    eligibility,
    additionalProfile,
    setAdditionalProfile,
    reminderPreferences = {},
    setReminderPreferences,
    dark,
    setDark,
    notify,
  } = useWelfora();

  // Signup Details (Immutable / Non-changeable registration data)
  const signupName = authSession?.name || profileName || 'Welfora Citizen';
  const signupEmail = authSession?.email || 'citizen@welfora.in';
  const signupAge = authSession?.profile?.age || eligibility?.age || '20';
  const signupState = authSession?.profile?.state || eligibility?.state || 'Punjab';
  const signupOccupation = authSession?.profile?.occupation || eligibility?.occupation || 'Student';
  const signupIncome = authSession?.profile?.income || 'Below ₹1 lakh';
  const signupEducation =
    authSession?.profile?.education ||
    eligibility?.education ||
    (signupOccupation === 'Student' ? 'Undergraduate' : 'Completed');
  const signupInterests =
    authSession?.profile?.interests && authSession.profile.interests.length > 0
      ? authSession.profile.interests
      : ['Scholarships & Education', 'General Financial Assistance'];

  // Additional Details State (Editable)
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ ...additionalProfile });

  const handleStartEdit = () => {
    setDraft({ ...additionalProfile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft({ ...additionalProfile });
    setIsEditing(false);
  };

  const handleSaveAdditional = e => {
    e.preventDefault();
    setAdditionalProfile(draft);
    setIsEditing(false);
    if (notify) {
      notify('Additional citizen details saved successfully!');
    }
  };

  const updateDraft = (field, val) => {
    setDraft(prev => ({ ...prev, [field]: val }));
  };

  // Preferences toggles
  const togglePreference = key => {
    if (!setReminderPreferences) return;
    const updated = {
      ...reminderPreferences,
      [key]: !reminderPreferences[key],
    };
    setReminderPreferences(updated);
    if (notify) {
      const label =
        key === 'upcomingDeadlines'
          ? 'Deadline alerts'
          : key === 'inAppTips'
          ? 'Welfare tips'
          : 'Weekly digest';
      notify(`${label} ${updated[key] ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleTheme = () => {
    setDark(!dark);
    if (notify) {
      notify(`Theme switched to ${!dark ? 'Dark Mode' : 'Light Mode'}`);
    }
  };

  return (
    <section className="page-content profile-page">
      <PageTitle
        eyebrow="CITIZEN IDENTITY & SETTINGS"
        title="My Profile"
        subtitle="Review your verified credentials, update additional citizen attributes, and configure your welfare platform preferences."
      />

      {/* Citizen Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-large-avatar">
            {signupName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-meta">
            <div className="profile-hero-name-row">
              <h2>{signupName}</h2>
              <span className="profile-chip chip-verified">
                ✓ Verified Account
              </span>
            </div>
            <p className="profile-hero-email">{signupEmail}</p>
            <div className="profile-status-badges">
              <span className="profile-chip chip-role">
                💼 {signupOccupation}
              </span>
              <span className="profile-chip chip-state">
                📍 {signupState}
              </span>
              <span className="profile-chip chip-status">
                🇮🇳 Citizen ID: WF-2026-9481
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button
            className="primary-btn small"
            onClick={() => navigate('/explore')}
          >
            <span>Explore My Schemes</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: PERSONAL DETAILS (VERTICAL STRUCTURED LIST)
          ===================================================================== */}
      <div className="profile-section-panel">
        <div className="profile-section-header">
          <div className="section-header-title">
            <div className="section-icon-badge icon-locked">🔒</div>
            <div className="section-title-texts">
              <h3>
                Personal Details
                <span className="badge-tag badge-locked">Locked · From Sign Up</span>
              </h3>
              <p>
                Core credentials provided during registration. These records are locked to maintain verified welfare eligibility.
              </p>
            </div>
          </div>
        </div>

        {/* Vertical List of Personal Details */}
        <div className="vertical-details-group">
          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">👤</span>
              <span className="detail-label">Full Name</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupName}</span>
              <span className="detail-status-pill locked-pill">🔒 Verified</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">✉️</span>
              <span className="detail-label">Email Address</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupEmail}</span>
              <span className="detail-status-pill locked-pill">🔒 Registered</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">🎂</span>
              <span className="detail-label">Age</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupAge} years</span>
              <span className="detail-status-pill locked-pill">🔒 Verified</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">📍</span>
              <span className="detail-label">State / Union Territory</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupState}</span>
              <span className="detail-status-pill locked-pill">🔒 Locked</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">💼</span>
              <span className="detail-label">Occupation</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupOccupation}</span>
              <span className="detail-status-pill locked-pill">🔒 Locked</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">💰</span>
              <span className="detail-label">Annual Household Income</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupIncome}</span>
              <span className="detail-status-pill locked-pill">🔒 Tier Verified</span>
            </div>
          </div>

          <div className="detail-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">🎓</span>
              <span className="detail-label">Education Level</span>
            </div>
            <div className="detail-row-content">
              <span className="detail-value">{signupEducation}</span>
              <span className="detail-status-pill locked-pill">🔒 Verified</span>
            </div>
          </div>

          <div className="detail-vertical-row interests-vertical-row">
            <div className="detail-row-header">
              <span className="detail-icon">🎯</span>
              <span className="detail-label">Benefit Areas of Interest</span>
            </div>
            <div className="detail-row-content chips-content">
              <div className="chips-flex-wrap">
                {signupInterests.map(interest => (
                  <span className="interest-locked-chip" key={interest}>
                    ✓ {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-info-banner">
          <span className="info-icon">ℹ️</span>
          <span>
            These parameters are permanently linked to your citizen profile for automated scheme matching.
            To add new criteria (like caste category or disability), complete the <strong>Additional Citizen Details</strong> below.
          </span>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: ADDITIONAL CITIZEN DETAILS (VERTICAL LIST & FORM)
          ===================================================================== */}
      <div className="profile-section-panel">
        <div className="profile-section-header">
          <div className="section-header-title">
            <div className="section-icon-badge icon-editable">✨</div>
            <div className="section-title-texts">
              <h3>
                Additional Citizen Details
                <span className="badge-tag badge-editable">Editable · Scheme Specific</span>
              </h3>
              <p>
                Supplemental household and demographic attributes to discover targeted scholarships, caste reservations, and regional welfare programs.
              </p>
            </div>
          </div>

          {!isEditing && (
            <button className="btn-edit-main" onClick={handleStartEdit}>
              <span>✎</span>
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {!isEditing ? (
          /* View Mode: Vertical List */
          <div className="vertical-details-group">
            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">👥</span>
                <span className="detail-label">Gender / Identity</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.gender || <span className="not-set">Prefer not to say</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">🏛️</span>
                <span className="detail-label">Social Category / Reservation Group</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.category || <span className="not-set">General</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">♿</span>
                <span className="detail-label">Differently-Abled (PwD) Status</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.disability || <span className="not-set">No</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">💍</span>
                <span className="detail-label">Marital Status</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.maritalStatus || <span className="not-set">Single</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">🏘️</span>
                <span className="detail-label">Area / Locality Type</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.areaType || <span className="not-set">Urban</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">🤝</span>
                <span className="detail-label">Minority Community Member</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.minority || <span className="not-set">No</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">📱</span>
                <span className="detail-label">Contact Mobile Number</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.phone || <span className="not-set">Not provided · Click edit to add</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">🗺️</span>
                <span className="detail-label">District / Residence City</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.district || <span className="not-set">Not provided · Click edit to add</span>}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>

            <div className="detail-vertical-row editable-row">
              <div className="detail-row-header">
                <span className="detail-icon">📝</span>
                <span className="detail-label">Special Needs or Circumstances</span>
              </div>
              <div className="detail-row-content">
                <span className="detail-value">
                  {additionalProfile.notes || (
                    <span className="not-set">
                      None recorded (e.g. single parent, first-generation scholar, BPL ration card holder)
                    </span>
                  )}
                </span>
                <span className="detail-status-pill editable-pill">✎ Editable</span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode: Clean Form */
          <form className="additional-edit-form" onSubmit={handleSaveAdditional}>
            <div className="edit-mode-notice">
              <span>✍️</span>
              <span>
                <strong>Editing Mode Active:</strong> Update the citizen details below and click <strong>Save Changes</strong> to apply immediately.
              </span>
            </div>

            <div className="vertical-form-rows">
              <div className="vertical-form-item">
                <label htmlFor="field-gender">
                  <span className="form-item-icon">👥</span>
                  <span className="form-item-label">Gender / Identity</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-gender"
                  value={draft.gender || 'Prefer not to say'}
                  onChange={e => updateDraft('gender', e.target.value)}
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Non-binary / Other">Non-binary / Other</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-category">
                  <span className="form-item-icon">🏛️</span>
                  <span className="form-item-label">Social Category / Reservation Group</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-category"
                  value={draft.category || 'General'}
                  onChange={e => updateDraft('category', e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="OBC (Other Backward Classes)">OBC (Other Backward Classes)</option>
                  <option value="SC (Scheduled Caste)">SC (Scheduled Caste)</option>
                  <option value="ST (Scheduled Tribe)">ST (Scheduled Tribe)</option>
                  <option value="EWS (Economically Weaker Section)">EWS (Economically Weaker Section)</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-disability">
                  <span className="form-item-icon">♿</span>
                  <span className="form-item-label">Differently-Abled (PwD) Status</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-disability"
                  value={draft.disability || 'No'}
                  onChange={e => updateDraft('disability', e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes (Locomotive / Physical)">Yes (Locomotive / Physical)</option>
                  <option value="Yes (Visual / Hearing)">Yes (Visual / Hearing)</option>
                  <option value="Yes (Other benchmark disability)">Yes (Other benchmark disability)</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-marital">
                  <span className="form-item-icon">💍</span>
                  <span className="form-item-label">Marital Status</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-marital"
                  value={draft.maritalStatus || 'Single'}
                  onChange={e => updateDraft('maritalStatus', e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated / Divorced">Separated / Divorced</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-area">
                  <span className="form-item-icon">🏘️</span>
                  <span className="form-item-label">Area / Locality Type</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-area"
                  value={draft.areaType || 'Urban'}
                  onChange={e => updateDraft('areaType', e.target.value)}
                >
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-minority">
                  <span className="form-item-icon">🤝</span>
                  <span className="form-item-label">Minority Community Member</span>
                  <span className="req-marker">*</span>
                </label>
                <select
                  id="field-minority"
                  value={draft.minority || 'No'}
                  onChange={e => updateDraft('minority', e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes (Recognized Minority Community)">Yes (Recognized Minority Community)</option>
                </select>
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-phone">
                  <span className="form-item-icon">📱</span>
                  <span className="form-item-label">Contact Mobile Number</span>
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={draft.phone || ''}
                  onChange={e => updateDraft('phone', e.target.value)}
                />
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-district">
                  <span className="form-item-icon">🗺️</span>
                  <span className="form-item-label">District / City</span>
                </label>
                <input
                  id="field-district"
                  type="text"
                  placeholder="e.g. Amritsar, Ludhiana, Jaipur"
                  value={draft.district || ''}
                  onChange={e => updateDraft('district', e.target.value)}
                />
              </div>

              <div className="vertical-form-item">
                <label htmlFor="field-notes">
                  <span className="form-item-icon">📝</span>
                  <span className="form-item-label">Special Circumstances & Notes</span>
                </label>
                <textarea
                  id="field-notes"
                  rows={3}
                  placeholder="Mention any specific criteria like BPL card, first-generation scholar, artisanal background, etc."
                  value={draft.notes || ''}
                  onChange={e => updateDraft('notes', e.target.value)}
                />
              </div>
            </div>

            <div className="form-action-buttons">
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save-edit">
                <span>✓</span>
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* =====================================================================
          SECTION 3: PREFERENCES (VERTICAL STRUCTURED ROWS)
          ===================================================================== */}
      <div className="profile-section-panel">
        <div className="profile-section-header">
          <div className="section-header-title">
            <div className="section-icon-badge icon-preferences">⚙️</div>
            <div className="section-title-texts">
              <h3>
                Preferences
                <span className="badge-tag badge-preferences">Customizable · Instant Save</span>
              </h3>
              <p>
                Configure in-app deadline reminders, welfare recommendation tips, and visual theme preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="vertical-details-group">
          {/* 1. Theme Preference */}
          <div className="detail-vertical-row pref-vertical-row">
            <div className="pref-row-left">
              <span className="pref-row-icon">
                {dark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
              </span>
              <div className="pref-row-text">
                <span className="pref-row-title">Appearance Theme</span>
                <span className="pref-row-desc">Switch between the neon dark dashboard theme and clean daytime light theme.</span>
              </div>
            </div>
            <div className="pref-row-right">
              <button
                className="outline-btn small"
                onClick={toggleTheme}
                title="Toggle color theme"
              >
                {dark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                <span>{dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>
            </div>
          </div>

          {/* 2. Upcoming Deadlines */}
          <div className="detail-vertical-row pref-vertical-row">
            <div className="pref-row-left">
              <span className="pref-row-icon">⏱️</span>
              <div className="pref-row-text">
                <span className="pref-row-title">Upcoming Deadline Alerts</span>
                <span className="pref-row-desc">Receive prioritized alerts when government schemes are approaching application closing dates.</span>
              </div>
            </div>
            <div className="pref-row-right">
              <button
                className={`pref-toggle-btn ${reminderPreferences.upcomingDeadlines ? 'active' : ''}`}
                onClick={() => togglePreference('upcomingDeadlines')}
                aria-pressed={!!reminderPreferences.upcomingDeadlines}
              >
                <i className={`switch ${reminderPreferences.upcomingDeadlines ? 'on' : ''}`}>
                  <b />
                </i>
                <span>{reminderPreferences.upcomingDeadlines ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>

          {/* 3. In-App Tips */}
          <div className="detail-vertical-row pref-vertical-row">
            <div className="pref-row-left">
              <span className="pref-row-icon">💡</span>
              <div className="pref-row-text">
                <span className="pref-row-title">Welfare Tips & Recommendations</span>
                <span className="pref-row-desc">Display personalized document hints and eligibility advice across scheme cards and detail views.</span>
              </div>
            </div>
            <div className="pref-row-right">
              <button
                className={`pref-toggle-btn ${reminderPreferences.inAppTips ? 'active' : ''}`}
                onClick={() => togglePreference('inAppTips')}
                aria-pressed={!!reminderPreferences.inAppTips}
              >
                <i className={`switch ${reminderPreferences.inAppTips ? 'on' : ''}`}>
                  <b />
                </i>
                <span>{reminderPreferences.inAppTips ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>

          {/* 4. Weekly Digest */}
          <div className="detail-vertical-row pref-vertical-row">
            <div className="pref-row-left">
              <span className="pref-row-icon">📬</span>
              <div className="pref-row-text">
                <span className="pref-row-title">Weekly Opportunity Digest</span>
                <span className="pref-row-desc">Receive weekly curated highlights of newly announced central and state welfare benefits.</span>
              </div>
            </div>
            <div className="pref-row-right">
              <button
                className={`pref-toggle-btn ${reminderPreferences.weeklyDigest ? 'active' : ''}`}
                onClick={() => togglePreference('weeklyDigest')}
                aria-pressed={!!reminderPreferences.weeklyDigest}
              >
                <i className={`switch ${reminderPreferences.weeklyDigest ? 'on' : ''}`}>
                  <b />
                </i>
                <span>{reminderPreferences.weeklyDigest ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="profile-page-footer">
        <button className="outline-btn" onClick={() => navigate('/settings')}>
          <SettingsIcon size={15} />
          <span>Advanced Account Settings</span>
        </button>
        <button className="primary-btn" onClick={() => navigate('/explore')}>
          <CompassIcon size={16} />
          <span>Explore Eligible Schemes →</span>
        </button>
      </div>
    </section>
  );
}

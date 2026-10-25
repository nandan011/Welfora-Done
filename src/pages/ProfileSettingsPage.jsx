import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { SunIcon, MoonIcon } from '../components/Icons';
import { useWelfora } from '../context/WelforaContext';

export default function ProfileSettingsPage({ title = 'Profile' }) {
  // useNavigate: programmatically navigate to sub-pages
  const navigate = useNavigate();
  const {
    profileName,
    setProfileName,
    dark,
    setDark,
    saved,
    loadScenario,
    simulateApiError,
  } = useWelfora();

  return (
    <section className="page-content">
      <PageTitle
        eyebrow="YOUR WORKSPACE"
        title={title}
        subtitle="Personalize your Welfora demo experience and test application scenarios."
      />

      <div className="panel settings-panel">
        <div className="settings-avatar">
          {profileName.charAt(0).toUpperCase()}
        </div>

        <label>
          Display name
          <input
            aria-label="Display name"
            value={profileName}
            onChange={e => setProfileName(e.target.value)}
          />
        </label>

        <div className="setting-row">
          <div>
            <b>Appearance</b>
            <p>Switch between the neon dark theme and light theme.</p>
          </div>
          <button
            className="outline-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setDark(!dark)}
          >
            {dark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
            <span>{dark ? 'Switch to light' : 'Switch to dark'}</span>
          </button>
        </div>

        <div className="setting-row">
          <div>
            <b>Saved schemes</b>
            <p>{saved.length} scheme(s) saved on this device.</p>
          </div>
          <button className="outline-btn" onClick={() => navigate('/saved')}>
            View saved
          </button>
        </div>

        <div className="setting-row">
          <div>
            <b>Deadline reminders</b>
            <p>Control in-app deadline and tip notifications.</p>
          </div>
          <button className="outline-btn" onClick={() => navigate('/notifications')}>
            Manage reminders
          </button>
        </div>

        {/* Demo Scenarios & Test Suite */}
        <div className="setting-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <b>Demo Scenarios & Testing</b>
            <p>Switch between demo personas or test error handling.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="outline-btn"
              onClick={() => loadScenario('student')}
              title="Preloads a student profile with education scholarships"
            >
              🎓 Student Scenario
            </button>
            <button
              className="outline-btn"
              onClick={() => loadScenario('clean')}
              title="Clears all saved and tracked applications"
            >
              🧹 Clean Scenario
            </button>
            <button
              className="outline-btn"
              onClick={() => loadScenario('default')}
              title="Resets profile and demo data to default"
            >
              ↺ Reset Demo Data
            </button>
            <button
              className="outline-btn"
              onClick={simulateApiError}
              title="Simulates network/API error to test banner and retry button"
            >
              ⚠️ Simulate API Error
            </button>
          </div>
        </div>

        <p className="disclaimer">
          Saved schemes, tracked schemes, preferences and notification dismissals are stored locally in this browser. Scheme records and dates are illustrative, not official. Reset demo data restores a predictable starting state.
        </p>
      </div>
    </section>
  );
}

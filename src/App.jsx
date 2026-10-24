import { useEffect, useState } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SchemeModal from './components/SchemeModal';
import Dashboard from './pages/Dashboard';
import PageViews from './pages/PageViews';
import { WelforaProvider, useWelfora } from './context/WelforaContext';

const pagePaths = {
  Dashboard: '/',
  Home: '/',
  Recommended: '/recommended',
  'Explore Schemes': '/explore',
  'Find My Schemes': '/find-schemes',
  'Saved Schemes': '/saved',
  Deadlines: '/deadlines',
  'AI Assistant': '/chatbot',
  Notifications: '/notifications',
  Profile: '/profile',
  Settings: '/settings',
  'Eligibility Guide': '/eligibility',
  'About Us': '/about',
};

const pathPages = Object.fromEntries(
  Object.entries(pagePaths).map(([label, path]) => [path, label])
);

const incomeToNumber = {
  'Below ₹1 lakh': '75000',
  '₹1–2.5 lakh': '175000',
  '₹2.5–5 lakh': '375000',
  '₹5–10 lakh': '750000',
  'Above ₹10 lakh': '1200000',
  'Prefer not to say': '0',
};

export default function App() {
  return (
    <BrowserRouter>
      <WelforaProvider>
        <WelforaApp />
      </WelforaProvider>
    </BrowserRouter>
  );
}

function WelforaApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    dark,
    authSession,
    setAuthSession,
    setProfileName,
    setEligibility,
    selectedScheme,
    setSelectedScheme,
    saved,
    toggleSave,
    applyScheme,
    toast,
    toastType,
    notify,
  } = useWelfora();

  const [page, setPage] = useState(pathPages[location.pathname] || 'Not Found');

  // Personalization animation state
  const [pendingSession, setPendingSession] = useState(null);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalizationProgress, setPersonalizationProgress] = useState(0);

  // Sync route with page state
  useEffect(() => {
    setPage(pathPages[location.pathname] || 'Not Found');
    setSelectedScheme(null);
  }, [location.pathname, setSelectedScheme]);

  function go(to) {
    setPage(to);
    setSelectedScheme(null);
    navigate(pagePaths[to] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAuthComplete(account) {
    const profile = account.profile || {};
    const newEligibility = {
      age: String(profile.age || '20'),
      state: profile.state || 'Punjab',
      occupation: profile.occupation || 'Other',
      income: incomeToNumber[profile.income] ?? '0',
      education: profile.education || '',
    };

    setProfileName(account.name || 'Welfora User');
    setEligibility(newEligibility);
    setPendingSession({
      name: account.name || 'Welfora User',
      email: account.email,
      profile: { ...profile },
    });
    setPersonalizationProgress(0);
    setPersonalizing(true);
  }

  // Personalization progress
  useEffect(() => {
    if (!personalizing || !pendingSession) return undefined;
    const startedAt = Date.now();
    const duration = 3000;

    const progressTimer = window.setInterval(() => {
      setPersonalizationProgress(
        Math.min(100, Math.round(((Date.now() - startedAt) / duration) * 100))
      );
    }, 50);

    const finishTimer = window.setTimeout(() => {
      const session = {
        name: pendingSession.name,
        email: pendingSession.email,
        profile: pendingSession.profile,
      };
      try {
        localStorage.setItem('welfora-demo-session', JSON.stringify(session));
      } catch {}

      setAuthSession(session);
      setPendingSession(null);
      setPersonalizing(false);
      setPage('Dashboard');
      navigate('/');
    }, duration);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [personalizing, pendingSession, navigate, setAuthSession]);

  function handleLogout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('welfora-demo-session');
      window.location.href = window.location.pathname;
    }
  }

  // Personalizing screen
  if (personalizing) {
    return (
      <div className="wf-personalizing">
        <div className="personalizing-orbit">
          <div className="personalizing-core">W</div>
        </div>
        <span className="personalizing-label">WELFORA</span>
        <h1>
          Personalizing your data<span className="personalizing-ellipsis">...</span>
        </h1>
        <p>Finding schemes that may match your profile and interests.</p>
        <div
          className="personalizing-track"
          role="progressbar"
          aria-valuenow={personalizationProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${personalizationProgress}%` }} />
        </div>
        <span className="personalizing-percent">{personalizationProgress}%</span>
      </div>
    );
  }

  // Auth screen
  if (!authSession) {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  const isDashboard = page === 'Dashboard' || page === 'Home';

  return (
    <div className={`wf ${dark ? 'dark' : 'light'}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Sidebar page={page} go={go} onLogout={handleLogout} />

      <main className="main" id="main-content" tabIndex={-1}>
        <Topbar page={page} go={go} />

        {/* Active Page View */}
        {isDashboard ? (
          <Dashboard go={go} />
        ) : (
          <PageViews page={page} go={go} />
        )}

        <footer className="main-footer">
          <span>WELFORA © 2026</span>
          <span>
            Making public welfare transparent, accessible, and dignified for every citizen. <b>✦</b>
          </span>
          <span>Citizen Welfare Navigator</span>
        </footer>
      </main>

      {/* Scheme Detail Modal (global) */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          isSaved={saved.includes(selectedScheme.id)}
          onToggleSave={toggleSave}
          onApply={applyScheme}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`toast toast-${toastType || 'success'}`}
          role="status"
          aria-live="polite"
        >
          {toastType === 'error' ? '⚠' : toastType === 'info' ? 'ℹ' : '✓'} {toast}
        </div>
      )}
    </div>
  );
}

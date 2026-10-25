import { lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { WelforaProvider, useWelfora } from './context/WelforaContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Dashboard from './pages/Dashboard';
import ExplorePage from './pages/ExplorePage';
import FindSchemesPage from './pages/FindSchemesPage';
import SavedSchemesPage from './pages/SavedSchemesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import EligibilityPage from './pages/EligibilityPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// React.lazy: Code splitting for heavy routes to reduce initial JS bundle size
const DeadlinesPage = lazy(() => import('./pages/DeadlinesPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SchemeDetailPage = lazy(() => import('./pages/SchemeDetailPage'));

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
    // BrowserRouter: HTML5 history API router providing client-side navigation
    <BrowserRouter>
      <WelforaProvider>
        <WelforaRoutes />
      </WelforaProvider>
    </BrowserRouter>
  );
}

function WelforaRoutes() {
  const navigate = useNavigate();
  const {
    authSession,
    setAuthSession,
    setProfileName,
    setEligibility,
  } = useWelfora();

  // Personalization animation state
  const [pendingSession, setPendingSession] = useState(null);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalizationProgress, setPersonalizationProgress] = useState(0);

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

  // Personalization progress simulation
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
      } catch (err) {
        console.warn('Failed to save session to localStorage:', err);
      }

      setAuthSession(session);
      setPendingSession(null);
      setPersonalizing(false);
      navigate('/');
    }, duration);

    // useEffect cleanup: Clears active intervals and timeouts when unmounting
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [personalizing, pendingSession, navigate, setAuthSession]);

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

  return (
    // Routes: Matches current URL pathname to child Route definitions
    <Routes>
      {/* Public route: Authentication */}
      <Route
        path="/login"
        element={
          authSession ? (
            <Navigate to="/" replace />
          ) : (
            <AuthScreen onComplete={handleAuthComplete} />
          )
        }
      />

      {/* Protected Routes guarded by ProtectedRoute and wrapped with shared Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<ExplorePage isRecommended={false} />} />
          <Route path="/recommended" element={<ExplorePage isRecommended={true} />} />
          <Route path="/find-schemes" element={<FindSchemesPage />} />
          <Route path="/saved" element={<SavedSchemesPage />} />
          <Route path="/deadlines" element={<DeadlinesPage />} />
          <Route path="/chatbot" element={<AssistantPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<ProfileSettingsPage title="Settings" />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/scheme/:id" element={<SchemeDetailPage />} />
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

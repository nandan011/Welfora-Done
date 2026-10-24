import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { readStoredValue, usePersistentState } from '../hooks/usePersistentState';
import { initialNotifications } from '../data/notifications';
import { schemes as defaultSchemes } from '../data/schemes';
import { getSchemesFromApi } from '../services/schemeService';
import { assessSchemeFit } from '../utils/schemeUtils';
import { useDeadlineItems } from '../hooks/useDeadlineItems';

const WelforaContext = createContext(null);

const serializeBoolean = value => String(value);
const deserializeBoolean = value => value !== 'false';
const serializeString = value => value;
const deserializeProfileName = value => value || 'Guest User';

const defaultEligibility = {
  age: '20',
  state: 'Punjab',
  occupation: 'Student',
  income: '300000',
  education: 'Undergraduate',
};

const defaultPreferences = {
  upcomingDeadlines: true,
  inAppTips: true,
  weeklyDigest: false,
};

const defaultAdditionalProfile = {
  gender: 'Prefer not to say',
  category: 'General',
  disability: 'No',
  maritalStatus: 'Single',
  areaType: 'Urban',
  minority: 'No',
  phone: '',
  district: '',
  notes: '',
};

export function WelforaProvider({ children }) {
  // Theme & Identity
  const [dark, setDark] = usePersistentState('welfora-dark', true, {
    serialize: serializeBoolean,
    deserialize: deserializeBoolean,
  });
  const [profileName, setProfileName] = usePersistentState('welfora-profile-name', 'Guest User', {
    serialize: serializeString,
    deserialize: deserializeProfileName,
  });

  // User Session
  const [authSession, setAuthSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('welfora-demo-session') || 'null');
    } catch {
      return null;
    }
  });

  // Saved & Tracked Applications
  const [saved, setSaved] = usePersistentState('welfora-saved', [2]);
  const [applied, setApplied] = usePersistentState('welfora-applied', []);
  const [applicationStatuses, setApplicationStatuses] = usePersistentState('welfora-application-statuses', {});
  const [documentChecks, setDocumentChecks] = usePersistentState('welfora-document-checks', {});
  const [applicationNotes, setApplicationNotes] = usePersistentState('welfora-application-notes', {});

  // Eligibility Profile & Additional Details
  const [eligibility, setEligibility] = usePersistentState('welfora-eligibility-profile', defaultEligibility);
  const [additionalProfile, setAdditionalProfile] = usePersistentState('welfora-additional-profile', defaultAdditionalProfile);

  // Notifications & Reminders
  const [notifications, setNotifications] = usePersistentState('welfora-notifications', initialNotifications);
  const [reminderPreferences, setReminderPreferences] = usePersistentState('welfora-reminder-preferences', defaultPreferences);

  // Scheme Catalogue & API
  const [apiSchemes, setApiSchemes] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Global explore/search state (avoids prop drilling)
  const [exploreQuery, setExploreQuery] = useState('');
  const [exploreCategory, setExploreCategory] = useState('All categories');
  const [exploreState, setExploreState] = useState('All states');

  // Find-My-Schemes form profile (separate from auth profile for the feature)
  const [findProfile, setFindProfile] = usePersistentState('welfora-find-profile', null);
  const [findResults, setFindResults] = useState(null); // null = not searched yet

  // UI State: Modal & Toast
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error' | 'info'

  // Toast notification helper
  const notify = useCallback((message, type = 'success') => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  }, []);

  // Fetch schemes from API service
  const loadSchemes = useCallback(async () => {
    setApiLoading(true);
    setApiError('');
    try {
      const data = await getSchemesFromApi();
      setApiSchemes(data);
    } catch (err) {
      setApiError('Unable to load schemes. Please check your connection and try again.');
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  // Derived catalogue
  const displaySchemes = useMemo(() => {
    return apiSchemes.length > 0 ? apiSchemes : defaultSchemes;
  }, [apiSchemes]);

  const assessedSchemes = useMemo(() => {
    return displaySchemes.map(s => ({
      ...s,
      fit: assessSchemeFit(s, eligibility),
    }));
  }, [displaySchemes, eligibility]);

  // Find-my-schemes: filter based on submitted findProfile
  const findSchemeResults = useMemo(() => {
    if (!findProfile) return null;
    return assessedSchemes.filter(s => {
      const catMatch =
        !findProfile.category ||
        findProfile.category === 'All' ||
        s.category.toLowerCase().includes(findProfile.category.toLowerCase());
      const stateMatch =
        !findProfile.state ||
        findProfile.state === 'All States' ||
        s.state === 'All India' ||
        s.state === 'State dependent' ||
        s.state === 'Participating states' ||
        s.state.toLowerCase().includes(findProfile.state.toLowerCase());
      const occMatch =
        !findProfile.occupation ||
        assessSchemeFit(s, {
          ...eligibility,
          occupation: findProfile.occupation,
          income: String(findProfile.income || eligibility.income),
          age: String(findProfile.age || eligibility.age),
        }).score >= 45;
      return catMatch && stateMatch && occMatch;
    }).sort((a, b) => (b.fit?.score || 0) - (a.fit?.score || 0));
  }, [findProfile, assessedSchemes, eligibility]);

  // Derived deadline items
  const deadlineItems = useDeadlineItems(displaySchemes);

  // Visible notifications based on user preferences
  const visibleNotifications = useMemo(() => {
    return notifications
      .filter(n => n.kind !== 'deadline' || reminderPreferences.upcomingDeadlines)
      .filter(n => n.kind !== 'general' || reminderPreferences.inAppTips);
  }, [notifications, reminderPreferences]);

  // Actions: Saved Schemes
  const toggleSave = useCallback((id) => {
    setSaved(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      notify(exists ? 'Scheme removed from saved schemes' : 'Scheme saved successfully ✓', exists ? 'info' : 'success');
      return next;
    });
  }, [setSaved, notify]);

  // Actions: Applications
  const applyScheme = useCallback((id) => {
    setApplied(prev => (prev.includes(id) ? prev : [...prev, id]));
    setApplicationStatuses(prev => ({ ...prev, [id]: prev[id] || 'Not started' }));
    setSelectedScheme(null);
    notify('Added to your application tracker');
  }, [setApplied, setApplicationStatuses, notify]);

  const removeApplication = useCallback((id) => {
    setApplied(prev => prev.filter(item => item !== id));
    setApplicationStatuses(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setDocumentChecks(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setApplicationNotes(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    notify('Application removed from tracker');
  }, [setApplied, setApplicationStatuses, setDocumentChecks, setApplicationNotes, notify]);

  const updateApplicationStatus = useCallback((id, status) => {
    setApplicationStatuses(prev => ({ ...prev, [id]: status }));
  }, [setApplicationStatuses]);

  const toggleDocumentCheck = useCallback((id, doc) => {
    setDocumentChecks(prev => {
      const current = prev[id] || [];
      const updated = current.includes(doc)
        ? current.filter(x => x !== doc)
        : [...current, doc];
      return { ...prev, [id]: updated };
    });
  }, [setDocumentChecks]);

  const saveApplicationNote = useCallback((id, note) => {
    setApplicationNotes(prev => ({ ...prev, [id]: note }));
    notify('Application note saved on this device');
  }, [setApplicationNotes, notify]);

  // Actions: Notifications
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }, [setNotifications]);

  const dismissAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const restoreNotifications = useCallback(() => {
    setNotifications(initialNotifications);
    notify('Demo notifications restored');
  }, [setNotifications, notify]);

  // Actions: Demo Scenarios
  const loadScenario = useCallback((scenarioType) => {
    if (scenarioType === 'student') {
      setProfileName('Aarav Sharma');
      setEligibility({ age: '20', state: 'Punjab', occupation: 'Student', income: '300000', education: 'Undergraduate' });
      setSaved([1, 2, 5]);
      setApplied([1]);
      setApplicationStatuses({ 1: 'Preparing documents' });
      setDocumentChecks({ 1: ['Identity proof (if required)', 'Bank details (if required)'] });
      setApplicationNotes({ 1: 'Gathering marks sheets and college admission receipt' });
      notify('Student demo scenario loaded');
    } else if (scenarioType === 'clean') {
      setSaved([]);
      setApplied([]);
      setApplicationStatuses({});
      setDocumentChecks({});
      setApplicationNotes({});
      notify('Clean demo scenario loaded');
    } else {
      setProfileName('Guest User');
      setEligibility(defaultEligibility);
      setSaved([2]);
      setApplied([]);
      setApplicationStatuses({});
      setDocumentChecks({});
      setApplicationNotes({});
      setNotifications(initialNotifications);
      setReminderPreferences(defaultPreferences);
      notify('Demo data reset to default');
    }
  }, [setProfileName, setEligibility, setSaved, setApplied, setApplicationStatuses, setDocumentChecks, setApplicationNotes, setNotifications, setReminderPreferences, notify]);

  const simulateApiError = useCallback(() => {
    setApiLoading(false);
    setApiSchemes([]);
    setApiError('Simulated connection error. Click Retry to reconnect.');
    notify('Simulated API error triggered', 'error');
  }, [notify]);

  const contextValue = {
    // Theme & Profile
    dark, setDark,
    profileName, setProfileName,
    authSession, setAuthSession,

    // Data
    schemes: displaySchemes,
    assessedSchemes,
    deadlineItems,
    saved, setSaved,
    applied, setApplied,
    applicationStatuses,
    documentChecks,
    applicationNotes,
    eligibility, setEligibility,
    additionalProfile, setAdditionalProfile,
    notifications, setNotifications,
    visibleNotifications,
    reminderPreferences, setReminderPreferences,

    // Find-my-schemes
    findProfile, setFindProfile,
    findResults: findSchemeResults,
    findResultsReady: findProfile !== null,

    // Global explore state (no prop-drilling)
    exploreQuery, setExploreQuery,
    exploreCategory, setExploreCategory,
    exploreState, setExploreState,

    // API status
    apiLoading, setApiLoading,
    apiError, setApiError,
    loadSchemes,
    simulateApiError,

    // Modal & Toast
    selectedScheme, setSelectedScheme,
    toast, toastType,
    notify,

    // Action Methods
    toggleSave,
    applyScheme,
    removeApplication,
    updateApplicationStatus,
    toggleDocumentCheck,
    saveApplicationNote,
    dismissNotification,
    dismissAllNotifications,
    restoreNotifications,
    loadScenario,
  };

  return (
    <WelforaContext.Provider value={contextValue}>
      {children}
    </WelforaContext.Provider>
  );
}

export function useWelfora() {
  const context = useContext(WelforaContext);
  if (!context) {
    throw new Error('useWelfora must be used inside WelforaProvider');
  }
  return context;
}

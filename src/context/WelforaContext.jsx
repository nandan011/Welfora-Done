// WelforaContext: Unified Facade integrating Zustand store + ThemeContext + NotificationContext
// Syllabus Topic: State Architecture in React Apps, Global vs Local State, Intro to Zustand & Context API
import { createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { NotificationProvider, useNotification } from './NotificationContext';
import { useWelforaStore } from '../store/useWelforaStore';
import { assessSchemeFit } from '../utils/schemeUtils';
import { useDeadlineItems } from '../hooks/useDeadlineItems';

const WelforaContext = createContext(null);

function WelforaFacadeInner({ children }) {
  // 1. Context API: Theme & Notifications
  const { dark, setDark, toggleTheme } = useTheme();
  const {
    toast,
    toastType,
    notify,
    notifications,
    setNotifications,
    visibleNotifications,
    reminderPreferences,
    setReminderPreferences,
    dismissNotification,
    dismissAllNotifications,
    restoreNotifications,
  } = useNotification();

  // 2. Zustand Store: Global scheme catalog, user profile, application tracker
  const store = useWelforaStore();

  // Initialize catalog fetch on mount
  useEffect(() => {
    store.loadSchemes();
  }, []);

  // Derived catalog schemes
  const schemes = useMemo(() => {
    return store.getSchemes();
  }, [store.apiSchemes]);

  // Derived scheme eligibility scoring based on current user eligibility profile
  const assessedSchemes = useMemo(() => {
    return schemes.map(s => ({
      ...s,
      fit: assessSchemeFit(s, store.eligibility),
    }));
  }, [schemes, store.eligibility]);

  // Derived deadline tracking items
  const deadlineItems = useDeadlineItems(schemes);

  // Find-my-schemes results derived from questionnaire
  const findSchemeResults = useMemo(() => {
    if (!store.findProfile) return null;
    return assessedSchemes.filter(s => {
      const catMatch =
        !store.findProfile.category ||
        store.findProfile.category === 'All' ||
        s.category.toLowerCase().includes(store.findProfile.category.toLowerCase());
      const stateMatch =
        !store.findProfile.state ||
        store.findProfile.state === 'All States' ||
        s.state === 'All India' ||
        s.state === 'State dependent' ||
        s.state === 'Participating states' ||
        s.state.toLowerCase().includes(store.findProfile.state.toLowerCase());
      const occMatch =
        !store.findProfile.occupation ||
        assessSchemeFit(s, {
          ...store.eligibility,
          occupation: store.findProfile.occupation,
          income: String(store.findProfile.income || store.eligibility.income),
          age: String(store.findProfile.age || store.eligibility.age),
        }).score >= 45;
      return catMatch && stateMatch && occMatch;
    }).sort((a, b) => (b.fit?.score || 0) - (a.fit?.score || 0));
  }, [store.findProfile, assessedSchemes, store.eligibility]);

  // Wrapped actions combining Zustand mutation with notification feedback
  const handleToggleSave = useCallback((id) => {
    const isNowSaved = store.toggleSave(id);
    notify(
      isNowSaved ? 'Scheme saved successfully ✓' : 'Scheme removed from saved schemes',
      isNowSaved ? 'success' : 'info'
    );
  }, [store.toggleSave, notify]);

  const handleApplyScheme = useCallback((id) => {
    store.applyScheme(id);
    notify('Added to your application tracker');
  }, [store.applyScheme, notify]);

  const handleRemoveApplication = useCallback((id) => {
    store.removeApplication(id);
    notify('Application removed from tracker');
  }, [store.removeApplication, notify]);

  const handleSaveApplicationNote = useCallback((id, note) => {
    store.saveApplicationNote(id, note);
    notify('Application note saved on this device');
  }, [store.saveApplicationNote, notify]);

  const handleLoadScenario = useCallback((scenarioType) => {
    store.loadScenario(scenarioType);
    if (scenarioType === 'student') notify('Student demo scenario loaded');
    else if (scenarioType === 'clean') notify('Clean demo scenario loaded');
    else notify('Demo data reset to default');
  }, [store.loadScenario, notify]);

  const handleSimulateApiError = useCallback(() => {
    store.simulateApiError();
    notify('Simulated API error triggered', 'error');
  }, [store.simulateApiError, notify]);

  // Aggregated context value providing clean backward compatibility
  const value = {
    // Theme (from Context)
    dark,
    setDark,
    toggleTheme,

    // Identity & Session (from Zustand)
    profileName: store.profileName,
    setProfileName: store.setProfileName,
    authSession: store.authSession,
    setAuthSession: store.setAuthSession,
    eligibility: store.eligibility,
    setEligibility: store.setEligibility,
    additionalProfile: store.additionalProfile,
    setAdditionalProfile: store.setAdditionalProfile,

    // Catalog & Schemes (from Zustand + derived)
    schemes,
    assessedSchemes,
    deadlineItems,
    apiLoading: store.apiLoading,
    apiError: store.apiError,
    loadSchemes: store.loadSchemes,
    simulateApiError: handleSimulateApiError,

    // Application Tracking (from Zustand)
    saved: store.saved,
    applied: store.applied,
    applicationStatuses: store.applicationStatuses,
    documentChecks: store.documentChecks,
    applicationNotes: store.applicationNotes,
    toggleSave: handleToggleSave,
    applyScheme: handleApplyScheme,
    removeApplication: handleRemoveApplication,
    updateApplicationStatus: store.updateApplicationStatus,
    toggleDocumentCheck: store.toggleDocumentCheck,
    saveApplicationNote: handleSaveApplicationNote,

    // Global Search & Filters (from Zustand)
    exploreQuery: store.exploreQuery,
    setExploreQuery: store.setExploreQuery,
    exploreCategory: store.exploreCategory,
    setExploreCategory: store.setExploreCategory,
    exploreState: store.exploreState,
    setExploreState: store.setExploreState,
    findProfile: store.findProfile,
    setFindProfile: store.setFindProfile,
    findResults: findSchemeResults,
    findResultsReady: store.findProfile !== null,

    // Modal & Toast (from Context & Zustand)
    selectedScheme: store.selectedScheme,
    setSelectedScheme: store.setSelectedScheme,
    toast,
    toastType,
    notify,

    // Notifications (from Context)
    notifications,
    setNotifications,
    visibleNotifications,
    reminderPreferences,
    setReminderPreferences,
    dismissNotification,
    dismissAllNotifications,
    restoreNotifications,

    // Demo Scenarios
    loadScenario: handleLoadScenario,
  };

  return (
    <WelforaContext.Provider value={value}>
      {children}
    </WelforaContext.Provider>
  );
}

// Top-level Provider nesting ThemeProvider and NotificationProvider
export function WelforaProvider({ children }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WelforaFacadeInner>
          {children}
        </WelforaFacadeInner>
      </NotificationProvider>
    </ThemeProvider>
  );
}

// Consumer hook
export function useWelfora() {
  const context = useContext(WelforaContext);
  if (!context) {
    throw new Error('useWelfora must be used within WelforaProvider');
  }
  return context;
}

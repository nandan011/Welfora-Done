// Zustand Store: Centralized state management for Welfora catalog, user profile & application tracker
// Syllabus Topic: Intro to Redux Toolkit or Zustand, Global vs Local state
import { create } from 'zustand';
import { schemes as defaultSchemes } from '../data/schemes';
import { getSchemesFromApi } from '../services/schemeService';

const defaultEligibility = {
  age: '20',
  state: 'Punjab',
  occupation: 'Student',
  income: '300000',
  education: 'Undergraduate',
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

// Safe localStorage loader
function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredJson(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Storage access unavailable
  }
}

export const useWelforaStore = create((set, get) => ({
  // ==========================================
  // 1. SCHEMES CATALOG & ASYNC STATE
  // ==========================================
  apiSchemes: [],
  apiLoading: true,
  apiError: '',

  // Async action: loads schemes from mock API or backend proxy
  loadSchemes: async () => {
    set({ apiLoading: true, apiError: '' });
    try {
      const data = await getSchemesFromApi();
      set({ apiSchemes: data, apiLoading: false });
    } catch {
      set({
        apiError: 'Unable to load schemes. Please check your connection and try again.',
        apiLoading: false,
      });
    }
  },

  simulateApiError: () => {
    set({
      apiSchemes: [],
      apiLoading: false,
      apiError: 'Simulated connection error. Click Retry to reconnect.',
    });
  },

  // Derived catalogue getter: combines API results with fallback defaults
  getSchemes: () => {
    const api = get().apiSchemes;
    return api && api.length > 0 ? api : defaultSchemes;
  },

  // ==========================================
  // 2. USER SESSION & ELIGIBILITY PROFILE
  // ==========================================
  authSession: getStoredJson('welfora-demo-session', null),
  profileName: (() => {
    try {
      return localStorage.getItem('welfora-profile-name') || 'Guest User';
    } catch {
      return 'Guest User';
    }
  })(),
  eligibility: getStoredJson('welfora-eligibility-profile', defaultEligibility),
  additionalProfile: getStoredJson('welfora-additional-profile', defaultAdditionalProfile),

  setAuthSession: (session) => {
    setStoredJson('welfora-demo-session', session);
    set({ authSession: session });
  },

  setProfileName: (name) => {
    try {
      localStorage.setItem('welfora-profile-name', name);
    } catch {
      // Storage unavailable
    }
    set({ profileName: name });
  },

  setEligibility: (updater) => {
    const next = typeof updater === 'function' ? updater(get().eligibility) : { ...get().eligibility, ...updater };
    setStoredJson('welfora-eligibility-profile', next);
    set({ eligibility: next });
  },

  setAdditionalProfile: (updater) => {
    const next = typeof updater === 'function' ? updater(get().additionalProfile) : { ...get().additionalProfile, ...updater };
    setStoredJson('welfora-additional-profile', next);
    set({ additionalProfile: next });
  },

  // ==========================================
  // 3. SAVED SCHEMES & TRACKED APPLICATIONS
  // ==========================================
  saved: getStoredJson('welfora-saved', [2]),
  applied: getStoredJson('welfora-applied', []),
  applicationStatuses: getStoredJson('welfora-application-statuses', {}),
  documentChecks: getStoredJson('welfora-document-checks', {}),
  applicationNotes: getStoredJson('welfora-application-notes', {}),

  toggleSave: (id) => {
    const current = get().saved;
    const exists = current.includes(id);
    const next = exists ? current.filter(x => x !== id) : [...current, id];
    setStoredJson('welfora-saved', next);
    set({ saved: next });
    return !exists; // returns true if now saved
  },

  applyScheme: (id) => {
    const current = get().applied;
    if (!current.includes(id)) {
      const next = [...current, id];
      setStoredJson('welfora-applied', next);
      const statuses = { ...get().applicationStatuses, [id]: get().applicationStatuses[id] || 'Not started' };
      setStoredJson('welfora-application-statuses', statuses);
      set({ applied: next, applicationStatuses: statuses, selectedScheme: null });
    }
  },

  removeApplication: (id) => {
    const nextApplied = get().applied.filter(item => item !== id);
    const nextStatuses = { ...get().applicationStatuses };
    delete nextStatuses[id];
    const nextChecks = { ...get().documentChecks };
    delete nextChecks[id];
    const nextNotes = { ...get().applicationNotes };
    delete nextNotes[id];

    setStoredJson('welfora-applied', nextApplied);
    setStoredJson('welfora-application-statuses', nextStatuses);
    setStoredJson('welfora-document-checks', nextChecks);
    setStoredJson('welfora-application-notes', nextNotes);

    set({
      applied: nextApplied,
      applicationStatuses: nextStatuses,
      documentChecks: nextChecks,
      applicationNotes: nextNotes,
    });
  },

  updateApplicationStatus: (id, status) => {
    const nextStatuses = { ...get().applicationStatuses, [id]: status };
    setStoredJson('welfora-application-statuses', nextStatuses);
    set({ applicationStatuses: nextStatuses });
  },

  toggleDocumentCheck: (id, doc) => {
    const current = get().documentChecks[id] || [];
    const updated = current.includes(doc)
      ? current.filter(x => x !== doc)
      : [...current, doc];
    const nextChecks = { ...get().documentChecks, [id]: updated };
    setStoredJson('welfora-document-checks', nextChecks);
    set({ documentChecks: nextChecks });
  },

  saveApplicationNote: (id, note) => {
    const nextNotes = { ...get().applicationNotes, [id]: note };
    setStoredJson('welfora-application-notes', nextNotes);
    set({ applicationNotes: nextNotes });
  },

  // ==========================================
  // 4. GLOBAL SEARCH, FILTER & MODAL STATE
  // ==========================================
  exploreQuery: '',
  exploreCategory: 'All categories',
  exploreState: 'All states',
  findProfile: getStoredJson('welfora-find-profile', null),
  selectedScheme: null,

  setExploreQuery: (query) => set({ exploreQuery: query }),
  setExploreCategory: (category) => set({ exploreCategory: category }),
  setExploreState: (state) => set({ exploreState: state }),
  setFindProfile: (profile) => {
    setStoredJson('welfora-find-profile', profile);
    set({ findProfile: profile });
  },
  setSelectedScheme: (scheme) => set({ selectedScheme: scheme }),

  // ==========================================
  // 5. DEMO SCENARIO PRESETS
  // ==========================================
  loadScenario: (scenarioType) => {
    if (scenarioType === 'student') {
      const studentProfile = { age: '20', state: 'Punjab', occupation: 'Student', income: '300000', education: 'Undergraduate' };
      setStoredJson('welfora-eligibility-profile', studentProfile);
      setStoredJson('welfora-saved', [1, 2, 5]);
      setStoredJson('welfora-applied', [1]);
      setStoredJson('welfora-application-statuses', { 1: 'Preparing documents' });
      setStoredJson('welfora-document-checks', { 1: ['Identity proof (if required)', 'Bank details (if required)'] });
      setStoredJson('welfora-application-notes', { 1: 'Gathering marks sheets and college admission receipt' });
      try { localStorage.setItem('welfora-profile-name', 'Aarav Sharma'); } catch { /* Storage unavailable */ }

      set({
        profileName: 'Aarav Sharma',
        eligibility: studentProfile,
        saved: [1, 2, 5],
        applied: [1],
        applicationStatuses: { 1: 'Preparing documents' },
        documentChecks: { 1: ['Identity proof (if required)', 'Bank details (if required)'] },
        applicationNotes: { 1: 'Gathering marks sheets and college admission receipt' },
      });
    } else if (scenarioType === 'clean') {
      setStoredJson('welfora-saved', []);
      setStoredJson('welfora-applied', []);
      setStoredJson('welfora-application-statuses', {});
      setStoredJson('welfora-document-checks', {});
      setStoredJson('welfora-application-notes', {});

      set({
        saved: [],
        applied: [],
        applicationStatuses: {},
        documentChecks: {},
        applicationNotes: {},
      });
    } else {
      setStoredJson('welfora-eligibility-profile', defaultEligibility);
      setStoredJson('welfora-saved', [2]);
      setStoredJson('welfora-applied', []);
      setStoredJson('welfora-application-statuses', {});
      setStoredJson('welfora-document-checks', {});
      setStoredJson('welfora-application-notes', {});
      try { localStorage.setItem('welfora-profile-name', 'Guest User'); } catch { /* Storage unavailable */ }

      set({
        profileName: 'Guest User',
        eligibility: defaultEligibility,
        saved: [2],
        applied: [],
        applicationStatuses: {},
        documentChecks: {},
        applicationNotes: {},
      });
    }
  },
}));

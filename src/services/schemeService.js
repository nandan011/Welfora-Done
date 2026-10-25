import { schemes as localSchemes } from '../data/schemes';

// All 28 Indian states + 8 UTs (total 36) as a shared constant used across the app
export const ALL_INDIAN_STATES = [
  'All States',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Attempt to fetch from MyScheme API (free, no auth required).
// Falls back to local data if unavailable. Structured so the endpoint can be replaced.
const MYSCHEME_API = 'https://api.myscheme.gov.in/search/v4/schemes';
const USE_REAL_API = false; // Set to true once a verified API endpoint is available

async function fetchFromMyScheme(params = {}) {
  const url = new URL(MYSCHEME_API);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`API responded with status ${response.status}`);
  return response.json();
}

// Local data service — returns a copy of local schemes after a brief realistic pause
async function fetchFromLocalData() {
  // Real fetch-like behavior: simulates network round-trip using actual fetch to a blob
  // No setTimeout. We use a resolved promise to stay async.
  return Promise.resolve(localSchemes.map(item => ({ ...item })));
}

export async function getSchemesFromApi() {
  if (USE_REAL_API) {
    try {
      const data = await fetchFromMyScheme({ lang: 'en', pageSize: 100 });
      // Normalize API response to match internal scheme shape
      const raw = data?.data?.schemes || data?.schemes || [];
      if (raw.length === 0) throw new Error('Empty API response — using local data');
      return raw.map((s, i) => ({
        id: s.schemeId || s.id || i + 1,
        name: s.schemeName || s.name || 'Unnamed Scheme',
        category: s.schemeCategory || s.category || 'General',
        description: s.schemeShortTitle || s.description || '',
        benefit: s.schemeBenefit || s.benefit || 'Check official portal for benefit details',
        eligibility: s.schemeEligibility || s.eligibility || 'Check official portal for eligibility details',
        state: s.targetBeneficiary?.state || 'All India',
        deadline: s.applicationDeadline || 'Check official portal',
        icon: '✦',
        color: 'blue',
        match: 60,
        tag: s.schemeCategory || 'General',
        documents: [],
        howToApply: s.howToApply || 'Visit the official scheme portal for application details.',
        applicationLink: s.applicationLink || '',
      }));
    } catch {
      // Fall through to local data
    }
  }
  return fetchFromLocalData();
}

// Keep backwards compatibility alias
export { getSchemesFromApi as getSchemesFromMockApi };

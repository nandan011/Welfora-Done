import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import SchemeCard from '../components/SchemeCard';
import Empty from '../components/Empty';
import { useWelfora } from '../context/WelforaContext';
import { ALL_INDIAN_STATES } from '../services/schemeService';

const OCCUPATION_OPTIONS = [
  'Student',
  'Employed (Government)',
  'Employed (Private)',
  'Farmer',
  'Self-employed / Business',
  'Unemployed',
  'Homemaker',
  'Retired',
  'Other',
];

const CATEGORY_OPTIONS = [
  'All',
  'Education',
  'Healthcare',
  'Agriculture',
  'Employment',
  'Housing',
  'Women & Child',
  'Senior Citizens',
  'Financial Aid',
  'Essential Services',
];

const initialForm = {
  name: '',
  age: '',
  state: '',
  occupation: '',
  income: '',
  category: 'All',
};

const initialErrors = {
  name: '',
  age: '',
  state: '',
  occupation: '',
  income: '',
};

export default function FindSchemesPage() {
  const {
    setFindProfile,
    findResults,
    findResultsReady,
    saved,
    toggleSave,
    applyScheme,
    setSelectedScheme,
    notify,
  } = useWelfora();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = { ...initialErrors };
    let valid = true;

    if (!form.name.trim()) {
      errs.name = 'Name is required.';
      valid = false;
    }

    const age = Number(form.age);
    if (!form.age || isNaN(age) || age < 1 || age > 120) {
      errs.age = 'Please enter a valid age (1–120).';
      valid = false;
    }

    if (!form.state) {
      errs.state = 'Please select your state.';
      valid = false;
    }

    if (!form.occupation) {
      errs.occupation = 'Please select your occupation.';
      valid = false;
    }

    const income = Number(form.income);
    if (form.income !== '' && (isNaN(income) || income < 0)) {
      errs.income = 'Please enter a valid annual income (or leave blank).';
      valid = false;
    }

    setErrors(errs);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const profile = {
      name: form.name.trim(),
      age: Number(form.age),
      state: form.state,
      occupation: form.occupation,
      income: form.income ? Number(form.income) : null,
      category: form.category,
    };

    setFindProfile(profile);
    setSubmitted(true);
    notify(`Finding schemes for ${profile.name}…`, 'info');

    // Scroll to results
    setTimeout(() => {
      document.getElementById('find-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function handleReset() {
    setForm(initialForm);
    setErrors(initialErrors);
    setFindProfile(null);
    setSubmitted(false);
  }

  return (
    <section className="page-content">
      <PageTitle
        eyebrow="PERSONALISED DISCOVERY"
        title="Find Schemes For Me"
        subtitle="Tell us about yourself and we'll show you government schemes that may be relevant to your profile."
      />

      <div className="find-schemes-layout">
        {/* Form Panel */}
        <div className="panel find-form-panel">
          <div className="find-form-header">
            <div className="find-form-orb">✦</div>
            <div>
              <h2>Your Profile</h2>
              <p>Fill in your details to get personalised scheme suggestions.</p>
            </div>
          </div>

          <form className="find-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className={`find-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="fs-name">Full Name <span className="req">*</span></label>
              <input
                id="fs-name"
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="find-two-col">
              {/* Age */}
              <div className={`find-field ${errors.age ? 'has-error' : ''}`}>
                <label htmlFor="fs-age">Age <span className="req">*</span></label>
                <input
                  id="fs-age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={e => update('age', e.target.value)}
                  placeholder="e.g. 22"
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
              </div>

              {/* Category */}
              <div className="find-field">
                <label htmlFor="fs-category">Category of Interest</label>
                <select
                  id="fs-category"
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* State */}
            <div className={`find-field ${errors.state ? 'has-error' : ''}`}>
              <label htmlFor="fs-state">State / UT <span className="req">*</span></label>
              <select
                id="fs-state"
                value={form.state}
                onChange={e => update('state', e.target.value)}
              >
                <option value="">Select your state…</option>
                {ALL_INDIAN_STATES.filter(s => s !== 'All States').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <span className="field-error">{errors.state}</span>}
            </div>

            {/* Occupation */}
            <div className={`find-field ${errors.occupation ? 'has-error' : ''}`}>
              <label htmlFor="fs-occupation">Occupation <span className="req">*</span></label>
              <select
                id="fs-occupation"
                value={form.occupation}
                onChange={e => update('occupation', e.target.value)}
              >
                <option value="">Select your occupation…</option>
                {OCCUPATION_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.occupation && <span className="field-error">{errors.occupation}</span>}
            </div>

            {/* Annual Income */}
            <div className={`find-field ${errors.income ? 'has-error' : ''}`}>
              <label htmlFor="fs-income">Annual Household Income (₹) <span className="optional">optional</span></label>
              <input
                id="fs-income"
                type="number"
                min="0"
                value={form.income}
                onChange={e => update('income', e.target.value)}
                placeholder="e.g. 250000"
              />
              {errors.income && <span className="field-error">{errors.income}</span>}
              <small className="field-hint">Used to filter income-specific schemes. Leave blank to see all.</small>
            </div>

            <div className="find-form-actions">
              <button type="submit" className="primary-btn find-submit-btn">
                Find Schemes For Me <span>→</span>
              </button>
              {submitted && (
                <button type="button" className="outline-btn" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </form>

          <p className="disclaimer">
            ⓘ Results are indicative suggestions based on your profile — not official eligibility decisions.
            Always verify requirements on the official scheme portal before applying.
          </p>
        </div>

        {/* Results Panel */}
        {findResultsReady && (
          <div className="find-results-panel" id="find-results">
            <div className="find-results-header">
              <div>
                <h2>Recommended Schemes For You</h2>
                <p>
                  Based on your profile — {form.name || 'Citizen'}, {form.age} years, {form.state}, {form.occupation}.
                </p>
              </div>
              <span className="result-badge">{findResults?.length || 0} schemes</span>
            </div>

            <div className="find-eligibility-note">
              <span>ℹ️</span>
              <span>
                These schemes <strong>may be relevant</strong> to your profile. Use "Check My Eligibility" or review the scheme details and confirm on official portals.
              </span>
            </div>

            {findResults && findResults.length > 0 ? (
              <div className="scheme-grid">
                {findResults.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    saved={saved.includes(scheme.id)}
                    onSave={() => toggleSave(scheme.id)}
                    onOpen={() => setSelectedScheme(scheme)}
                    onApply={() => applyScheme(scheme.id)}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="No schemes matched your profile"
                text="Try selecting 'All' for category, or explore all available schemes."
                action="Explore all schemes"
                onAction={() => {}}
              />
            )}
          </div>
        )}

        {!findResultsReady && (
          <div className="find-placeholder-panel">
            <div className="find-placeholder-inner">
              <div className="find-placeholder-orb">🔍</div>
              <h3>Your results will appear here</h3>
              <p>Fill in your profile on the left and click "Find Schemes For Me" to see personalised suggestions.</p>
              <ul className="find-placeholder-list">
                <li>✓ Filtered by your state</li>
                <li>✓ Matched to your occupation</li>
                <li>✓ Sorted by relevance score</li>
                <li>✓ Covers Education, Health, Agriculture and more</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

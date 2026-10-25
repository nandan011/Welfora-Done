import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import SchemeCard from '../components/SchemeCard';
import Empty from '../components/Empty';
import { useWelfora } from '../context/WelforaContext';
import { ALL_INDIAN_STATES } from '../services/schemeService';
// Reusable form inputs and validation hook (Syllabus: Form handling in React)
import { TextInput, SelectInput, NumberInput } from '../components/form';
import { useForm } from '../hooks/useForm';

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

// Declarative validation schema
function validateProfileForm(form) {
  const errs = {};
  if (!form.name?.trim()) {
    errs.name = 'Name is required.';
  }
  const age = Number(form.age);
  if (!form.age || isNaN(age) || age < 1 || age > 120) {
    errs.age = 'Please enter a valid age (1–120).';
  }
  if (!form.state) {
    errs.state = 'Please select your state.';
  }
  if (!form.occupation) {
    errs.occupation = 'Please select your occupation.';
  }
  const income = Number(form.income);
  if (form.income !== '' && form.income !== undefined && (isNaN(income) || income < 0)) {
    errs.income = 'Please enter a valid annual income (or leave blank).';
  }
  return errs;
}

export default function FindSchemesPage() {
  const {
    findProfile,
    setFindProfile,
    findResults,
    findResultsReady,
    saved,
    toggleSave,
    applyScheme,
    setSelectedScheme,
    notify,
  } = useWelfora();

  const [submitted, setSubmitted] = useState(false);

  // useForm: Standardized form handling with validation strategy
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm(initialForm, validateProfileForm);

  function onValidSubmit(formValues) {
    const profile = {
      name: formValues.name.trim(),
      age: Number(formValues.age),
      state: formValues.state,
      occupation: formValues.occupation,
      income: formValues.income ? Number(formValues.income) : null,
      category: formValues.category,
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
    resetForm(initialForm);
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

          <form className="find-form" onSubmit={handleSubmit(onValidSubmit)} noValidate>
            {/* Full Name Reusable Component */}
            <TextInput
              label="Full Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            <div className="find-two-col">
              {/* Age Reusable Component */}
              <NumberInput
                label="Age"
                name="age"
                min={1}
                max={120}
                value={values.age}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.age && errors.age}
                placeholder="e.g. 22"
                required
              />

              {/* Category Reusable Component */}
              <SelectInput
                label="Category of Interest"
                name="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                options={CATEGORY_OPTIONS}
              />
            </div>

            {/* State Reusable Component */}
            <SelectInput
              label="State / UT"
              name="state"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              options={ALL_INDIAN_STATES.filter(s => s !== 'All States')}
              error={touched.state && errors.state}
              placeholder="Select your state…"
              required
            />

            {/* Occupation Reusable Component */}
            <SelectInput
              label="Occupation"
              name="occupation"
              value={values.occupation}
              onChange={handleChange}
              onBlur={handleBlur}
              options={OCCUPATION_OPTIONS}
              error={touched.occupation && errors.occupation}
              placeholder="Select your occupation…"
              required
            />

            {/* Annual Income Reusable Component */}
            <NumberInput
              label="Annual Household Income"
              name="income"
              prefix="₹"
              min={0}
              value={values.income}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.income && errors.income}
              placeholder="e.g. 250000"
              helperText="Optional: used to filter income-capped schemes. Leave blank to see all."
            />

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
                  Based on your profile — {findProfile?.name || values.name || 'Citizen'}, {findProfile?.age || values.age} years, {findProfile?.state || values.state}, {findProfile?.occupation || values.occupation}.
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

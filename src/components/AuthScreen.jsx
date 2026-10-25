import { useState } from 'react';
import './AuthScreen.css';
import { InputField, PasswordField, SelectField } from './forms';
import {
    required,
    isEmail,
    minLength,
    isStrongPassword,
    isAgeValid,
    matches,
} from '../utils/validators';

const interestsList = [
    'Scholarships & Education',
    'Healthcare',
    'Employment & Skill Development',
    'Agriculture',
    'Housing',
    'Pension & Senior Citizen Benefits',
    'Business & Self-employment',
    'General Financial Assistance',
];

const statesList = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
    'Puducherry',
];

const occupationsList = [
    'Student',
    'Employed',
    'Farmer',
    'Self-employed/business',
    'Unemployed',
    'Other',
];

const incomeList = [
    'Below ₹1 lakh',
    '₹1–2.5 lakh',
    '₹2.5–5 lakh',
    '₹5–10 lakh',
    'Above ₹10 lakh',
    'Prefer not to say',
];

const educationList = [
    'School',
    'Undergraduate',
    'Postgraduate',
    'PhD / Research',
    'Other',
];

const initialForm = {
    name: '',
    age: '',
    state: 'Punjab',
    occupation: 'Student',
    education: 'Undergraduate',
    income: 'Below ₹1 lakh',
    interests: ['Scholarships & Education'],
    email: '',
    password: '',
    confirmPassword: '',
};

function validateForm(data, currentMode) {
    const errs = {};
    if (currentMode === 'signup') {
        const nameErr = required(data.name, 'Full name') || minLength(data.name, 2, 'Full name');
        if (nameErr) errs.name = nameErr;

        const ageErr = isAgeValid(data.age);
        if (ageErr) errs.age = ageErr;

        const stateErr = required(data.state, 'State');
        if (stateErr) errs.state = stateErr;

        if (!data.interests || data.interests.length === 0) {
            errs.interests = 'Choose at least one benefit area.';
        }

        const emailErr = required(data.email, 'Email address') || isEmail(data.email);
        if (emailErr) errs.email = emailErr;

        const passErr = required(data.password, 'Password') || isStrongPassword(data.password);
        if (passErr) errs.password = passErr;

        const confirmErr = required(data.confirmPassword, 'Confirm password') || matches(data.confirmPassword, data.password, 'Passwords do not match.');
        if (confirmErr) errs.confirmPassword = confirmErr;
    } else {
        const emailErr = required(data.email, 'Email address') || isEmail(data.email);
        if (emailErr) errs.email = emailErr;

        const passErr = required(data.password, 'Password');
        if (passErr) errs.password = passErr;
    }
    return errs;
}

export default function AuthScreen({ onComplete }) {
    const [mode, setMode] = useState('signup');
    // Controlled component: React state drives all input field values
    const [form, setForm] = useState(initialForm);
    const [accountError, setAccountError] = useState('');
    // Validation strategy: field-level touch tracking and error evaluation
    const [touched, setTouched] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const errors = validateForm(form, mode);

    const switchMode = (newMode) => {
        setMode(newMode);
        setAccountError('');
        setTouched({});
        setSubmitAttempted(false);
        setIsSubmitting(false);
    };

    const update = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setAccountError('');
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field) => {
        return (touched[field] || submitAttempted) ? (errors[field] || '') : '';
    };

    const toggleInterest = interest => {
        setForm(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(item => item !== interest)
                : [...prev.interests, interest],
        }));
        handleBlur('interests');
    };

    function submit(event) {
        event.preventDefault();
        setSubmitAttempted(true);
        setAccountError('');
        setIsSubmitting(true);

        const allTouched = Object.keys(form).reduce((acc, k) => {
            acc[k] = true;
            return acc;
        }, {});
        allTouched.interests = true;
        setTouched(allTouched);

        const currentErrors = validateForm(form, mode);
        if (Object.keys(currentErrors).length > 0) {
            setIsSubmitting(false);
            const firstErrorKey = Object.keys(currentErrors)[0];
            const el = document.getElementById(`field-${firstErrorKey}`) ||
                       document.querySelector(`[name="${firstErrorKey}"]`) ||
                       (firstErrorKey === 'interests' ? document.querySelector('.interest-option input') : null);
            if (el && typeof el.focus === 'function') {
                el.focus();
            }
            return;
        }

        if (mode === 'signup') {
            const account = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                profile: {
                    age: String(form.age),
                    state: form.state,
                    occupation: form.occupation,
                    income: form.income,
                    education: form.occupation === 'Student' ? form.education : '',
                    interests: form.interests,
                },
            };

            // Prototype only: localStorage is not secure account storage.
            let accounts = {};
            try {
                accounts = JSON.parse(
                    localStorage.getItem('welfora-demo-accounts') || '{}'
                );
            } catch (err) {
                console.warn('Failed to parse accounts from localStorage:', err);
            }

            if (accounts[account.email]) {
                setAccountError('An account with this email already exists. Try logging in.');
                setIsSubmitting(false);
                return;
            }

            accounts[account.email] = account;
            try {
                localStorage.setItem('welfora-demo-accounts', JSON.stringify(accounts));
            } catch (err) {
                console.warn('Failed to save account to localStorage:', err);
            }

            setIsSubmitting(false);
            onComplete({
                name: account.name,
                email: account.email,
                profile: account.profile,
            });
            return;
        }

        let accounts = {};
        try {
            accounts = JSON.parse(
                localStorage.getItem('welfora-demo-accounts') || '{}'
            );
        } catch (err) {
            console.warn('Failed to parse accounts from localStorage:', err);
        }
        const account = accounts[form.email.trim().toLowerCase()];

        if (!account || account.password !== form.password) {
            setAccountError('Account not found or password incorrect. Try signing up first.');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        onComplete({
            name: account.name,
            email: account.email,
            profile: account.profile,
        });
    }

    return (
        <div className="auth-page">
            <section className="auth-visual">
                <div className="auth-brand">
                    <span className="auth-logo">W</span>
                    <span>WELFORA</span>
                </div>

                <div className="auth-hero">
                    <span className="auth-eyebrow">YOUR BENEFITS. YOUR FUTURE.</span>
                    <h1>
                        Support that's
                        <br />
                        <span>meant for you.</span>
                    </h1>
                    <p>
                        Discover government schemes, scholarships and public benefits
                        relevant to your life — all in one place.
                    </p>

                    <div className="auth-feature">
                        <span>✨</span>
                        <div>
                            <b>Personalized Discovery</b>
                            <small>Recommendations based on your age, state, and occupation</small>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <span>📋</span>
                        <div>
                            <b>Plain-Language Summaries</b>
                            <small>Understand eligibility and requirements without jargon</small>
                        </div>
                    </div>

                    <div className="auth-feature">
                        <span>🔒</span>
                        <div>
                            <b>Privacy-First & Secure</b>
                            <small>Your profile data stays safely on your local device</small>
                        </div>
                    </div>
                </div>

                <div className="auth-visual-footer">
                    WELFORA © 2026 · Citizen Welfare Platform
                </div>
            </section>

            <section className="auth-form-side">
                <div className="auth-form-wrap">
                    <div className="auth-mobile-brand">
                        <span className="auth-logo">W</span> WELFORA
                    </div>

                    <div className="auth-heading">
                        <span className="auth-eyebrow">
                            {mode === 'signup' ? 'GET STARTED' : 'WELCOME BACK'}
                        </span>
                        <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
                        <p>
                            {mode === 'signup'
                                ? 'Tell us a little about yourself to discover relevant benefits.'
                                : 'Log in to continue to your personalized dashboard.'}
                        </p>
                    </div>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={mode === 'signup' ? 'selected' : ''}
                            onClick={() => switchMode('signup')}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className={mode === 'login' ? 'selected' : ''}
                            onClick={() => switchMode('login')}
                        >
                            Log In
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={submit} noValidate>
                        {mode === 'signup' && (
                            <>
                                <InputField
                                    label="Full name"
                                    name="name"
                                    value={form.name}
                                    onChange={e => update('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    error={getFieldError('name')}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />

                                <div className="auth-two-col">
                                    <InputField
                                        label="Age"
                                        name="age"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={form.age}
                                        onChange={e => update('age', e.target.value)}
                                        onBlur={() => handleBlur('age')}
                                        error={getFieldError('age')}
                                        placeholder="Your age"
                                        required
                                    />

                                    <SelectField
                                        label="State / UT"
                                        name="state"
                                        value={form.state}
                                        onChange={e => update('state', e.target.value)}
                                        onBlur={() => handleBlur('state')}
                                        error={getFieldError('state')}
                                        options={statesList}
                                    />
                                </div>

                                <div className="auth-two-col">
                                    <SelectField
                                        label="Occupation"
                                        name="occupation"
                                        value={form.occupation}
                                        onChange={e => update('occupation', e.target.value)}
                                        onBlur={() => handleBlur('occupation')}
                                        options={occupationsList}
                                    />

                                    <SelectField
                                        label="Annual household income"
                                        name="income"
                                        value={form.income}
                                        onChange={e => update('income', e.target.value)}
                                        onBlur={() => handleBlur('income')}
                                        options={incomeList}
                                    />
                                </div>

                                {form.occupation === 'Student' && (
                                    <SelectField
                                        label="Education level"
                                        name="education"
                                        value={form.education}
                                        onChange={e => update('education', e.target.value)}
                                        onBlur={() => handleBlur('education')}
                                        options={educationList}
                                    />
                                )}

                                <fieldset className="auth-interests">
                                    <legend>What benefits interest you?</legend>
                                    <p>Select all that apply.</p>
                                    <div className="interest-grid">
                                        {interestsList.map(interest => (
                                            <label
                                                key={interest}
                                                className={`interest-option ${form.interests.includes(interest) ? 'checked' : ''
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.interests.includes(interest)}
                                                    onChange={() => toggleInterest(interest)}
                                                />
                                                <span>{interest}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('interests') && (
                                        <span className="field-error" role="alert" style={{ marginTop: '6px' }}>
                                            {getFieldError('interests')}
                                        </span>
                                    )}
                                </fieldset>
                            </>
                        )}

                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={e => update('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            error={getFieldError('email')}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />

                        <PasswordField
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={e => update('password', e.target.value)}
                            onBlur={() => handleBlur('password')}
                            error={getFieldError('password')}
                            placeholder="Enter your password"
                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                            hint={mode === 'signup' ? 'At least 8 characters with letters & numbers' : undefined}
                            required
                        />

                        {mode === 'signup' && (
                            <PasswordField
                                label="Confirm password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={e => update('confirmPassword', e.target.value)}
                                onBlur={() => handleBlur('confirmPassword')}
                                error={getFieldError('confirmPassword')}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                            />
                        )}

                        {accountError && <p className="auth-error" role="alert">{accountError}</p>}

                        <button className="auth-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Please wait...' : (mode === 'signup' ? 'Create account' : 'Log in')}
                            {!isSubmitting && <span>→</span>}
                        </button>
                    </form>

                    <p className="auth-disclaimer">
                        Your profile helps Welfora suggest potentially relevant schemes.
                        Eligibility is indicative; always verify requirements on official portals.
                    </p>
                </div>
            </section>
        </div>
    );
}
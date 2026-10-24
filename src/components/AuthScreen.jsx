import { useState } from 'react';
import './AuthScreen.css';

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
};

export default function AuthScreen({ onComplete }) {
    const [mode, setMode] = useState('signup');
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');

    const update = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const toggleInterest = interest => {
        setForm(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(item => item !== interest)
                : [...prev.interests, interest],
        }));
    };

    function submit(event) {
        event.preventDefault();
        setError('');

        if (!form.email.trim() || !form.password.trim()) {
            setError('Enter your email and password.');
            return;
        }

        if (mode === 'signup') {
            if (!form.name.trim() || !form.age || !form.state) {
                setError('Please complete your name, age and state.');
                return;
            }

            if (Number(form.age) < 1 || Number(form.age) > 120) {
                setError('Enter a valid age.');
                return;
            }

            if (form.interests.length === 0) {
                setError('Choose at least one benefit area.');
                return;
            }

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
            const accounts = JSON.parse(
                localStorage.getItem('welfora-demo-accounts') || '{}'
            );

            if (accounts[account.email]) {
                setError('An account with this email already exists. Try logging in.');
                return;
            }

            accounts[account.email] = account;
            localStorage.setItem('welfora-demo-accounts', JSON.stringify(accounts));

            onComplete({
                name: account.name,
                email: account.email,
                profile: account.profile,
            });
            return;
        }

        const accounts = JSON.parse(
            localStorage.getItem('welfora-demo-accounts') || '{}'
        );
        const account = accounts[form.email.trim().toLowerCase()];

        if (!account || account.password !== form.password) {
            setError('Account not found or password incorrect. Try signing up first.');
            return;
        }

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
                            onClick={() => {
                                setMode('signup');
                                setError('');
                            }}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className={mode === 'login' ? 'selected' : ''}
                            onClick={() => {
                                setMode('login');
                                setError('');
                            }}
                        >
                            Log In
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={submit}>
                        {mode === 'signup' && (
                            <>
                                <label>
                                    Full name
                                    <input
                                        value={form.name}
                                        onChange={e => update('name', e.target.value)}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                    />
                                </label>

                                <div className="auth-two-col">
                                    <label>
                                        Age
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={form.age}
                                            onChange={e => update('age', e.target.value)}
                                            placeholder="Your age"
                                            required
                                        />
                                    </label>

                                    <label>
                                        State / UT
                                        <select
                                            value={form.state}
                                            onChange={e => update('state', e.target.value)}
                                        >
                                            {[
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
                                            ].map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="auth-two-col">
                                    <label>
                                        Occupation
                                        <select
                                            value={form.occupation}
                                            onChange={e => update('occupation', e.target.value)}
                                        >
                                            {[
                                                'Student',
                                                'Employed',
                                                'Farmer',
                                                'Self-employed/business',
                                                'Unemployed',
                                                'Other',
                                            ].map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label>
                                        Annual household income
                                        <select
                                            value={form.income}
                                            onChange={e => update('income', e.target.value)}
                                        >
                                            {[
                                                'Below ₹1 lakh',
                                                '₹1–2.5 lakh',
                                                '₹2.5–5 lakh',
                                                '₹5–10 lakh',
                                                'Above ₹10 lakh',
                                                'Prefer not to say',
                                            ].map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {form.occupation === 'Student' && (
                                    <label>
                                        Education level
                                        <select
                                            value={form.education}
                                            onChange={e => update('education', e.target.value)}
                                        >
                                            {[
                                                'School',
                                                'Undergraduate',
                                                'Postgraduate',
                                                'PhD / Research',
                                                'Other',
                                            ].map(item => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </label>
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
                                </fieldset>
                            </>
                        )}

                        <label>
                            Email address
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => update('email', e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => update('password', e.target.value)}
                                placeholder="Enter your password"
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                required
                            />
                        </label>

                        {error && <p className="auth-error" role="alert">{error}</p>}

                        <button className="auth-submit" type="submit">
                            {mode === 'signup' ? 'Create account' : 'Log in'}
                            <span>→</span>
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
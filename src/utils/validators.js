// validators.js: Pure validation functions for form handling
// Syllabus Topic: Form validation strategies in React

/**
 * Validates that a value is non-empty.
 * @param {*} value - The input value
 * @param {string} [label] - Optional field label for descriptive error messaging
 * @returns {string} Error message or empty string
 */
export function required(value, label = 'This field') {
    if (value === undefined || value === null) {
        return `${label} is required.`;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return `${label} is required.`;
    }
    if (Array.isArray(value) && value.length === 0) {
        return `Please select at least one ${label.toLowerCase()}.`;
    }
    return '';
}

/**
 * Validates that a value is a valid email address format.
 * @param {string} value
 * @returns {string} Error message or empty string
 */
export function isEmail(value) {
    if (!value || typeof value !== 'string') {
        return 'Please enter a valid email address.';
    }
    const trimmed = value.trim();
    // Standard RFC-compliant email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
        return 'Please enter a valid email address (e.g. user@example.com).';
    }
    return '';
}

/**
 * Validates that a string satisfies a minimum length.
 * @param {string} value
 * @param {number} n - Minimum character length
 * @param {string} [label] - Optional field label
 * @returns {string} Error message or empty string
 */
export function minLength(value, n, label = 'Field') {
    if (!value || typeof value !== 'string' || value.trim().length < n) {
        return `${label} must be at least ${n} characters.`;
    }
    return '';
}

/**
 * Validates strong password rules: minimum 8 characters, at least 1 letter and 1 number.
 * @param {string} value
 * @returns {string} Error message or empty string
 */
export function isStrongPassword(value) {
    if (!value || typeof value !== 'string' || value.length < 8) {
        return 'Password must be at least 8 characters long.';
    }
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasLetter || !hasNumber) {
        return 'Password must contain at least one letter and one number.';
    }
    return '';
}

/**
 * Validates that an age value is an integer between 1 and 120.
 * @param {string|number} value
 * @returns {string} Error message or empty string
 */
export function isAgeValid(value) {
    if (value === undefined || value === null || String(value).trim() === '') {
        return 'Age is required.';
    }
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1 || num > 120) {
        return 'Age must be a whole number between 1 and 120.';
    }
    return '';
}

/**
 * Validates that two values match (e.g. password and confirm password).
 * @param {*} a
 * @param {*} b
 * @param {string} [message] - Custom error message
 * @returns {string} Error message or empty string
 */
export function matches(a, b, message = 'Fields do not match.') {
    if (a !== b) {
        return message;
    }
    return '';
}

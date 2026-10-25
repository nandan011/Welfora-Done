// Reusable component: Standardized accessible input component with label, error alert, and ARIA attributes
// Syllabus Topic: Reusable input components in React

export default function InputField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    hint,
    required,
    placeholder,
    autoComplete,
    id,
    className = '',
    children,
    ...rest
}) {
    const inputId = id || (name ? `field-${name}` : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const hintId = hint && inputId ? `${inputId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`form-field ${error ? 'has-error' : ''} ${className}`.trim()}>
            {label && (
                <label htmlFor={inputId}>
                    {label}
                    {required && <span className="required-star" aria-hidden="true"> *</span>}
                </label>
            )}

            <div className="input-wrap">
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={error ? 'input-invalid' : ''}
                    {...rest}
                />
                {children}
            </div>

            {hint && !error && (
                <small id={hintId} className="field-hint">
                    {hint}
                </small>
            )}

            {error && (
                <span id={errorId} className="field-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

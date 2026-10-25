// SelectField: Accessible, reusable dropdown select component
// Syllabus Topic: Reusable input components in React

export default function SelectField({
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    error,
    hint,
    required,
    id,
    className = '',
    ...rest
}) {
    const selectId = id || (name ? `field-${name}` : undefined);
    const errorId = error && selectId ? `${selectId}-error` : undefined;
    const hintId = hint && selectId ? `${selectId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`form-field ${error ? 'has-error' : ''} ${className}`.trim()}>
            {label && (
                <label htmlFor={selectId}>
                    {label}
                    {required && <span className="required-star" aria-hidden="true"> *</span>}
                </label>
            )}

            <div className="select-wrap">
                <select
                    id={selectId}
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={error ? 'input-invalid' : ''}
                    {...rest}
                >
                    {options.map((option) => {
                        if (typeof option === 'object' && option !== null) {
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label ?? option.value}
                                </option>
                            );
                        }
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
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

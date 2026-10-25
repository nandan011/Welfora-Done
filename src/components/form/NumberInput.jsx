// NumberInput: Controlled numeric input with range validation and prefix/suffix adornments
// Syllabus Topic: Reusable input components in React
import { forwardRef } from 'react';

const NumberInput = forwardRef(function NumberInput(
  {
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    min,
    max,
    step = 1,
    prefix,
    suffix,
    placeholder,
    required = false,
    disabled = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || `num-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={`form-field-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-star" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="input-control-wrapper input-with-adornment">
        {prefix && <span className="input-adornment-prefix">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={`form-input ${error ? 'input-invalid' : ''}`}
          {...props}
        />
        {suffix && <span className="input-adornment-suffix">{suffix}</span>}
      </div>

      {helperText && !error && (
        <small id={helperId} className="form-helper-text">
          {helperText}
        </small>
      )}

      {error && (
        <span id={errorId} className="form-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default NumberInput;

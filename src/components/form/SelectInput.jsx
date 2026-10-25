// SelectInput: Accessible dropdown component with validation error messaging
// Syllabus Topic: Reusable input components in React
import { forwardRef } from 'react';

const SelectInput = forwardRef(function SelectInput(
  {
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    error,
    helperText,
    placeholder,
    required = false,
    disabled = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || `select-${name}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  return (
    <div className={`form-field-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="required-star" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="select-control-wrapper">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={`form-select ${error ? 'input-invalid' : ''}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
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

export default SelectInput;

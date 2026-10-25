// useForm: Custom hook for standardized React form state & validation strategies
// Syllabus Topic: Form handling in React - Validation strategies
import { useState, useCallback } from 'react';

/**
 * useForm handles controlled input state, touch tracking, and validation rules.
 * @param {Object} initialValues - initial form values
 * @param {Function} validate - validation function returning an errors object { [field]: 'Error message' }
 */
export function useForm(initialValues = {}, validate = () => ({})) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Controlled change handler supporting standard input events or direct value updates
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => {
      const nextValues = { ...prev, [name]: fieldValue };
      // Real-time validation if field was previously touched
      if (touched[name]) {
        const validationErrors = validate(nextValues);
        setErrors(validationErrors);
      }
      return nextValues;
    });
  }, [touched, validate]);

  // Blur handler triggers validation when user leaves the field
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, validate]);

  // Programmatic setter for custom inputs or selects
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => {
      const nextValues = { ...prev, [name]: value };
      if (touched[name]) {
        const validationErrors = validate(nextValues);
        setErrors(validationErrors);
      }
      return nextValues;
    });
  }, [touched, validate]);

  // Form submission handler: marks all fields touched and prevents submission if invalid
  const handleSubmit = useCallback((onValidSubmit) => {
    return (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all fields touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      const validationErrors = validate(values);
      setErrors(validationErrors);

      const hasErrors = Object.keys(validationErrors).some(k => Boolean(validationErrors[k]));
      if (!hasErrors && onValidSubmit) {
        onValidSubmit(values);
      }
    };
  }, [values, validate]);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0 || !Object.keys(errors).some(k => Boolean(errors[k]));

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
    isValid,
  };
}

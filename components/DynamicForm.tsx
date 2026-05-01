'use client';

import { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: string) => string | null;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
}

const defaultValidations: Record<string, (value: string) => string | null> = {
  email: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email format';
  },
  password: (value: string) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },
};

export default function DynamicForm({ fields, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    const customValidation = field.validation || defaultValidations[field.type];
    if (customValidation) {
      return customValidation(value);
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(formData);
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
      );
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(
      fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="dynamic-form">
      {fields.map((field) => (
        <div key={field.name} className="mb-6">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-2"
            data-testid={`label-${field.name}`}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              rows={4}
              data-testid={`input-${field.name}`}
              aria-invalid={!!errors[field.name]}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              data-testid={`input-${field.name}`}
              aria-invalid={!!errors[field.name]}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              data-testid={`input-${field.name}`}
              aria-invalid={!!errors[field.name]}
            />
          )}

          {errors[field.name] && (
            <p
              className="text-red-500 text-sm mt-2"
              role="alert"
              data-testid={`error-${field.name}`}
            >
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {isSubmitted && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
          role="status"
          data-testid="success-message"
        >
          Form submitted successfully!
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          data-testid="submit-btn"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          data-testid="reset-btn"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

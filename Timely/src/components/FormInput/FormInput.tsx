import type { ReactNode } from 'react';
import './FormInput.css';

type FormInputProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  required?: boolean;
};

export default function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
}: FormInputProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      <div className="input-wrapper">
        {icon && icon}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}

import React from 'react';
import './textinput.css';

interface TextInputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const TextInput: React.FC<TextInputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  size = 'medium',
}) => {
  return (
    <input
      type={type}
      className={`text-input ${size}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

export default TextInput;

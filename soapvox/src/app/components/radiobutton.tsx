import React from 'react';
import './radiobutton.css';

interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label: string;
  size?: 'small' | 'medium' | 'large';
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  disabled = false,
  label,
  size = 'medium',
}) => {
  return (
    <label className={`radio-button ${size}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="radio-button-label">{label}</span>
    </label>
  );
};

export default RadioButton;

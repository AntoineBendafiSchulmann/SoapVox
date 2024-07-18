import React from 'react';
import './checkbox.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  size = 'medium',
}) => {
  return (
    <label className={`checkbox ${size}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;

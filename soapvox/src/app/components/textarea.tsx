import React from 'react';
import './textarea.css'; 

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  size?: 'small' | 'medium' | 'large';
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder = '',
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  rows = 4,
  cols = 50,
  size = 'medium',
}) => {
  return (
    <textarea
      className={`text-area ${size}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      rows={rows}
      cols={cols}
    />
  );
};

export default TextArea;

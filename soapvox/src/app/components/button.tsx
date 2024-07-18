import React from 'react';
import './button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  text,
  onClick = () => {},
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  return (
    <button
      type={type}
      className={`button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;

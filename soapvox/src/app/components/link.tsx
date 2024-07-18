import React from 'react';
import './link.css';

interface LinkProps {
  href: string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  disabled?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  size?: 'small' | 'medium' | 'large';
}

const Link: React.FC<LinkProps> = ({
  href,
  text,
  onClick = () => {},
  disabled = false,
  target = '_self',
  size = 'medium',
}) => {
  return (
    <a
      href={disabled ? undefined : href}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      target={target}
      className={`link ${size} ${disabled ? 'disabled' : ''}`}
    >
      {text}
    </a>
  );
};

export default Link;

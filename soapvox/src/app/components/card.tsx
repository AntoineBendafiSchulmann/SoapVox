import React from 'react';
import './card.css';

interface CardProps {
  title: string;
  content: string;
  actions?: React.ReactNode;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ title, content, actions, disabled = false }) => {
  return (
    <div className={`card ${disabled ? 'disabled' : ''}`}>
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-content">
        <p>{content}</p>
      </div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
};

export default Card;

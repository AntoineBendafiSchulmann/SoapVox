import React from 'react';
import './breadcrumb.css';

interface BreadcrumbItem {
  label: string;
  href: string;
  disabled?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: BreadcrumbItem) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onItemClick = () => {},
}) => {
  return (
    <nav className="breadcrumb">
      <ul className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className={`breadcrumb-item ${item.disabled ? 'disabled' : ''}`}>
            {index > 0 && <span className="breadcrumb-separator">/</span>}
            <a
              href={item.disabled ? undefined : item.href}
              onClick={(e) => item.disabled ? e.preventDefault() : onItemClick(e, item)}
              className={`breadcrumb-link ${item.disabled ? 'disabled' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;

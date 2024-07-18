import React from 'react';
import './Navbar.css'; // Assurez-vous de créer un fichier CSS pour le style de la barre de navigation

interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
}

interface NavbarProps {
  items: NavItem[];
  onItemClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: NavItem) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  items,
  onItemClick = () => {},
}) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {items.map((item, index) => (
          <li key={index} className={`navbar-item ${item.disabled ? 'disabled' : ''}`}>
            <a
              href={item.disabled ? undefined : item.href}
              onClick={(e) => item.disabled ? e.preventDefault() : onItemClick(e, item)}
              className="navbar-link"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

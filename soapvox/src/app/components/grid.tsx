import React from 'react';
import './grid.css';

interface GridProps {
  columns: number;
  gap?: string;
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({ columns, gap = '10px', children }) => {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap,
  };

  return <div className="grid" style={gridStyle}>{children}</div>;
};

export default Grid;

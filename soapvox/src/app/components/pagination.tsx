import React from 'react';
import './pagination.css'; 

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  disabled = false,
}) => {
  const handlePageClick = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-item ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
          disabled={disabled}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-item"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={disabled || currentPage === 1}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        className="page-item"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

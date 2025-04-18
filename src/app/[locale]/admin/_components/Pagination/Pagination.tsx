"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: Array<number | string> = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>
      
      <div className="pagination-controls">
        <div className="items-per-page">
          <span>Items per page:</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <div className="page-navigation">
          <button 
            className="page-nav-button" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button 
              key={index}
              className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="page-nav-button" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
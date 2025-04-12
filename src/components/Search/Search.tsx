import React from 'react';
import './Search.css';

interface SearchProps {
    onClose: () => void;
}
export default function Search({
    onClose,
}: SearchProps) {
  return (
    <div className="search-container">
        <div className="search-wrapper">
            <input type="text" placeholder="Search..." />
            <button className="search-close" onClick={onClose}>
                ×
            </button>
        </div>
    </div>
  );
}
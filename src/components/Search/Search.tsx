import React, { useState, useEffect, useRef } from 'react';
import './Search.css';
import { Product, ProductsSearchParams } from '@/types/products';
import productsServices from '@/services/productsServices';
import { Link } from '@/i18n/routing';
import SearchResultItem from './_components/SearchResultItem';
interface SearchProps {
    onClose: () => void;
}
export default function Search({ onClose }: SearchProps) {
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (search.trim().length > 2) {
      setLoading(true);
      
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      
      searchTimeout.current = setTimeout(async () => {
        try {
          const searchParams: ProductsSearchParams = {
            category: 'all',
            search: search,
            language: 'en', 
            page: 1,
            limit: 10
          };
          
          const data = await productsServices.getProductsByCategory(searchParams);
          if (data.products && data.products.length > 0) {
            setSearchResults(data.products);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Handle ESC key to close search
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <div className={`search-container ${isClosing ? 'closing' : ''}`}>
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={handleSearchChange}
            autoFocus
          />
          <button className="search-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        
        <div className="search-results">
          {loading && <div className="search-loading">Loading...</div>}
          
          {!loading && searchResults.length === 0 && search.trim().length > 2 && (
            <div className="search-no-results">No products found</div>
          )}
          
          {!loading && searchResults.length > 0 && (
            <>
              <div className="search-results-list">
                {searchResults.map(product => (
                    <SearchResultItem 
                    key={product._id}
                    product={product}
                    onClose={handleClose}
                    />
                ))}
                </div>
              
              <div className="view-all-results">
              <Link 
                href={search.trim().length > 2 ? `/products/all?search=${search}` : '#'} 
                onClick={(e) => {
                    if (search.trim().length <= 2) {
                    e.preventDefault();
                    return;
                    }
                    handleClose();
                }}
                className="view-all-button"
                >
                View All Results
                </Link>

              </div>
            </>
          )}
        </div>
      </div>
      <div 
        className={`search-overlay ${isClosing ? 'closing' : ''}`} 
        onClick={handleClose} 
      />
    </>
  );
}
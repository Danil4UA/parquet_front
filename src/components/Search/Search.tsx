import React, { useState, useEffect, useRef } from 'react';
import './Search.css';
import { Product, ProductsSearchParams } from '@/types/products';
import productsServices from '@/services/productsServices';
import { Link } from '@/i18n/routing';
import SearchResultItem from './_components/SearchResultItem';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface SearchProps {
  onClose: () => void;
}

export default function Search({ onClose }: SearchProps) {
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const t = useTranslations("Search")
  const pathname = usePathname();

  const lng = pathname.split("/")[1];

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
            language: lng, 
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
  }, [search, lng]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  const handleSearchFocus = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.height = "100%";
    
    const scrollY = window.scrollY;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.height = "";
      
      window.scrollTo(0, scrollY);
      
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <div className={`search-container ${isClosing ? 'closing' : ''}`}>
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder={t("placeholder")}
            value={search}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            autoFocus
          />
          <button className="search-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="search-results">
          {loading && <div className="search-loading">{t("loading")}</div>}
          
          {!loading && searchResults.length === 0 && search.trim().length > 2 && (
            <div className="search-no-results">{t("noResults")}</div>
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
                  {t("viewAllResults")}
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
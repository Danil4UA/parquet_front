"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, PenLine, Trash2 } from 'lucide-react';
import EditProductForm from './_components/EditProductForm';
import Pagination from '../_components/Pagination/Pagination';
import './products.css';
import productsServices from "@/services/productsServices";
import { Product, ProductsSearchParams } from "@/types/products";
import { usePathname, useSearchParams } from "next/navigation";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  
  const search = searchParams.get("search") || "";
  const color = searchParams.get("color") || "";
  const type = searchParams.get("type") || "";
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const apiParams: ProductsSearchParams = {
          category: 'all',
          search,
          color,
          type,
          language,
          page: currentPage,
          limit: itemsPerPage
        };
        
        const data = await productsServices.getProductsByCategory(apiParams);
        setProducts(data?.data.products || []);
        setTotalItems(data?.data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [search, color, type, language, currentPage, itemsPerPage]);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
  };
  
  const handleSaveEdit = async (updatedProduct: Product) => {
    try {
      setProducts(products.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); 
  };
  
  const localSearchTotalItems = searchTerm 
    ? filteredProducts.length 
    : totalItems;
  
  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Products Management</h1>
        <button className="add-product-button">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>
      
      <div className="products-search">
        <div className="search-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="products-table-container">
        {isLoading ? (
          <div className="loading-indicator">Loading products...</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '35%' }}>Name</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '12%' }}>Price</th>
                <th style={{ width: '10%' }}>Discount</th>
                <th style={{ width: '8%' }}>Stock</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-products">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₪{product.price}</td>
                    <td>{product.discount ? `${product.discount}%` : '-'}</td>
                    <td>{product.stock}</td>
                    <td className="action-cell">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditProduct(product)}
                        title="Edit product"
                      >
                        <PenLine size={16} />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product._id)}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <Pagination 
        totalItems={localSearchTotalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      {editingProduct && (
        <EditProductForm 
          product={editingProduct}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
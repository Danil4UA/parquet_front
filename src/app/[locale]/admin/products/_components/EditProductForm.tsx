import React, { useState } from 'react';
import { X } from 'lucide-react';
import './EditProductForm.css';
import { Product } from '@/types/products';


interface EditProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSave, onCancel }) => {
  const [editingProduct, setEditingProduct] = useState<Product>({...product});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'stock' || name === 'discount' 
        ? parseInt(value) || 0 
        : value
    });
  };
  
  const handleSaveClick = () => {
    onSave(editingProduct);
  };
  
  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Edit Product</h2>
          <button className="close-modal-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="edit-modal-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingProduct.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={editingProduct.category}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₪)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={editingProduct.price}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="discount">Discount (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={editingProduct.discount || 0}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={editingProduct.stock}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="finish">Finish</label>
              <input
                type="text"
                id="finish"
                name="finish"
                value={editingProduct.finish || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Product Images</label>
            <div className="product-images-preview">
              {editingProduct.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Product ${index + 1}`} />
                </div>
              ))}
              {editingProduct.images.length === 0 && (
                <div className="no-images">No images available</div>
              )}
            </div>
            {/* Image upload functionality would go here */}
          </div>
        </div>
        <div className="edit-modal-footer">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="save-button" onClick={handleSaveClick}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters } from '../ui/ProductsFilter/ProductsFilter';
import { Product } from '@/types/products';

export interface ProductsState {
    allProducts: Product[];
    filteredProducts: Product[];
    filters: Filters
}

const initialState: ProductsState = {
    allProducts: [],
    filteredProducts: [],
    filters:{
        color: [],
        type: [],
    }
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
        state.allProducts = action.payload;
        state.filteredProducts = action.payload;
    },
    addProducts(state, action: PayloadAction<Product[]>) {
        const uniqueNewProducts = action.payload.filter(
            newProduct => !state.allProducts.some(
                existing => existing._id === newProduct._id
            )
        );
        
        state.allProducts = [...state.allProducts, ...uniqueNewProducts];
        state.filteredProducts = [...state.filteredProducts, ...uniqueNewProducts];
    },
    setFilteredList(state, action: PayloadAction<Product[]>) {
        state.filteredProducts = action.payload;
    },
    setFilters(state, action: PayloadAction<Filters>) {
        state.filters = action.payload;
        localStorage.setItem("productFilters", JSON.stringify(action.payload));
    },
  },
});

export const { setProducts, addProducts, setFilteredList, setFilters } = productSlice.actions;
export const selectFilters = (state: { products: ProductsState }) => state.products.filters;
export const productsReducer = productSlice.reducer;
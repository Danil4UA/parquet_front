import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../ui/ProductsList/ProductsList';
import { Filters } from '../ui/ProductsFilter/ProductsFilter';

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
        material: [],
        countryOfOrigin: [],
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
    setFilteredList (state, action: PayloadAction<Product[]>) {
        state.filteredProducts = action.payload;
    },
    filterProducts(state, action: PayloadAction<Filters>) {
        const filters = action.payload;
        
        state.filteredProducts = state.allProducts.filter((product) => {
            const colorMatch = filters.color.length === 0 || filters.color.some(color => product.color.includes(color));
            const typeMatch = filters.type.length === 0 || filters.type.some(type => product.type === type);
            const materialMatch = filters.material.length === 0 || filters.material.some(material => product.material === material);
            const countryMatch = filters.countryOfOrigin.length === 0 || filters.countryOfOrigin.some(country => product.countryOfOrigin === country);
            return colorMatch && typeMatch && materialMatch && countryMatch;
        });
        state.filters = filters;
        localStorage.setItem("productFilters", JSON.stringify(filters));

    },
    setFilters(state, action: PayloadAction<Filters>) {
        state.filters = { ...state.filters, ...action.payload };
      },
  },
});

export const {setProducts, filterProducts, setFilters, setFilteredList} = productSlice.actions;
export const selectFilters = (state: { products: ProductsState }) => state.products.filters;
export const productsReducer = productSlice.reducer;

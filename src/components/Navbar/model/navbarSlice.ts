import { createSlice } from '@reduxjs/toolkit';

interface NavbarState {
  isVisible: boolean;
  isMobileFixed: boolean;
}

const initialState: NavbarState = {
  isVisible: true,
  isMobileFixed: true,
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setNavbarVisible: (state, action) => {
      state.isVisible = action.payload;
    },
    setMobileFixed: (state, action) => {
      state.isMobileFixed = action.payload;
    },
  },
});

export const { setNavbarVisible, setMobileFixed } = navbarSlice.actions;

export const selectNavbarVisible = (state: { navbar: NavbarState }) => state.navbar.isVisible;
export const selectIsMobileFixed = (state: { navbar: NavbarState }) => state.navbar.isMobileFixed;

export const navbarReducer = navbarSlice.reducer;
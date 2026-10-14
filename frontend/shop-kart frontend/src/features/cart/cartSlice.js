import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
    addToCartState: (state, action) => {
      const existing = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }
    },
    updateQuantityState: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCartState: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    }
  }
});

export const {
  setCart,
  addToCartState,
  updateQuantityState,
  removeFromCartState
} = cartSlice.actions;

export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {items:[], totalPrice:0},
    wishlist:{items:[]},
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
  },
});

export const { setProducts, setCart, setWishlist } = productSlice.actions;
export default productSlice.reducer;

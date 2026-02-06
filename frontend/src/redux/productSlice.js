import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [], 
    cart: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : []; 
    },
    setCart:(state,action)=>{
      state.cart=action.payload;
    }
  },
});

export const { setProducts,setCart } = productSlice.actions;
export default productSlice.reducer;

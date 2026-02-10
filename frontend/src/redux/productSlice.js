import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {items:[], totalPrice:0},
    wishlist:{items:[]},
    addresses:[],
    selectedAddress:null 
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

    addAddress:(state, action)=>{
      if(!state.addresses) state.addresses= [];
      state.addresses.push(action.payload)
    },
    setSelectedAddress:(state, action)=>{
            state.selectedAddress= action.payload
    },
    deleteAddress:(state, action)=>{
      state.addresses=state.addresses.filter((_, index)=>index !== action.payload)

      if(state.selectedAddress===action.payload){
        state.selectedAddress=null
      }
    }
  },
});

export const { setProducts, setCart, setWishlist,addAddress,setSelectedAddress,deleteAddress } = productSlice.actions;
export default productSlice.reducer;

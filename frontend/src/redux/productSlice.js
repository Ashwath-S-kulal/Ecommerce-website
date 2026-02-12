import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {items:[], totalPrice:0},
    wishlist:{items:[]},
    addresses:[],
    selectedAddress:null ,
    notifications: [],
    unreadCount: 0
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

     setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    markAllNotificationsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    markSingleRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
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
    },
   
  },
});

export const { setProducts, setCart, setWishlist,addAddress,setSelectedAddress,deleteAddress,setNotifications,markAllNotificationsRead,markSingleRead } = productSlice.actions;
export default productSlice.reducer;

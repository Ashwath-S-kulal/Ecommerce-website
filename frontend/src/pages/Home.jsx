import Features from '@/components/Features'
import Hero from '@/components/Hero'
import { setCart, setWishlist } from '@/redux/productSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

export default function Home() {
const dispatch = useDispatch()

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const headers = { Authorization: `Bearer ${token}` };

  const loadUserData = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        axios.get("/api/cart/", { headers }),
        axios.get("/api/wishlist/get", { headers }),
      ]);

      if (cartRes.data.success) {
        dispatch(setCart(cartRes.data.cart));
      }

      if (wishlistRes.data.success) {
        dispatch(setWishlist(wishlistRes.data.wishlist));
      }
    } catch (err) {
      console.error(
        "Failed to load user data:",
        err?.response?.data || err.message
      );
    }
  };

  loadUserData();
}, [dispatch]);


  return (
    <div>
      <Hero/>
      <Features/>
    </div>
  )
}

import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, TrafficCone } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setCart, setWishlist } from "@/redux/productSlice";

export default function Navbar() {
  const { user } = useSelector(store => store.user);
  const { cart } = useSelector(store => store.product);
  const { wishlist } = useSelector(store => store.product); // ✅ add wishlist
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch();



  const logoutHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/user/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setUser(null))
        dispatch(setCart({ items: [], totalPrice: 0 }))
        dispatch(setWishlist({ items: [] }))
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">

        {/* Logo */}
        <div>
          <Link to="/">
            <div className="flex items-center gap-2 mb-0">
              <span className="text-pink-500 text-3xl font-bold">🛒KART</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <ul className="flex gap-8 items-center text-gray-700 font-medium">
            <li>
              <Link to="/" className="hover:text-pink-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-pink-600 transition-colors"
              >
                Products
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to={`/profile/${user._id}`}
                  className="hover:text-pink-600 transition-colors"
                >
                  Hello, {user.firstName}
                </Link>
              </li>
            )}
            {admin && (
              <li>
                <Link
                  to={`/dashboard/sales`}
                  className="hover:text-pink-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-600 transition-colors" />
            <span className="bg-pink-500 rounded-full absolute text-white text-xs -top-2 -right-3 px-1.5">
              {cart?.items?.length || 0}
            </span>
          </Link>

          <Link to="/wishlist" className="relative">
            <Heart className="w-6 h-6 text-gray-700 hover:text-pink-600 transition-colors" />
            <span className="bg-pink-500 rounded-full absolute text-white text-xs -top-2 -right-3 px-1.5">
              {wishlist?.items?.length || 0}
            </span>
          </Link>
          {
            user ? <Button className="bg-pink-600 text-white cursor-pointer" onClick={logoutHandler}>Logout</Button> : <Button
              className='.bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'><Link to="/login">Login</Link></Button>
          }
        </nav>
      </div>
    </header>
  );
}

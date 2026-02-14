import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, ShoppingBag, User as UserIcon, LogOut, Home, LayoutGrid, ClipboardList, Bell, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { setCart, setNotifications, setSelectedAddress, setWishlist } from "@/redux/productSlice";

export default function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart, wishlist, unreadCount } = useSelector((store) => store.product);
  const accessToken = localStorage.getItem("accessToken");
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setCart({ items: [], totalPrice: 0 }));
        dispatch(setWishlist({ items: [] }));
        dispatch(setNotifications([]));
        dispatch(setSelectedAddress(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
      }
    } catch (error) { console.log(error); }
  };

  const navLinkStyles = ({ isActive }) =>
    `px-3 py-1.5 rounded-md transition-all ${isActive ? "bg-zinc-100 text-black" : "text-zinc-500 hover:text-black hover:bg-zinc-50"
    }`;

  const mobileTabStyles = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isActive ? "text-pink-600 translate-y-[-2px]" : "text-zinc-400"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 outline-none">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-zinc-200">
                <span className="text-white font-black text-xs">S</span>
              </div>
              <span className="font-bold tracking-tighter text-sm">SANJEEEVINI SHOP</span>
            </Link>

            <div className="h-6 w-[1px] bg-zinc-200 hidden md:block" />

            <nav className="hidden md:block">
              <ul className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight">
                <li><NavLink to="/" className={navLinkStyles}>Home</NavLink></li>
                <li><NavLink to="/products" className={navLinkStyles}>Products</NavLink></li>
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard/sales" className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md ${isActive ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"}`
                    }>Admin</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <NavLink to="/notification" className={({ isActive }) => `relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isActive ? "border-black bg-zinc-50" : "border-zinc-100 hover:bg-zinc-50"}`}>
                  <Bell size={14} className={unreadCount > 0 ? "text-blue-600" : ""} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-black">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              <NavLink to="/orders" className={({ isActive }) => `flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isActive ? "border-black bg-zinc-50" : "border-zinc-100 hover:bg-zinc-50"}`}>
                <ClipboardList size={14} />
                <span className="text-[10px] font-bold uppercase">Orders</span>
              </NavLink>

              <NavLink to="/wishlist" className={({ isActive }) => `flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isActive ? "border-black bg-zinc-50 text-pink-600" : "border-zinc-100 hover:bg-zinc-50"}`}>
                <Heart size={14} className={wishlist?.items?.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
                <span className="text-[10px] font-bold">{wishlist?.items?.length || 0}</span>
              </NavLink>

              <NavLink to="/cart" className={({ isActive }) => `flex items-center gap-2 px-3 py-1.5 rounded-full transition-all shadow-md ${isActive ? "bg-zinc-800 scale-95" : "bg-black hover:bg-zinc-800"} text-white`}>
                <ShoppingBag size={14} />
                <span className="text-[10px] font-bold">{cart?.items?.length || 0}</span>
              </NavLink>
            </div>

            {user ? (
              <div className="flex items-center gap-1 md:gap-2 ml-2">
                <NavLink to={`/profile/${user._id}`} className={({ isActive }) => `w-8 h-8 rounded-full border-2 shrink-0 transition-all ${isActive ? "border-pink-500 scale-110" : "border-transparent"}`}>
                  <img src={user.profilePic || "https://avatar.vercel.sh/user"} className="w-full h-full rounded-full object-cover" />
                </NavLink>
                <button onClick={logoutHandler} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login"><Button className="h-8 text-xs px-4 bg-black rounded-full">Log In</Button></Link>
            )}
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM DOCK --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] w-full bg-white/95 backdrop-blur-lg border-t border-zinc-200">
        <nav className="h-16 flex items-center justify-around px-2 pb-safe">

          <NavLink to="/" className={mobileTabStyles}>
            <Home size={20} />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </NavLink>

          <NavLink to="/products" className={mobileTabStyles}>
            <LayoutGrid size={20} />
            <span className="text-[10px] font-bold uppercase">Shop</span>
          </NavLink>

          {user?.role === "admin" ? (
            <NavLink to="/notification" className={mobileTabStyles}>
              <div className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase">Activity</span>
            </NavLink>
          ) : (
            <NavLink to="/orders" className={mobileTabStyles}>
              <ShoppingCart size={20} />
              <span className="text-[10px] font-bold uppercase">Orders</span>
            </NavLink>
          )}
          <NavLink to="/wishlist" className={mobileTabStyles}>
            <div className="relative">
              <Heart size={20} />
              {wishlist?.items?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-600 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {wishlist.items.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase">Wish</span>
          </NavLink>

          <NavLink to="/cart" className={mobileTabStyles}>
            <div className="relative">
              <ShoppingBag size={20} />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cart.items.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase">Cart</span>
          </NavLink>

        </nav>
      </div>
    </>
  );
}
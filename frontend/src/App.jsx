import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import SingleProducts from "./pages/SingleProducts";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import AddressForm from "./pages/AddressForm"
import OrderDetails from "./components/orderDetails"
import ScrollToTop from "./components/ScrollToTop";
import OrderSuccess from "./components/OrderSuccess";

// Admin pages
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import ShowUserOrders from "./pages/Admin/ShowUserOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails"

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Navbar /><Home /> <Footer /> </>} />
        <Route path="/signup" element={<><Navbar /><SignUp /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/profile/:userId" element={<ProtectedRoute> <Navbar /><Profile /> </ProtectedRoute>} />
        <Route path="/products" element={<><Navbar /><Products /></>} />
        <Route path="/products/:id" element={<><Navbar /><SingleProducts /></>} />
        <Route path="/cart" element={<ProtectedRoute><Navbar /><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Navbar /><Wishlist /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><Navbar/><AddressForm /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar/><OrderDetails /></ProtectedRoute>} />
        <Route path="/ordersuccess/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />


        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>}>
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users/orders/:userId" element={<ShowUserOrders />} />
          <Route path="users" element={<AdminUsers />} />
<Route path="order-details/:orderId" element={<AdminOrderDetails />} />  
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

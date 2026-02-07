import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Home from './pages/Home'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/Admin/AdminOrders'
import ShowUserOrders from './pages/Admin/ShowUserOrders'
import AdminUsers from './pages/Admin/AdminUsers'
import UserInfo from './pages/Admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProducts from './pages/SingleProducts'
import Wishlist from './pages/Wishlist'

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar /><Home /><Footer /></>
    },
    {
      path: '/signup',
      element: <><SignUp></SignUp></>
    },
    {
      path: '/login',
      element: <><Login></Login></>
    },
    {
      path: '/verify',
      element: <><Verify></Verify></>
    },
    {
      path: '/verify/:token',
      element: <><VerifyEmail></VerifyEmail></>
    },
    {
      path: '/profile/:userId',
      element: <ProtectedRoute><Navbar /><Profile /></ProtectedRoute>
    },
    {
      path: '/products',
      element: <><Navbar /><Products /></>
    },
     {
      path: '/products/:id',
      element: <><Navbar /><SingleProducts /></>
    },
    {
      path: '/cart',
      element: <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>
    },
     {
      path: '/wishlist',
      element: <ProtectedRoute><Navbar /><Wishlist /></ProtectedRoute>
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute adminOnly="true"><Navbar/><Dashboard /></ProtectedRoute>,
      children: [
        {
          path: "sales",
          element: <AdminSales />
        },
        {
          path: "add-product",
          element: <AddProduct />
        },
        {
          path: "products",
          element: <AdminProducts />
        },
        {
          path: "orders",
          element: <AdminOrders />
        },
        {
          path: "users/orders/:userId",
          element: <ShowUserOrders />
        },
        {
          path: "users",
          element: <AdminUsers />
        },
        {
          path: "users/:id",
          element: <UserInfo />
        }
      ]
    }

  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

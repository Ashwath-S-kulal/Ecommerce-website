import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  ShoppingBag, 
  LogOut, 
  PackageSearch 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-pink-600 tracking-tight">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Add Product" to="/dashboard/add-product" />
          <SidebarItem icon={<PackageSearch size={20}/>} label="All Products" to="/dashboard/products" />
          <SidebarItem icon={<Users size={20}/>} label="Users" to="/dashboard/users" />
          <SidebarItem icon={<ShoppingBag size={20}/>} label="Orders" to="/admin/orders" />
        </nav>

        <div className="p-4 mt-auto">
          <Separator className="mb-4" />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={20} /> Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

// Helper component for Sidebar Links
const SidebarItem = ({ icon, label, to }) => (
  <Link to={to}>
    <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-gray-600 hover:text-pink-600 hover:bg-pink-50">
      {icon}
      <span className="font-medium">{label}</span>
    </Button>
  </Link>
);

export default AdminLayout;
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShoppingBag,
  LogOut,
  PackageSearch,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCFD] pt-14">
      {/* --- FLOATING SIDEBAR --- */}
      <aside className="w-72 p-6 sticky top-0 h-screen flex flex-col">
        <div className="bg-white border border-slate-100 rounded-[40px] h-full flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">

          {/* Brand Identity */}
          <div className="p-8 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Control Hub</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Sanjeevini <span className="text-pink-600 font-serif italic">Admin.</span>
            </h1>
          </div>

          <Separator className="mx-8 w-auto opacity-50" />
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Our Sales"
              to="/dashboard/sales"
              active={location.pathname === "/dashboard/sales"}
            />
            <SidebarItem
              icon={<PlusCircle size={18} />}
              label="Add Product"
              to="/dashboard/add-product"
              active={location.pathname === "/dashboard/add-product"}
            />
            <SidebarItem
              icon={<PackageSearch size={18} />}
              label="All Products"
              to="/dashboard/products"
              active={location.pathname === "/dashboard/products"}
            />
            <SidebarItem
              icon={<Users size={18} />}
              label="All Users"
              to="/dashboard/users"
              active={location.pathname === "/dashboard/users"}
            />
            <SidebarItem
              icon={<ShoppingBag size={18} />}
              label="Orders"
              to="/dashboard/orders"
              active={location.pathname === "/dashboard/orders"}
            />
          </nav>

          {/* Footer Action */}
          <div className="p-6 mt-auto">
            <div className="bg-slate-50 rounded-3xl p-4 mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-xs font-black text-slate-800 truncate">Administrator</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all group"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 group-hover:rotate-12 transition-transform" size={18} />
              <span className="font-bold text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 pr-6 py-6">
        {/* TOP BAR ACTION CENTER */}
        <header className="h-20 bg-white border border-slate-100 rounded-[30px] shadow-sm mb-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400 capitalize">
              {location.pathname.split('/').pop() || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-600 rounded-full border-2 border-white" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-800 leading-none">Avarse Collective</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Admin</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white font-black shadow-lg shadow-pink-100">
                A
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto rounded-[30px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, to, active }) => (
  <Link to={to}>
    <Button
      variant="ghost"
      className={`w-full justify-between py-5 rounded-2xl transition-all duration-300 group mb-5 ${active
          ? "bg-pink-500 text-white shadow-lg shadow-pink-100 hover:bg-pink-600 hover:text-white"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-pink-600"} transition-colors`}>
          {icon}
        </span>
        <span className="font-black text-[13px] tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="opacity-50" />}
    </Button>
  </Link>
);

export default AdminLayout;
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShoppingBag,
  LogOut,
  PackageSearch,
  ArrowRight,
  ChevronLeft,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSales from './Admin/AdminSales';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();



  const navItems = [
    { label: "Products", description: "Product catalog", to: "/dashboard/products", icon: <PackageSearch size={20} />, status: "124 Items", color: "bg-blue-500" },
    { label: "Add Product", description: "New listing", to: "/dashboard/add-product", icon: <PlusCircle size={20} />, status: "Live", color: "bg-pink-500" },
    { label: "Orders", description: "Live tracking", to: "/dashboard/orders", icon: <ShoppingBag size={20} />, status: "12 New", color: "bg-orange-500" },
    { label: " Users", description: "Group members", to: "/dashboard/users", icon: <Users size={20} />, status: "52 Active", color: "bg-indigo-500" },
  ];

  const isRoot = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 mt-10">
      
      <main className="pt-12 pb-20 px-4 md:px-10 lg:px-20 max-w-[1400px] mx-auto space-y-8">
        
        {/* 1. TOP NAV CARDS (Visible on every page) */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4 mb-6">
             {!isRoot && (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
             )}
             <div>
                <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sanjeevini Command Center</p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {navItems.map((item) => (
              <div
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`group relative bg-white border rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                  location.pathname === item.to ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200/60'
                }`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center shadow-lg shadow-inherit/30 group-hover:rotate-6 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-none">{item.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">{item.description}</p>
                </div>
                <ArrowRight size={16} className={`text-slate-300 group-hover:text-indigo-500 transition-all ${location.pathname === item.to ? 'text-indigo-500 translate-x-1' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. DYNAMIC CONTENT AREA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isRoot ? (
            <div className="space-y-10">
              {/* Show Analytics only on root */}
              <div className="rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm bg-white">
                <AdminSales />
              </div>

              {/* MODERN BENTO SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/5">
                        <Sparkles size={12} /> Monthly Growth
                      </div>
                      <h2 className="text-3xl font-bold leading-tight">
                        Community impact <br /> has grown by <span className="text-indigo-400 text-4xl underline decoration-indigo-400/30 underline-offset-8">24%</span>
                      </h2>
                    </div>
                    <p className="text-slate-400 text-sm mt-8 max-w-xs font-medium">
                      Artisans in the Sanjeevini collective have shipped 1,200+ units this month.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-900">System Actions</h3>
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <LayoutDashboard size={20} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickActionButton label="Export Sales Data" sub="CSV Format" icon={<TrendingUp size={16} />} />
                    <QuickActionButton label="Artisan Directory" sub="Manage Members" icon={<Users size={16} />} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Show Sub-pages when clicking a card */
            <div className="bg-white border border-slate-200/60 rounded-xl shadow-xl shadow-slate-200/50  min-h-[60vh]">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const QuickActionButton = ({ label, sub, icon }) => (
  <button className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-900">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  </button>
);

export default AdminLayout;
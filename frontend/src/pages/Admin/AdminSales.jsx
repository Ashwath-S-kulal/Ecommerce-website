import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users, Package, ShoppingBag, IndianRupee,
  TrendingUp, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { toast } from "sonner";

export default function AdminSales() {
  const [rawOrders, setRawOrders] = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0, revenue: 0, totalOrders: 0 });
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("monthly");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    setLoading(true);
    try {
      const [userRes, productRes, orderRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/alluser`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(`${import.meta.env.VITE_BASE_URI}/api/product/getallproducts`),
        axios.get(`${import.meta.env.VITE_BASE_URI}/api/order/getallorders`, { headers: { Authorization: `Bearer ${accessToken}` } })
      ]);

      const orders = orderRes.data.orders || [];
      setRawOrders(orders);
      setStats({
        users: userRes.data.users?.length || 0,
        products: productRes.data.products?.length || 0,
        totalOrders: orders.length,
        revenue: orders.filter(order => order.status === 'Delivered').reduce((acc, o) => acc + (o.totalAmount || o.amount || 0), 0)
      });

      processAnalytics(orders, "monthly");
    } catch (err) {
      console.log(err);
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (orders, filter) => {
    setTimeframe(filter);
    const now = new Date();
    let formattedData = [];

    if (filter === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      formattedData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - i);
        return { label: days[d.getDay()], sales: 0, volume: 0, fullDate: d.toDateString() };
      }).reverse();

      orders.forEach(o => {
        const oDate = new Date(o.createdAt).toDateString();
        const match = formattedData.find(d => d.fullDate === oDate);
        if (match) {
          match.sales += o.amount || 0;
          match.volume += 1;
        }
      });
    } else if (filter === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formattedData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        return { label: months[d.getMonth()], sales: 0, volume: 0, mIdx: d.getMonth() };
      }).reverse();

      orders.forEach(o => {
        const oMonth = new Date(o.createdAt).getMonth();
        const match = formattedData.find(m => m.mIdx === oMonth);
        if (match) {
          match.sales += o.amount || 0;
          match.volume += 1;
        }
      });
    } else if (filter === "yearly") {
      const curYear = now.getFullYear();
      formattedData = [curYear - 2, curYear - 1, curYear].map(y => ({ label: y.toString(), sales: 0, volume: 0 }));

      orders.forEach(o => {
        const oYear = new Date(o.createdAt).getFullYear();
        const match = formattedData.find(y => y.label === oYear.toString());
        if (match) {
          match.sales += o.amount || 0;
          match.volume += 1;
        }
      });
    }
    setChartData(formattedData);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="h-20 bg-white rounded-xl animate-pulse border border-slate-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-slate-200" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F1F5F9] p-3 sm:p-6 lg:p-8 font-sans text-slate-900 rounded-xl overflow-hidden">
      <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter">
              Sanjeevini <span className="text-indigo-500">Overview</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Real-time DB Sync Active
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
            {['weekly', 'monthly', 'yearly'].map((t) => (
              <button
                key={t}
                onClick={() => processAnalytics(rawOrders, t)}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-1.5 sm:py-2 rounded-md text-[9px] sm:text-[10px] font-black uppercase transition-all ${
                  timeframe === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee />} color="bg-emerald-500" />
          <KpiCard title="Total Users" value={stats.users} icon={<Users />} color="bg-blue-500" />
          <KpiCard title="Order Count" value={stats.totalOrders} icon={<ShoppingBag />} color="bg-indigo-500" />
          <KpiCard title="Total Products" value={stats.products} icon={<Package />} color="bg-orange-500" />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-500" /> Revenue Growth
              </h3>
            </div>
            <div className="h-[250px] sm:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="lg:col-span-4 bg-white p-4 sm:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <BarChart3 size={14} className="text-rose-500" /> Order Volume
            </h3>
            <div className="flex-1 min-h-[200px] sm:min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                  <Bar dataKey="volume" fill="#f43f5e" radius={[4, 4, 4, 4]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-5 hover:scale-[1.01] transition-transform cursor-default">
      <div className={`shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl ${color} text-white flex items-center justify-center shadow-lg`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none truncate">{title}</p>
        <h2 className="text-lg sm:text-2xl font-black mt-1 tracking-tight truncate">{value}</h2>
      </div>
    </div>
  );
}
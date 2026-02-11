import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users, Package, ShoppingBag, IndianRupee,
  TrendingUp, BarChart3, PieChart, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line
} from 'recharts';
import { toast } from "sonner";

export default function UnifiedAdminDashboard() {
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
        axios.get("/api/user/alluser", { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get("/api/product/getallproducts"),
        axios.get("/api/order/getallorders", { headers: { Authorization: `Bearer ${accessToken}` } })
      ]);

      const orders = orderRes.data.orders || [];
      setRawOrders(orders);
      setStats({
        users: userRes.data.users?.length || 0,
        products: productRes.data.products?.length || 0,
        totalOrders: orders.length,
        revenue: orders.reduce((acc, o) => acc + (o.amount || 0), 0)
      });

      processAnalytics(orders, "monthly");
    } catch (err) {
      console.log(err)
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
          match.sales += o.amount;
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
          match.sales += o.amount;
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
          match.sales += o.amount;
          match.volume += 1;
        }
      });
    }
    setChartData(formattedData);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-[2rem] border border-slate-200 gap-4">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-32 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="h-12 w-64 bg-slate-100 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 h-[450px]">
            <div className="flex justify-between mb-8">
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="w-full h-full bg-slate-50 rounded-2xl border-b-2 border-l-2 border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 h-[450px] flex flex-col">
            <div className="h-4 w-32 bg-slate-200 rounded mb-8 animate-pulse" />
            <div className="flex-1 flex items-end gap-2 px-2">
              {[40, 70, 45, 90, 65, 80].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-100 rounded-t-lg animate-pulse"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 bg-slate-800 p-8 rounded-[2.5rem] h-[300px]">
            <div className="h-4 w-48 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="h-8 w-32 bg-slate-700 rounded animate-pulse mb-8" />
            <div className="h-32 w-full border-t border-slate-700 border-dashed opacity-20" />
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Main <span className="text-indigo-500">Dashboard</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time DB Sync Active</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['weekly', 'monthly', 'yearly'].map((t) => (
              <button
                key={t}
                onClick={() => processAnalytics(rawOrders, t)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${timeframe === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee />} color="bg-emerald-500" />
          <KpiCard title="Total Users" value={stats.users} icon={<Users />} color="bg-blue-500" />
          <KpiCard title="Order Count" value={stats.totalOrders} icon={<ShoppingBag />} color="bg-indigo-500" />
          <KpiCard title="Total Products" value={stats.products} icon={<Package />} color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-500" /> Revenue Growth
              </h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <BarChart3 size={14} className="text-rose-500" /> Order Volume
            </h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px' }} />
                  <Bar dataKey="volume" fill="#f43f5e" radius={[6, 6, 6, 6]} barSize={30} />
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
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-default">
      <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg shadow-inherit/20`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
        <h2 className="text-2xl font-black mt-1 tracking-tight">{value}</h2>
      </div>
    </div>
  );
}
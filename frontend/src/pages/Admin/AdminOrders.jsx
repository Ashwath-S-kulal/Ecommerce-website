import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package, Eye, Search, MapPin, Clock, CheckCircle2,
  CircleDot, Phone, Mail, ShoppingBag, CreditCard,
  Receipt, X, Filter, ArrowUpDown, Calendar, User, Tag
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductNullImg from "../../assets/Product Doesnt Exist.webp";

export default function ShowUserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/order/getallorders`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (data.success) {
          setOrders(data.orders);
        } else {
          toast(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.log(err);
        toast("Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const processedOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
  });

  const statusOptions = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-pink-50 text-pink-600 border-pink-100';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50/30 p-4 md:p-10 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="h-10 w-full sm:w-64 bg-white border rounded-xl" />
            <div className="h-10 w-full sm:w-32 bg-white border rounded-xl" />
          </div>
        </div>
        <div className="h-96 bg-white border rounded-[32px]" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
              ALL <span className="text-pink-500 italic font-serif">ORDERS</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Management portal for user transactions.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                placeholder="Search ID or Name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <div className="flex flex-1 items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <Filter size={14} className="text-slate-400" />
                <select
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                className="flex-1 sm:flex-none flex items-center gap-2 rounded-xl font-bold text-sm bg-white border-slate-200 px-4 py-2 h-auto"
                onClick={() => setSortOrder(prev => prev === "recent" ? "oldest" : "recent")}
              >
                <ArrowUpDown size={14} />
                <span className="hidden sm:inline">{sortOrder === "recent" ? "Newest" : "Oldest"}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Order Id</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Customer</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Items</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Total Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedOrders.length > 0 ? processedOrders.map((order) => (
                  <TableRow key={order._id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="p-5 font-mono text-[11px] text-slate-400">#{order._id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell className="p-5">
                      <span className="font-bold text-slate-800 text-sm">{order?.user?.firstName || "Guest User"}</span>
                    </TableCell>
                    <TableCell className="p-5 text-xs font-medium text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="p-5">
                      <div className="flex items-center -space-x-3">
                        {order.products.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                            <img
                              src={item?.productId?.productImg?.[0]?.url || ProductNullImg}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-5 font-black text-slate-900">₹{order.amount?.toLocaleString()}</TableCell>
                    <TableCell className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-5 text-right">
                      <Button
                        onClick={() => navigate(`/dashboard/order-details/${order._id}`)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-slate-100 rounded-lg"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                      No orders found matching these criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {processedOrders.length > 0 ? processedOrders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-slate-400 uppercase">#{order._id.slice(-8)}</p>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    {order?.user?.firstName || "Guest User"}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                    <Calendar size={10} /> Date
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 uppercase font-bold tracking-tighter">
                    <Tag size={10} /> Amount
                  </p>
                  <p className="text-sm font-black text-pink-500">
                    ₹{order.amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center -space-x-2">
                  {order.products.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img
                        src={item?.productId?.productImg?.[0]?.url || ProductNullImg}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                  {order.products.length > 4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                      +{order.products.length - 4}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => navigate(`/dashboard/order-details/${order._id}`)}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-4 py-2 h-auto text-xs font-bold gap-2"
                >
                  Details <Eye size={14} />
                </Button>
              </div>
            </div>
          )) : (
            <div className="bg-white p-10 text-center rounded-2xl border border-slate-100 text-slate-400 text-sm">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
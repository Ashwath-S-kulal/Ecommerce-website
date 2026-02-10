import React, { useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Package, MapPin, Phone, Receipt, CreditCard, Calendar } from "lucide-react";

export default function ShowUserOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/order/getuserorder", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                });
                if (res.data.success) setOrders(res.data.orders);
            } catch (error) {
                console.log(error)
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [accessToken]);

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Studio</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-screen mx-auto p-4 md:p-10 space-y-10 bg-white mt-10 rounded-2xl">
            <header className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Purchases</h1>
                <p className="text-slate-500 text-sm font-medium">Manage your orders and shipping status</p>
            </header>

            <div className="space-y-12">
                {orders.map((order) => (
                    <div key={order._id} className="group border-2 border-slate-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="bg-slate-50/50 px-8 py-5 flex flex-wrap justify-between items-center border-b border-slate-100 gap-4">
                            <div className="flex gap-8">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ordered on</label>
                                    <p className="text-xs font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</span>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm ${order.status === 'Delivered'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-pink-50 text-pink-600 border-pink-200'
                                    }`}>
                                    {/* Animated Pulse Dot */}
                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-pink-500 animate-pulse'
                                        }`} />
                                    {order.status}
                                </div>
                            </div>

                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Product Section */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="space-y-5">
                                    {order.products.map((item) => (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden border border-slate-100">
                                                <img
                                                    src={item.productId?.productImg?.[0].url || 'https://via.placeholder.com/150'}
                                                    alt={item.productId?.productName}
                                                    className="w-full h-full object-cover"
                                                />

                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate pr-4">
                                                    {item.productId?.productName}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                    Qty: {item.quantity} × ₹{item.productId?.productPrice?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-black text-slate-900">₹{(item.productId?.productPrice * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex flex-wrap gap-10">
                                    <div className="flex gap-3">
                                        <MapPin size={16} className="text-pink-500 mt-0.5" />
                                        <div className="text-xs leading-relaxed">
                                            <p className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Shipping To</p>
                                            <p className="text-slate-500 font-medium">{order.address?.fullName || "Ashwath S"}</p>
                                            <p className="text-slate-500 font-medium">{order.address?.street}, {order.address?.city}</p>
                                            <p className="text-slate-500 font-medium">{order.address?.state}, {order.address?.zip}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Phone size={16} className="text-pink-500 mt-0.5" />
                                        <div className="text-xs leading-relaxed">
                                            <p className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Contact</p>
                                            <p className="text-slate-500 font-medium">{order.address?.phone || "8431294514"}</p>
                                            <p className="text-slate-500 font-medium">{order.address?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary Section */}
                            <div className="lg:col-span-5">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Receipt size={16} className="text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invoice Summary</span>
                                    </div>

                                    <div className="space-y-2 text-xs font-bold text-slate-600">
                                        <div className="flex justify-between">
                                            <span className="font-medium opacity-70">Order Amount</span>
                                            <span>₹{order.amount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium opacity-70">Tax (Estimated)</span>
                                            <span>₹{order.tax || "3,287"}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-600">
                                            <span className="font-medium">Shipping</span>
                                            <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-end pt-2">
                                            <div className="space-y-1">
                                                <span className="block text-[9px] font-black text-pink-500 uppercase tracking-[0.2em]">Grand Total</span>
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">
                                                    ₹{((order.amount || 0) + (order.tax || 3287)).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                                                <CreditCard size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
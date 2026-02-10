import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft, Printer, Package, MapPin,
    Phone, Mail, Receipt, CreditCard, Clock,
    CheckCircle2, Truck, Calendar, ShieldCheck, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;
        const fetchOrderDetails = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const { data } = await axios.get(`/api/order/getorder/${orderId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (data.success) setOrder(data.order);
            } catch (err) {
                console.error("Error fetching order:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
            <div className="w-10 h-10 border-2 border-slate-900 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 text-xs tracking-[0.2em] uppercase">Securing Data...</p>
        </div>
    );

    if (!order) return <div className="p-20 text-center font-bold text-slate-500">Manifest not found.</div>;

    const statusThemes = {
        Pending: "bg-orange-500 text-white shadow-orange-200",
        Confirmed: "bg-blue-600 text-white shadow-blue-200",
        Shipped: "bg-purple-600 text-white shadow-purple-200",
        Delivered: "bg-emerald-500 text-white shadow-emerald-200",
        Cancelled: "bg-red-500 text-white shadow-red-200",
    };

    return (
        <div className="min-h-screen bg-[#FBFBFE] p-6 md:p-12 text-slate-900 selection:bg-pink-100 shadow-2xl rounded-2xl">
            <div className="max-w-7xl mx-auto">
               <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="group mb-4 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-base font-extrabold"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <h1 className="text-4xl font-black tracking-tight italic">
                            Order <span className="text-slate-300 not-italic">#{order._id.slice(-8).toUpperCase()}</span>
                        </h1>
                    </div>
                    
                    <div className={`${statusThemes[order.status]} flex items-center gap-4 px-8 py-4 rounded-[24px] shadow-xl transition-all duration-500 scale-100 hover:scale-105`}>
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Current Phase</span>
                            <span className="text-2xl font-black uppercase tracking-tighter leading-none">{order.status}</span>
                        </div>
                    </div>
                </header>
                <div className="flex flex-col">
                    <main className="lg:col-span-8 space-y-8 shadow-md rounded-xl">
                        <section className="bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                    <Package className="text-pink-500" size={22} /> Shipment Contents
                                </h2>
                                <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg italic">
                                    {order.products.length} Units
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="p-6 flex items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                                        <div className="relative w-28 h-28 bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                                            <img
                                                src={item.productId?.productImg?.[0]?.url || "/api/placeholder/150/150"}
                                                alt="product"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{item.productId?.category}</p>
                                                    <h3 className="text-xl font-black italic text-slate-800 ">{item.productId?.productName}</h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs font-bold text-slate-400 italic">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black tracking-tighter italic">₹{(item.productId?.productPrice * item.quantity).toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-slate-300">₹{item.productId?.productPrice}/ea</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>

                    <div className="flex justify-between gap-7 mt-5">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-md p-8 space-y-8 w-full ">
                            <div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <MapPin size={16} className="text-pink-500" /> Destination
                                </h2>
                                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                                    <div>
                                        <p className="font-black text-lg italic tracking-tight">{order.address?.fullName}</p>
                                        <p className="text-slate-500 text-sm font-bold leading-relaxed opacity-80">
                                            {order.address?.street}, {order.address?.city}<br />
                                            {order.address?.state} - {order.address?.zip}
                                        </p>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-black">
                                            <Phone size={14} className="text-pink-500" /> {order.address?.phone}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-black">
                                            <Mail size={14} className="text-pink-500" /> {order.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-100 shadow-md p-8 relative overflow-hidden group w-full">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Receipt size={16} className="text-pink-500" /> Calculation
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold italic">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span>₹{order.amount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold italic">
                                    <span className="text-slate-400">Shipping</span>
                                    <span className="text-emerald-500">{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold italic">
                                    <span className="text-slate-400">Tax Est.</span>
                                    <span>₹{order.tax?.toLocaleString()}</span>
                                </div>
                                <Separator className="bg-slate-50 my-2" />
                                <div className="bg-slate-900 rounded-[32px] p-6 text-white group-hover:bg-slate-800 transition-colors duration-500">
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-1">Final Settlement</p>
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-4xl font-black italic tracking-tighter">
                                            ₹{((order.amount || 0) + (order.tax || 0) + (order.shipping || 0)).toLocaleString()}
                                        </h3>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/40">
                                            <CreditCard size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
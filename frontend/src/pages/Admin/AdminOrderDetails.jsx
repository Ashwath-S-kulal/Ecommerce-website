import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft, Printer, Package, MapPin,
    Phone, Mail, Receipt, CreditCard, Clock,
    CheckCircle2, Truck, Calendar, ShieldCheck, ChevronRight,
    Settings, XCircle, AlertTriangle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProductNullImg from "../../assets/Product Doesnt Exist.webp"

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    const fetchOrderDetails = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/order/getorder/${orderId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (data.success) setOrder(data.order);
        } catch (err) {
            console.error("Error fetching order:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) return;
        fetchOrderDetails();
    }, [orderId]);

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/order/updateorderstatusadmin/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (data.success) {
                await fetchOrderDetails();
                toast.success(`Order marked as ${newStatus}`);
            }
        } catch (err) {
            console.log(err)
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);

        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FBFBFE] p-6 md:p-12 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                    <div className="space-y-4">
                        <div className="h-6 w-20 bg-slate-200 rounded-lg" />
                        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
                    </div>
                    <div className="h-20 w-48 bg-slate-100 rounded-[24px]" />
                </header>

                <div className="flex flex-col gap-10">
                    <main className="space-y-8 bg-white rounded-xl border border-slate-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 w-40 bg-slate-200 rounded" />
                            <div className="h-6 w-16 bg-slate-100 rounded-lg" />
                        </div>

                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-6 py-6 border-b border-slate-50 last:border-0">
                                <div className="w-28 h-28 bg-slate-100 rounded-3xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 w-20 bg-slate-100 rounded" />
                                    <div className="h-6 w-48 bg-slate-200 rounded" />
                                    <div className="h-3 w-12 bg-slate-100 rounded" />
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="h-6 w-20 bg-slate-200 ml-auto rounded" />
                                    <div className="h-3 w-12 bg-slate-100 ml-auto rounded" />
                                </div>
                            </div>
                        ))}
                    </main>

                    <div className="flex flex-col md:flex-row justify-between gap-7 mt-5">
                        <div className="bg-white rounded-xl border border-slate-100 p-8 w-full space-y-6">
                            <div className="h-4 w-32 bg-slate-200 rounded" />
                            <div className="h-32 bg-slate-50 rounded-[32px]" />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-100 p-8 w-full space-y-4">
                            <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-3 w-16 bg-slate-100 rounded" />
                                    <div className="h-3 w-12 bg-slate-100 rounded" />
                                </div>
                            ))}
                            <div className="h-24 bg-slate-900 rounded-[32px] mt-4" />
                        </div>
                    </div>

                    <section className="bg-white rounded-[40px] border border-slate-100 p-10 mb-10">
                        <div className="h-4 w-48 bg-slate-200 rounded mb-10" />
                        <div className="space-y-12">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-8 items-start">
                                    <div className="w-6 h-6 rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-32 bg-slate-200 rounded" />
                                        <div className="h-3 w-64 bg-slate-100 rounded" />
                                    </div>
                                    <div className="h-10 w-32 bg-slate-100 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
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
    const statuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

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

                <div className="flex flex-col gap-10">
                    <main className="lg:col-span-8 space-y-8 shadow-md rounded-xl">
                        <section className="bg-white rounded-xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="p-5 md:p-8 border-b border-slate-50 flex justify-between items-center">
                                <h2 className="text-base md:text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                    <Package className="text-pink-500" size={22} />
                                    <span className="hidden xs:inline">Shipment Contents</span>
                                    <span className="xs:hidden">Contents</span>
                                </h2>
                                <span className="text-[10px] md:text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg italic">
                                    {order.products.length} Units
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 group hover:bg-slate-50/50 transition-colors">

                                        <div className="relative w-full sm:w-28 h-48 sm:h-28 bg-slate-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-inner">
                                            <img
                                                src={item.productId?.productImg?.[0]?.url || ProductNullImg}
                                                alt="product"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] md:text-[10px] font-black text-pink-500 uppercase tracking-widest">
                                                        {item.productId?.category || "General"}
                                                    </p>
                                                    <h3 className="text-lg md:text-xl font-black italic text-slate-800 leading-tight">
                                                        {item.productId?.productName || "Unknown Product"}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 md:mt-2">
                                                        <span className="text-xs font-bold text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="sm:text-right mt-2 sm:mt-0 w-full sm:w-auto flex sm:flex-col justify-between items-end sm:justify-start">
                                                    <div>
                                                        <p className="text-lg md:text-xl font-black tracking-tighter italic text-slate-900">
                                                            ₹{(item.productId?.productPrice * item.quantity).toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-300 sm:text-right">
                                                            ₹{item.productId?.productPrice?.toLocaleString()} / unit
                                                        </p>
                                                    </div>
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
                                    <span>₹{order.subtotal?.toLocaleString()}</span>
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
                                            ₹{((order.amount || 0)).toLocaleString()}
                                        </h3>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/40">
                                            <CreditCard size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <section className="bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-10 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                            <div
                                className={`h-full bg-emerald-500 transition-all duration-700 ${updating ? "w-full opacity-100" : "w-0 opacity-0"}`}
                            />
                        </div>

                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                            <Truck size={16} className="text-pink-500" /> Live Progress Manifest
                        </h2>

                        <div className="relative">
                            {[
                                { label: "Pending", desc: "Awaiting administrative verification." },
                                { label: "Confirmed", desc: "Order details verified and processing." },
                                { label: "Shipped", desc: "Package dispatched to logistics partner." },
                                { label: "Delivered", desc: "Package reached final destination." }
                            ].map((step, index, array) => {
                                const currentIdx = statuses.indexOf(order.status);
                                const stepIdx = statuses.indexOf(step.label);
                                const isCompleted = currentIdx >= stepIdx && order.status !== "Cancelled";
                                const isActive = order.status === step.label;
                                const isLast = index === array.length - 1;

                                return (
                                    <div key={step.label} className="relative flex gap-8 pb-12 last:pb-0 group">
                                        {!isLast && (
                                            <div className="absolute left-[11px] top-[28px] w-[3px] h-full bg-slate-100">
                                                <div
                                                    className={`w-full bg-emerald-500 transition-all duration-1000 ease-in-out ${currentIdx > stepIdx ? "h-full" : "h-0"
                                                        }`}
                                                />
                                            </div>
                                        )}

                                        <div className="relative z-10">
                                            <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${isCompleted
                                                ? "bg-emerald-500 border-emerald-100 scale-125 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                                : "bg-white border-slate-200"
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle2 size={12} className="text-white" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 -mt-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`font-black italic uppercase tracking-tighter text-xl transition-all duration-500 ${isCompleted ? "text-slate-900" : "text-slate-300"
                                                            }`}>
                                                            {step.label}
                                                        </h3>
                                                        {isActive && (
                                                            <Badge className="bg-emerald-500 text-white border-none text-[8px] px-2 py-0.5 animate-bounce">
                                                                ACTIVE
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm font-bold mt-1 transition-colors ${isCompleted ? "text-slate-500" : "text-slate-200"
                                                        }`}>
                                                        {step.desc}
                                                    </p>
                                                </div>


                                                <button
                                                    onClick={() => handleUpdateStatus(step.label)}
                                                    disabled={updating || order.status === step.label}
                                                    className={`w-40 px-4 py-2 rounded-xl text-[10px] cursor-pointer font-black uppercase tracking-widest border-2 transition-all 
                                        ${isActive
                                                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                                            : "bg-white border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
                                                        }`}
                                                >
                                                    {isActive ? "Current State" : `Set to ${step.label}`}
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Danger Zone</p>
                        <div className="bg-red-50/50 border-2 border-dashed border-red-200 rounded-[32px] p-8 flex flex-col gap-5">
                            <div className="flex items-center gap-3 text-red-600">
                                <AlertTriangle size={20} />
                                <span className="text-xs font-black italic uppercase tracking-wider">Abort Logistics</span>
                            </div>
                            <button
                                disabled={updating || order.status === "Cancelled"}
                                onClick={() => handleUpdateStatus("Cancelled")}
                                className={`w-full cursor-pointer flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all
                                                ${order.status === "Cancelled"
                                        ? "bg-slate-100 text-slate-400 border-2 border-slate-200"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-[6px_6px_0px_0px_rgba(153,27,27,1)] active:shadow-none active:translate-x-1 active:translate-y-1"}`}
                            >
                                <XCircle size={20} />
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
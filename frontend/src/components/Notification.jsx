import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Bell, Clock, MapPin, ArrowRight, CheckCircle2, Calendar, ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  markSingleRead, setNotifications } from '@/redux/productSlice';
import { Skeleton } from "@/components/ui/skeleton";

export default function Notifications() {
    const { notifications } = useSelector((state) => state.product);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');

    const fetchNotifications = async () => {
        if (!accessToken) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/notification/get`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                dispatch(setNotifications(res.data.notifications));
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id, orderId) => {
        dispatch(markSingleRead(id));
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URI}/api/notification/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (err) {
            console.error("Backend update failed", err);
        }

        if (orderId) {
            navigate(`/dashboard/order-details/${orderId}`);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const groupedNotifications = useMemo(() => {
        const groups = {};
        if (!notifications || !Array.isArray(notifications)) return groups;

        notifications.forEach((n) => {
            const dateObj = new Date(n.createdAt);
            const today = new Date().toLocaleDateString('en-GB');
            const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-GB');
            const current = dateObj.toLocaleDateString('en-GB');

            let label = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            if (current === today) label = "Today";
            else if (current === yesterday) label = "Yesterday";

            if (!groups[label]) groups[label] = [];
            groups[label].push(n);
        });
        return groups;
    }, [notifications]);

    if (loading) {
        return (
            <div className="pt-24 pb-20 bg-[#FBFBFC] min-h-screen px-4">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex justify-between items-center px-2">
                        <div className="space-y-2">
                            <div className="h-8 w-32 bg-zinc-200 animate-pulse rounded-lg" />
                            <div className="h-4 w-40 bg-zinc-100 animate-pulse rounded-md" />
                        </div>
                        <div className="w-10 h-10 bg-zinc-100 animate-pulse rounded-full" />
                    </div>
                    {[1, 2].map((group) => (
                        <div key={group} className="space-y-4">
                            <div className="h-3 w-24 mx-auto bg-zinc-100 animate-pulse rounded-full" />
                            {[1, 2].map((item) => (
                                <div key={item} className="bg-white rounded-[24px] p-4 border border-zinc-50 flex items-center gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-100 animate-pulse rounded-xl md:rounded-[18px]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 bg-zinc-100 animate-pulse rounded" />
                                        <div className="h-3 w-1/2 bg-zinc-50 animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

    return (
        <div className="pt-20 md:pt-24 pb-20 bg-[#FBFBFC] min-h-screen px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8 md:mb-12 px-2">
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-3xl font-bold text-zinc-900 tracking-tight">
                            Notifications
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? 'bg-blue-600 animate-pulse' : 'bg-zinc-300'}`} />
                            <p className="text-zinc-500 text-[11px] md:text-xs font-medium uppercase tracking-wider">
                                {unreadCount} New updates
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative p-2 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                            <Bell className="text-zinc-400" size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
                            )}
                        </div>
                    </div>
                </div>

                {Object.keys(groupedNotifications).length > 0 ? (
                    <div className="space-y-8 md:space-y-10">
                        {Object.entries(groupedNotifications).map(([date, items]) => (
                            <div key={date} className="space-y-4">
                                {/* Date Divider */}
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-[1px] flex-1 bg-zinc-100"></div>
                                    <span className="text-[9px] md:text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar size={12} /> {date}
                                    </span>
                                    <div className="h-[1px] flex-1 bg-zinc-100"></div>
                                </div>

                                <div className="space-y-3">
                                    {items.map((n) => {
                                        const order = n.orderId;
                                        const product = order?.products?.[0]?.productId;
                                        return (
                                            <div
                                                key={n._id}
                                                onClick={() => handleRead(n._id, order?._id)}
                                                className={`group relative bg-white rounded-[20px] md:rounded-[24px] p-3 md:p-4 border transition-all duration-300 cursor-pointer flex items-center gap-3 md:gap-4 ${n.isRead
                                                        ? "border-transparent opacity-70 grayscale-[0.4]"
                                                        : "border-zinc-100 shadow-sm hover:shadow-md md:scale-[1.01]"
                                                    }`}
                                            >
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={product?.productImg?.[0]?.url || 'https://placehold.co/100'}
                                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-[18px] object-cover bg-zinc-50 ${!n.isRead ? "ring-2 ring-blue-50 ring-offset-1" : ""}`}
                                                        alt="prod"
                                                    />
                                                    {!n.isRead && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                                        {!n.isRead && (
                                                            <span className="bg-blue-600 text-white text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-[4px] uppercase">New</span>
                                                        )}
                                                        <p className="text-zinc-800 text-[13px] md:text-[14px] leading-snug truncate">
                                                            <span className="font-bold text-zinc-900">{order?.address?.fullName || 'User'}</span>
                                                            <span className="text-zinc-400 font-medium"> ordered </span>
                                                            <span className="font-semibold text-zinc-900">{product?.productName || 'Product'}</span>
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase">
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span className="flex items-center gap-1"><MapPin size={10} /> {order?.address?.city || 'Location'}</span>
                                                        <span className={`${n.isRead ? "text-zinc-400" : "text-blue-600 font-black"}`}>₹{order?.amount}</span>
                                                    </div>
                                                </div>

                                                <div className={`shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${n.isRead ? "bg-zinc-50 text-zinc-300" : "bg-zinc-900 text-white group-hover:bg-blue-600"
                                                    }`}>
                                                    <ArrowRight size={12} md:size={14} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-[30px] md:rounded-[40px] border border-dashed border-zinc-200 mx-2">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="text-zinc-200" size={20} md:size={24} />
                        </div>
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center px-4">No Recent Activity</h3>
                        <p className="text-zinc-300 text-[11px] mt-1 text-center px-4">Orders will appear here as they come in.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
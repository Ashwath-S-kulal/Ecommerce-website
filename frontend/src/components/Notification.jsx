import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Bell, Clock, MapPin, ArrowRight, CheckCircle2, Calendar, ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { markAllNotificationsRead, markSingleRead, setNotifications } from '@/redux/productSlice';

export default function Notifications() {
    const { notifications } = useSelector((state) => state.product);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');

    const fetchNotifications = async () => {
        if (!accessToken) return;
        try {
            const res = await axios.get("http://localhost:8000/api/notification/get", {
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
            await axios.post(`http://localhost:8000/api/notification/read/${id}`, {}, { 
                headers: { Authorization: `Bearer ${accessToken}` } 
            });
        } catch (err) { 
            console.error("Backend update failed", err); 
        }
        
        if (orderId) {
            navigate(`/dashboard/order-details/${orderId}`);
        }
    };

    const handleMarkAllAsRead = async () => {
        dispatch(markAllNotificationsRead());
        try {
            await axios.post("http://localhost:8000/api/notification/allread", {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (err) {
            console.error("Error marking all read", err);
            fetchNotifications(); 
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
                    <div className="flex justify-between items-end px-2">
                        <div className="space-y-2">
                            <div className="h-8 w-32 bg-zinc-200 animate-pulse rounded-lg" />
                            <div className="h-4 w-48 bg-zinc-100 animate-pulse rounded-md" />
                        </div>
                        <div className="w-10 h-10 bg-zinc-100 animate-pulse rounded-full" />
                    </div>
                    {[1, 2].map((group) => (
                        <div key={group} className="space-y-4">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="h-[1px] w-20 bg-zinc-100" />
                                <div className="h-3 w-24 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-[1px] w-20 bg-zinc-100" />
                            </div>
                            {[1, 2].map((item) => (
                                <div key={item} className="bg-white rounded-[24px] p-4 border border-zinc-50 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-zinc-100 animate-pulse rounded-[18px]" />
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
        <div className="pt-24 pb-20 bg-[#FBFBFC] min-h-screen px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-end justify-between mb-10 px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={16} className="text-zinc-900" />
                            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Activity</h1>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium">
                            You have <span className="text-zinc-900 font-bold">{unreadCount} unread</span> updates
                        </p>
                    </div>
                    <div className="relative flex gap-5 items-center">
                        <div>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllAsRead}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-full transition-all duration-200 group"
                                >
                                    <Check size={12} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] cursor-pointer font-black uppercase tracking-wider">Mark all read</span>
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Bell className="text-zinc-300 transition-colors" size={28} />
                            {unreadCount > 0 && (
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#FBFBFC]" />
                            )}
                        </div>
                    </div>
                </div>

                {Object.keys(groupedNotifications).length > 0 ? (
                    <div className="space-y-10">
                        {Object.entries(groupedNotifications).map(([date, items]) => (
                            <div key={date} className="space-y-4">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-[1px] flex-1 bg-zinc-100"></div>
                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-2">
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
                                                className={`group relative bg-white rounded-[24px] p-4 border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                                                    n.isRead 
                                                    ? "border-transparent opacity-60 grayscale-[0.4]" 
                                                    : "border-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] scale-[1.01]"
                                                }`}
                                            >
                                                <div className="relative shrink-0">
                                                    <img 
                                                        src={product?.productImg?.[0]?.url || 'https://placehold.co/100'} 
                                                        className={`w-14 h-14 rounded-[18px] object-cover bg-zinc-50 ${!n.isRead ? "ring-2 ring-blue-50 ring-offset-2" : ""}`}
                                                        alt="prod"
                                                    />
                                                    {!n.isRead && (
                                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {!n.isRead && (
                                                            <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-[4px] uppercase tracking-tighter">New</span>
                                                        )}
                                                        <p className="text-zinc-800 text-[14px] leading-tight truncate">
                                                            <span className="font-bold text-zinc-900">{order?.address?.fullName || 'User'}</span>
                                                            <span className="text-zinc-400 font-medium"> ordered </span>
                                                            <span className="font-semibold text-zinc-900">{product?.productName || 'Product'}</span>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                                        <span className="flex items-center gap-1"><Clock size={11} strokeWidth={3} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={3} /> {order?.address?.city || 'Location'}</span>
                                                        <span className={`${n.isRead ? "text-zinc-400" : "text-blue-600"} bg-zinc-50 px-2 py-0.5 rounded-md`}>₹{order?.amount}</span>
                                                    </div>
                                                </div>

                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    n.isRead ? "bg-zinc-50 text-zinc-200" : "bg-zinc-900 text-white group-hover:bg-blue-600"
                                                }`}>
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-zinc-200">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="text-zinc-200" size={24} />
                        </div>
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No Recent Activity</h3>
                        <p className="text-zinc-300 text-[11px] mt-1">Orders will appear here as they come in.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
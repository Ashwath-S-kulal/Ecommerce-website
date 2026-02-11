import React, { useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Package, MapPin, Phone, Receipt, CreditCard, XCircle, AlertCircle, Clock } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrderSkeleton = () => (
    <div className="border-2 border-slate-100 rounded-3xl overflow-hidden animate-pulse bg-white">
        <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
            <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
        <div className="p-8 space-y-6">
            <div className="h-20 bg-slate-100 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-lg w-1/3" />
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        </div>
    </div>
);

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

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await axios.post(`/api/order/cancelorder/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Order cancelled successfully");
                setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const canCancel = (createdAt) => {
        const diff = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
        return diff <= 48;
    };

    const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];
    const cancelledSteps = ["Pending", "Cancelled"];

    const getStatusStep = (status) => {
        const statusMap = {
            "Pending": 0,
            "Confirmed": 1,
            "Shipped": 2,
            "Delivered": 3,
            "Cancelled": 1,
        };
        return statusMap[status] ?? 0;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 bg-white mt-10 rounded-2xl min-h-screen">
            <header className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Purchases</h1>
                <p className="text-slate-500 text-sm font-medium">Manage your orders and shipping status</p>
            </header>

            <div className="space-y-12">
                {loading ? (
                    [1, 2, 3].map((i) => <OrderSkeleton key={i} />)
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No orders found</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="group border-2 border-slate-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                            <div className="bg-slate-50/50 px-8 py-5 flex flex-wrap justify-between items-center border-b border-slate-100 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ordered on</label>
                                    <p className="text-xs font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider shadow-sm ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        order.status === 'Cancelled' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                            'bg-pink-50 text-pink-600 border-pink-200'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Cancelled' ? 'bg-slate-400' : 'bg-pink-500 animate-pulse'}`} />
                                    {order.status}
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-7 space-y-6">
                                    {order.products.map((item) => (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden border border-slate-100">
                                                <img src={item.productId?.productImg?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.productId?.productName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{item.productId?.productName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity} × ₹{item.productId?.productPrice?.toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-black text-slate-900">₹{(item.productId?.productPrice * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="block text-[9px] font-black text-pink-500 uppercase tracking-widest">Grand Total</span>
                                                <span className="text-2xl font-black text-slate-900 italic">₹{order.amount?.toLocaleString()}</span>
                                            </div>
                                            <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                                                <CreditCard size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 pb-8">
                                <div className={`rounded-3xl p-8 border ${order.status === "Cancelled" ? "bg-red-50/30 border-red-100" : "bg-slate-50/30 border-slate-100/50"
                                    }`}>
                                    <div className="relative flex justify-between items-center">
                                        <div className="absolute top-[8px] left-0 w-full h-[3px] bg-slate-100 rounded-full z-0" />
                                        <div
                                            className={`absolute top-[8px] left-0 h-[3px] transition-all duration-700 ease-in-out rounded-full z-0 ${order.status === "Cancelled" ? "bg-red-500" : "bg-emerald-500"
                                                }`}
                                            style={{
                                                width: order.status === "Cancelled"
                                                    ? "100%"
                                                    : `${(getStatusStep(order.status) / (steps.length - 1)) * 100}%`
                                            }}
                                        />

                                        {(order.status === "Cancelled" ? cancelledSteps : steps).map((step, index) => {
                                            const isCancelled = order.status === "Cancelled";
                                            const currentStepIdx = getStatusStep(order.status);
                                            const isActive = index <= currentStepIdx;
                                            const isCurrent = index === currentStepIdx;
                                            const activeColor = isCancelled ? 'border-red-500' : 'border-emerald-500';
                                            const activeBg = isCancelled ? 'bg-red-500' : 'bg-emerald-500';
                                            const shadowColor = isCancelled ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)';

                                            return (
                                                <div key={step} className="relative z-10 flex flex-col items-center group">
                                                    <div className={`w-4 h-4 rounded-full border-[3px] transition-all duration-500 flex items-center justify-center ${isActive
                                                            ? `bg-white ${activeColor} shadow-[0_0_15px_${shadowColor}]`
                                                            : 'bg-white border-slate-200'
                                                        }`}>
                                                        {isCurrent && (
                                                            <div className={`w-full h-full rounded-full ${activeBg} animate-ping opacity-30`} />
                                                        )}
                                                        {isActive && !isCurrent && (
                                                            <div className={`w-1.5 h-1.5 rounded-full ${activeBg}`} />
                                                        )}
                                                    </div>

                                                    <div className="absolute top-6 flex flex-col items-center min-w-[80px]">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest text-center transition-colors duration-300 ${isActive
                                                                ? (isCancelled && isCurrent ? 'text-red-600' : 'text-slate-900')
                                                                : 'text-slate-300'
                                                            }`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="h-6" />
                                </div>
                            </div>


                            {(order.status !== "Cancelled" && order.status !== "Delivered") && (
                                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock size={14} className="text-pink-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {canCancel(order.createdAt)
                                                ? "Cancellation valid up to 48 hours from order date"
                                                : "Order window for cancellation has expired"}
                                        </span>
                                    </div>

                                    {canCancel(order.createdAt) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-100 rounded-xl text-[10px] font-black text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm uppercase tracking-widest">
                                                    <XCircle size={14} />
                                                    Cancel Order
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-3xl border-2 border-slate-100">
                                                <AlertDialogHeader>
                                                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                                        <AlertCircle className="text-red-500" size={24} />
                                                    </div>
                                                    <AlertDialogTitle className="text-xl font-black text-slate-900 tracking-tight">Confirm Cancellation</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-500 font-medium text-sm">
                                                        Are you sure you want to cancel order <span className="text-slate-900 font-bold">#{order._id.slice(-6).toUpperCase()}</span>? This process is irreversible.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="mt-6">
                                                    <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Back</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="rounded-xl font-bold uppercase tracking-widest text-[10px] bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100"
                                                    >
                                                        Yes, Cancel Order
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>

                            )}



                        </div>

                    ))
                )}
            </div>

        </div>
    );
}
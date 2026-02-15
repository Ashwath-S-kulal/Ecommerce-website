import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Package, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
  useEffect(() => {
    // Simple one-shot confetti burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#ec4899']
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <Check size={32} className="text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 font-medium">
            Thank you for shopping with us. We've sent a confirmation email to your inbox.
          </p>
        </div>

        {/* Status Tracker Placeholder */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
            <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                <p className="text-slate-900 font-semibold">Processing your items</p>
            </div>
            <Package className="text-emerald-500" size={24} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link to="/orders" className="w-full">
            <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-base transition-all">
              Track Order
            </Button>
          </Link>
          
          <Link to="/products" className="w-full">
            <Button variant="ghost" className="w-full h-14 text-slate-600 hover:text-slate-900 font-bold flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              Continue Shopping
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
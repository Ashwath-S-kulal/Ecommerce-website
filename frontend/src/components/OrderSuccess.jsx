import React, { useEffect } from "react";
import {  Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Printer, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti"; // Optional: npm install canvas-confetti

export default function OrderSuccess() {

    useEffect(() => {
        // Celebration effect on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white border border-slate-100 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden">

                    {/* Animated Header */}
                    <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500 via-transparent to-transparent" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 rotate-3 animate-in zoom-in duration-500">
                                <CheckCircle2 size={40} className="text-white" />
                            </div>
                            <h1 className="text-white text-3xl font-black tracking-tighter sm:text-4xl">
                                ORDER <span className="text-pink-500 italic font-serif">CONFIRMED</span>
                            </h1>
                            <p className="text-slate-400 mt-2 font-medium">Thank you for choosing Sanjeevini shop</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-8 text-center">

                        <Separator />

                        {/* Messaging */}
                        <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-500/20" />
                                ))}
                            </div>
                            <p className="text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
                                We are carefully packing your favorites right now.
                                Check your email for a little note from us about your order.              </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <Link to="/orders">
                                <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                                    <Package size={18} /> View Status
                                </Button>
                            </Link>
                            <Link to="/products">
                                <Button variant="outline" className="w-full h-14 border-slate-200 hover:bg-slate-50 text-slate-900 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                                    <ShoppingBag size={18} /> Back to Shop
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Separator = () => <div className="h-px w-full bg-slate-100" />;
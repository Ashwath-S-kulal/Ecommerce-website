import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader, CheckCircle2, ShieldCheck, Mail, Lock, User, Timer, RotateCcw } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"

export default function SignUp() {
    const [step, setStep] = useState(1) 
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600); 
    const [resendCooldown, setResendCooldown] = useState(600); 
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [otp, setOtp] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (step === 2) {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
                setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleResendOTP = async () => {
        try {
            setResending(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/resendotp`, { 
                email: formData.email 
            });
            
            if (res.data.success) {
                toast.success("A fresh code has been sent!");
                setTimeLeft(600); 
                setResendCooldown(60); 
                setOtp(""); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/register`, formData);
            if (res.data.success) {
                toast.success("Verification code sent!");
                setStep(2); 
                setTimeLeft(600);
                setResendCooldown(60);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const otpVerifyHandler = async (e) => {
        e.preventDefault()
        if (timeLeft === 0) return toast.error("OTP Expired. Please resend code.");
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/verifysignup`, {
                email: formData.email,
                otp: otp
            });
            if (res.data.success) {
                toast.success("Welcome to Sanjeevini!");
                setTimeout(() => navigate('/login'), 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-[#fdf2f8] overflow-hidden p-6 pt-20">
            {/* Background Art */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-pink-200 to-transparent rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-200 to-transparent rounded-full blur-[120px] opacity-60" />

            <Card className="relative w-full max-w-lg shadow-2xl border-white/40 bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden pt-2">
                <CardHeader className="space-y-1 text-center pt-10">
                    <div className="mx-auto w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 text-pink-600 shadow-xl shadow-pink-100/50 border border-pink-50">
                        <ShieldCheck size={32} />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
                        {step === 1 ? "Create Account" : "Verify Email"}
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-medium px-6">
                        {step === 1 
                            ? "Join us today! It only takes a minute." 
                            : `A 6-digit code was sent to ${formData.email}`}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-10 pb-10">
                    <form className="space-y-6" onSubmit={step === 1 ? submitHandler : otpVerifyHandler}>
                        
                        {/* STEP 1: REGISTRATION */}
                        <div className={`space-y-4 transition-all duration-700 ${step === 2 ? "hidden" : "block animate-in fade-in"}`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">First Name</Label>
                                    <Input name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" className="bg-white/50 border-gray-100 focus:ring-pink-500 rounded-2xl h-12 shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Last Name</Label>
                                    <Input name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" className="bg-white/50 border-gray-100 focus:ring-pink-500 rounded-2xl h-12 shadow-sm" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                    <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@company.com" className="pl-12 bg-white/50 border-gray-100 rounded-2xl h-12 shadow-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Password</Label>
                                    <div className="relative">
                                        <Input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-white/50 border-gray-100 rounded-2xl h-12 shadow-sm" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-300">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Confirm</Label>
                                    <Input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`bg-white/50 border-gray-100 rounded-2xl h-12 shadow-sm ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-300 focus:ring-red-400" : ""}`} />
                                </div>
                            </div>
                        </div>

                        {/* STEP 2: OTP VERIFICATION */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                                <div className="bg-pink-50/50 p-4 rounded-2xl flex items-center justify-between border border-pink-100">
                                    <span className="text-[10px] uppercase font-black text-pink-400 tracking-tighter">Code Expires In</span>
                                    <div className="flex items-center gap-2 text-pink-600">
                                        <Timer size={20} className={timeLeft < 60 ? "animate-bounce" : ""} />
                                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="block text-center text-xs font-bold uppercase text-gray-400 tracking-widest">Security Code</Label>
                                    <Input
                                        maxLength={6}
                                        placeholder="······"
                                        className="text-center text-4xl tracking-[15px] font-black h-20 bg-white border-pink-100 text-pink-600 rounded-[2rem] shadow-xl shadow-pink-50"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        autoFocus
                                    />
                                    
                                    <div className="flex flex-col items-center gap-2 pt-2">
                                        {timeLeft === 0 && (
                                            <p className="text-center text-red-500 text-xs font-bold animate-pulse">OTP Expired!</p>
                                        )}
                                        
                                        <button 
                                            type="button"
                                            disabled={resendCooldown > 0 || resending}
                                            onClick={handleResendOTP}
                                            className="flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-700 disabled:text-gray-400 transition-colors"
                                        >
                                            {resending ? <Loader className="animate-spin" size={14} /> : <RotateCcw size={14} />}
                                            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive code? Resend"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={loading || (step === 2 && timeLeft === 0)} className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${step === 1 ? "bg-pink-600 hover:bg-pink-700 shadow-pink-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"}`}>
                            {loading ? <Loader className="animate-spin mr-2" /> : step === 1 ? "Get OTP Code" : "Verify & Activate"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-white/50 bg-white/30 pt-6">
                    <p className="text-sm text-gray-500">
                        Member already? <Link to="/login" className="ml-1 text-pink-600 font-black hover:underline underline-offset-4">Log In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
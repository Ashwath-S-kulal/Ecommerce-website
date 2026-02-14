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
    const [resendCooldown, setResendCooldown] = useState(60);

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
        <div className="relative flex justify-center items-center min-h-screen sm:bg-[#fdf2f8] bg-white overflow-hidden p-4 sm:p-6 mt-0 md:mt-15 sm:pt-20 mb-0 md:mb-20">
            <Card className="relative w-full max-w-lg border-none ">
                <CardHeader className="space-y-1 text-center py-6 sm:pt-10">
                  
                    <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                        {step === 1 ? "Create Account" : "Verify Email"}
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-medium px-2 sm:px-6 text-xs sm:text-sm">
                        {step === 1
                            ? "Join us today! It only takes a minute."
                            : `Code sent to ${formData.email}`}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-10 pb-6 sm:pb-10">
                    <form className="space-y-4 sm:space-y-6" onSubmit={step === 1 ? submitHandler : otpVerifyHandler}>

                        {/* STEP 1: REGISTRATION */}
                        <div className={`space-y-3 sm:space-y-4 transition-all duration-700 ${step === 2 ? "hidden" : "block animate-in fade-in"}`}>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">First Name</Label>
                                    <Input name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" className="bg-gray-50 sm:bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Last Name</Label>
                                    <Input name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" className="bg-gray-50 sm:bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3 sm:top-3.5 text-gray-300" size={16} />
                                    <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="yourmail@gmail.com" className="pl-11 bg-gray-50 sm:bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:gap-4">
                                {/* Password Field */}
                                <div className="space-y-1">
                                    <Label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="bg-gray-50 sm:bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1">
                                    <Label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`bg-gray-50 sm:bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                                ? "border-red-300 focus-visible:ring-red-400"
                                                : ""
                                            }`}
                                    />
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* STEP 2: OTP VERIFICATION */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-pink-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between border border-pink-100">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-pink-400 tracking-tighter">Code Expires In</span>
                                    <div className="flex items-center gap-2 text-pink-600">
                                        <Timer size={18} className={timeLeft < 60 ? "animate-bounce" : ""} />
                                        <span className="font-mono font-bold text-base sm:text-lg">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="block text-center text-[10px] sm:text-xs font-bold uppercase text-gray-400 tracking-widest">Security Code</Label>
                                    <Input
                                        maxLength={6}
                                        placeholder="······"
                                        className="text-center text-3xl sm:text-4xl tracking-[10px] sm:tracking-[15px] font-black h-16 sm:h-20 bg-white border-pink-100 text-pink-600 rounded-2xl sm:rounded-[2rem] shadow-lg sm:shadow-xl shadow-pink-50"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        autoFocus
                                    />

                                    <div className="flex flex-col items-center gap-2 pt-1">
                                        {timeLeft === 0 && (
                                            <p className="text-center text-red-500 text-[10px] font-bold animate-pulse">OTP Expired!</p>
                                        )}

                                        <button
                                            type="button"
                                            disabled={resendCooldown > 0 || resending}
                                            onClick={handleResendOTP}
                                            className="flex items-center gap-2 text-[11px] font-bold text-pink-600 hover:text-pink-700 disabled:text-gray-400 transition-colors"
                                        >
                                            {resending ? <Loader className="animate-spin" size={12} /> : <RotateCcw size={12} />}
                                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={loading || (step === 2 && timeLeft === 0)} className={`w-full h-12 sm:h-14 cursor-pointer font-bold text-base sm:text-lg shadow-lg transition-all active:scale-[0.98] ${step === 1 ? "bg-pink-600 hover:bg-pink-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                            {loading ? <Loader className="animate-spin mr-2" /> : step === 1 ? "Get OTP Code" : "Verify & Activate"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-gray-50 sm:border-white/50 bg-gray-50/50 sm:bg-white/30 py-4 sm:pt-6">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Member already? <Link to="/login" className="ml-1 text-pink-600 font-black hover:underline">Log In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
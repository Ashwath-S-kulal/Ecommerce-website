import React, { useState } from "react"
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
import { Eye, EyeOff, Loader, ArrowLeft, ShieldCheck, Mail, Lock, CheckCircle2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/userSlice"

export default function Login() {
  const [mode, setMode] = useState("login") // 'login', 'forgot', 'verify', 'reset'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [otp, setOtp] = useState("")
  const [newPasswords, setNewPasswords] = useState({ newPassword: "", confirmPassword: "" })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/login`, formData)
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
        localStorage.setItem("accessToken", res.data.accessToken)
        navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/forgotpassword`, { email: formData.email })
      if (res.data.success) {
        toast.success("OTP sent to your email")
        setMode("verify")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/verifyotp/${formData.email}`, { otp })
      if (res.data.success) {
        toast.success("OTP Verified")
        setMode("reset")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if(newPasswords.newPassword !== newPasswords.confirmPassword) return toast.error("Passwords match error");
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/user/changepassword/${formData.email}`, newPasswords)
      if (res.data.success) {
        toast.success("Password updated successfully!")
        setMode("login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#fdf2f8] overflow-hidden p-6">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-pink-200 to-transparent rounded-full blur-[120px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-200 to-transparent rounded-full blur-[120px] opacity-60 animate-pulse" />

      <Card className="relative w-full max-w-md shadow-2xl border-white/40 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border">
        <CardHeader className="space-y-1 text-center pt-10 px-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 text-pink-600 shadow-xl shadow-pink-100/50 border border-pink-50">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
            {mode === 'login' && "Welcome Back"}
            {mode === 'forgot' && "Reset Access"}
            {mode === 'verify' && "Verify Identity"}
            {mode === 'reset' && "New Password"}
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium pt-2">
            {mode === 'login' && "Access your Sanjeevini account dashboard"}
            {mode === 'forgot' && "Enter your email to receive a secure code"}
            {mode === 'verify' && `We've sent a 6-digit code to your email`}
            {mode === 'reset' && "Ensure your new password is secure"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <form onSubmit={
            mode === 'login' ? handleLogin : 
            mode === 'forgot' ? handleForgotPassword : 
            mode === 'verify' ? handleVerifyOTP : handleResetPassword
          } className="space-y-5">
            
            {/* --- LOGIN MODE --- */}
            {mode === 'login' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-300" size={18} />
                    <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@company.com" className="pl-12 bg-white/50 border-gray-100 rounded-2xl h-12 focus:ring-pink-500 shadow-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Password</Label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-300" size={18} />
                    <Input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="pl-12 bg-white/50 border-gray-100 rounded-2xl h-12 focus:ring-pink-500 shadow-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-pink-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- FORGOT MODE --- */}
            {mode === 'forgot' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 text-center block">Registered Email</Label>
                  <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email address" className="bg-white/50 border-gray-100 rounded-2xl h-12 text-center shadow-sm" />
                </div>
              </div>
            )}

            {/* --- VERIFY MODE --- */}
            {mode === 'verify' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                   <Label className="block text-center text-xs font-bold uppercase text-gray-400 tracking-widest">Security Code</Label>
                   <Input maxLength={6} className="text-center text-3xl tracking-[12px] font-black h-16 bg-white border-pink-100 text-pink-600 rounded-2xl shadow-xl shadow-pink-50" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="••••••" />
                </div>
              </div>
            )}

            {/* --- RESET MODE --- */}
            {mode === 'reset' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">New Password</Label>
                  <Input type="password" required value={newPasswords.newPassword} onChange={(e) => setNewPasswords({...newPasswords, newPassword: e.target.value})} className="bg-white/50 border-gray-100 rounded-2xl h-12 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Confirm New Password</Label>
                  <Input type="password" required value={newPasswords.confirmPassword} onChange={(e) => setNewPasswords({...newPasswords, confirmPassword: e.target.value})} className="bg-white/50 border-gray-100 rounded-2xl h-12 shadow-sm" />
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${mode === 'reset' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'}`}>
              {loading ? <Loader className="animate-spin mr-2" size={20} /> : mode === 'login' ? "Sign In" : mode === 'forgot' ? "Send Reset Code" : mode === 'verify' ? "Verify & Continue" : "Update Password"}
            </Button>

            {mode !== 'login' && (
              <button type="button" onClick={() => setMode('login')} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-600 transition-colors uppercase tracking-widest">
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </form>
        </CardContent>

        {mode === 'login' && (
          <CardFooter className="justify-center border-t border-white/50 bg-white/30 py-6">
            <p className="text-sm text-gray-500">
              New to Sanjeevini? <Link to="/signup" className="ml-1 text-pink-600 font-black hover:underline underline-offset-4">Create Account</Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
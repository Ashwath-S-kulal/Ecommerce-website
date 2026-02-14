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
import { Eye, EyeOff, Loader, ArrowLeft, ShieldCheck, Mail, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/userSlice"

export default function Login() {
  const [mode, setMode] = useState("login") 
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
    <div className="relative flex justify-center items-center min-h-screen bg-[#fdf2f8] overflow-hidden p-4 sm:p-6">
     
      <Card className="relative w-full max-w-[400px] mt-0 md:mt-15">
        
        <CardHeader className="space-y-1 text-center pt-8 sm:pt-10 px-6 sm:px-8">
          
          <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            {mode === 'login' && "Welcome Back"}
            {mode === 'forgot' && "Reset Access"}
            {mode === 'verify' && "Verify Identity"}
            {mode === 'reset' && "New Password"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-medium pt-1">
            {mode === 'login' && "Look at Sanjeevini Products"}
            {mode === 'forgot' && "Enter email for a secure code"}
            {mode === 'verify' && `Code sent to your email`}
            {mode === 'reset' && "Secure your new password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-10 pb-8 sm:pb-10">
          <form onSubmit={
            mode === 'login' ? handleLogin : 
            mode === 'forgot' ? handleForgotPassword : 
            mode === 'verify' ? handleVerifyOTP : handleResetPassword
          } className="space-y-4 sm:space-y-5">
            
            {/* --- LOGIN MODE --- */}
            {mode === 'login' && (
              <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-1.5">
                  <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="youremail@gmail.com" className="pl-11 bg-white/50 border-gray-100  h-11 sm:h-12 text-sm focus:ring-pink-500 shadow-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Password</Label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-[10px] sm:text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="pl-11 bg-white/50 border-gray-100  h-11 sm:h-12 text-sm focus:ring-pink-500 shadow-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- FORGOT MODE --- */}
            {mode === 'forgot' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-1.5">
                  <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 text-center block">Registered Email</Label>
                  <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Enter email" className="bg-white/50 border-gray-100 h-11 sm:h-12 text-sm text-center shadow-sm" />
                </div>
              </div>
            )}

            {/* --- VERIFY MODE --- */}
            {mode === 'verify' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Label className="block text-center text-[10px] sm:text-xs font-bold uppercase text-gray-400 tracking-widest">Security Code</Label>
                <Input maxLength={6} className="text-center text-2xl sm:text-3xl tracking-[8px] sm:tracking-[12px] font-black h-14 sm:h-16 bg-white border-pink-100 text-pink-600 rounded-xl sm:rounded-2xl shadow-lg" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="••••••" />
              </div>
            )}

            {/* --- RESET MODE --- */}
            {mode === 'reset' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-1.5">
                  <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">New Password</Label>
                  <Input type="password" required value={newPasswords.newPassword} onChange={(e) => setNewPasswords({...newPasswords, newPassword: e.target.value})} className="bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Confirm Password</Label>
                  <Input type="password" required value={newPasswords.confirmPassword} onChange={(e) => setNewPasswords({...newPasswords, confirmPassword: e.target.value})} className="bg-white/50 border-gray-100 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm shadow-sm" />
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className={`w-full h-12 sm:h-14 font-bold text-base sm:text-lg shadow-lg transition-all active:scale-[0.98] ${mode === 'reset' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'}`}>
              {loading ? <Loader className="animate-spin mr-2" size={18} /> : mode === 'login' ? "Sign In" : mode === 'forgot' ? "Send Code" : mode === 'verify' ? "Verify" : "Update"}
            </Button>

            {mode !== 'login' && (
              <button type="button" onClick={() => setMode('login')} className="w-full flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 hover:text-pink-600 transition-colors uppercase tracking-widest pt-2">
                <ArrowLeft size={14} /> Back to Login
              </button>
            )}
          </form>
        </CardContent>

        {mode === 'login' && (
          <CardFooter className="justify-center border-t border-white/50 bg-white/30 py-4 sm:py-6">
            <p className="text-xs sm:text-sm text-gray-500">
              New user? <Link to="/signup" className="ml-1 text-pink-600 font-black hover:underline underline-offset-4">Sign Up</Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
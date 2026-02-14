import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader, Camera, User, MapPin, Phone, Mail, Save, ImagePlus, ChevronLeft } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ShowUserOrders from '../components/orderDetails'

export default function Profile() {
    const { user } = useSelector(store => store.user);
    const params = useParams();
    const userId = params.userId;
    const [loading, setLoading] = useState(false)
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        profilePic: user?.profilePic || "",
        role: user?.role || ""
    });
    const [file, setFile] = useState(null)
    const dispatch = useDispatch();
    const isAdmin = user?.role === "admin";

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken")
        try {
            const formData = new FormData()
            Object.keys(updateUser).forEach(key => { if (key !== 'profilePic') formData.append(key, updateUser[key]); });
            if (file) formData.append("file", file);
            const res = await axios.put(`${import.meta.env.VITE_BASE_URI}/api/user/updateuser/${userId}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}`, "content-Type": "multipart/form-data" }
            })
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to update profile");
        } finally { setLoading(false); }
    }

    return (
        <div className='pt-16 md:pt-28 mt-6 min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 md:pb-32'>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                                <div className="bg-white rounded-sm md:rounded-xl p-5 md:p-8 mb-6 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-slate-50 shadow-inner bg-slate-100">
                            <img
                                src={updateUser?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                alt="Profile"
                            />
                        </div>
                        <Label
                            htmlFor="profilePic"
                            className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white"
                        >
                            <Camera size={16} />
                            <Input type='file' accept='image/*' id='profilePic' className='hidden' onChange={handleFileChange} />
                        </Label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                                {updateUser.firstName || 'User'}'s <span className="text-pink-500 italic font-serif">Profile</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-xs md:text-sm max-w-xs mx-auto md:mx-0">
                                Personalize and Manage your Profile Information
                            </p>
                        </div>

                        <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
                            <Label
                                htmlFor="profilePic"
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] md:text-xs font-bold hover:bg-pink-600 transition-all active:scale-95"
                            >
                                <ImagePlus size={14} />
                                <span>Change Photo</span>
                            </Label>

                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="uppercase tracking-wider">{updateUser.role || 'Member'} Account</span>
                            </div>

                            {isAdmin && (
                                <NavLink
                                    to="/dashboard/sales"
                                    className="inline-flex items-center px-3 py-2 rounded-xl text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-colors"
                                >
                                    Admin Panel
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="bg-slate-200/50 p-1 h-11 rounded-xl mb-6 w-full md:w-fit grid grid-cols-2 md:flex">
                        <TabsTrigger value="profile" className="rounded-lg px-4 md:px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none data-[state=active]:shadow-sm transition-all font-bold text-xs md:text-sm text-slate-500">
                            Identity
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="rounded-lg px-4 md:px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none data-[state=active]:shadow-sm transition-all font-bold text-xs md:text-sm text-slate-500">
                            Orders
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="outline-none animate-in fade-in slide-in-from-bottom-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white p-6 md:p-8 rounded-sm md:rounded-xl border border-slate-200/60 shadow-sm space-y-6">
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-3">
                                    <User size={14} /> Basic Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 ml-1">First Name</Label>
                                            <Input name='firstName' value={updateUser.firstName} onChange={handleChange} className="bg-slate-50 border-none h-11 md:h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-slate-200 text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 ml-1">Last Name</Label>
                                            <Input name='lastName' value={updateUser.lastName} onChange={handleChange} className="bg-slate-50 border-none h-11 md:h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-slate-200 text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 ml-1">Email</Label>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <Input disabled value={updateUser.email} className="pl-11 bg-slate-100 border-none h-11 md:h-12 rounded-sm opacity-60 text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 ml-1">Phone</Label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <Input name='phoneNo' value={updateUser.phoneNo} onChange={handleChange} className="pl-11 bg-slate-50 border-none h-11 md:h-12 rounded-sm text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-sm md:rounded-xl border border-slate-200/60 shadow-sm space-y-6">
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-3">
                                    <MapPin size={14} /> Location
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 ml-1">Address</Label>
                                        <Input name='address' value={updateUser.address} onChange={handleChange} className="bg-slate-50 border-none h-11 md:h-12 rounded-sm text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 ml-1">City</Label>
                                            <Input name='city' value={updateUser.city} onChange={handleChange} className="bg-slate-50 border-none h-11 md:h-12 rounded-sm text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 ml-1">Zip Code</Label>
                                            <Input name='zipCode' value={updateUser.zipCode} onChange={handleChange} className="bg-slate-50 border-none h-11 md:h-12 rounded-sm text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mt-4 sticky bottom-4 md:static md:mt-10 rounded-sm bg-white/90 backdrop-blur-md border border-slate-200 p-3 md:p-4 z-40 shadow-xl md:shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Account</p>
                                    <p className="text-[9px] text-slate-400">Updates sync instantly across all devices</p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 sm:flex-none rounded-sm font-bold text-slate-500 text-xs"
                                        onClick={() => window.location.reload()}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-[2] sm:min-w-[180px] h-11 md:h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95"
                                    >
                                        {loading ? <Loader className="animate-spin mr-2" size={14} /> : <Save className="mr-2" size={14} />}
                                        {loading ? "Updating..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders">
                       <ShowUserOrders/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
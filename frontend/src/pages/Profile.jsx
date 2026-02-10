import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader, Camera, User, Package, MapPin, Phone, Mail, Save, ImagePlus } from 'lucide-react'
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
            const res = await axios.put(`http://localhost:8000/api/user/updateuser/${userId}`, formData, {
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
        <div className='pt-20 md:pt-28 min-h-screen bg-[#F8FAFC] text-slate-900 pb-32'>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-[32px] p-8 mb-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-50 shadow-inner bg-slate-100">
                            <img
                                src={updateUser?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                        </div>
                        <Label
                            htmlFor="profilePic"
                            className="absolute bottom-0 right-0 p-2.5 bg-black text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white"
                        >
                            <Camera size={18} />
                            <Input type='file' accept='image/*' id='profilePic' className='hidden' onChange={handleFileChange} />
                        </Label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        {/* Typography & Heading */}
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                {updateUser.firstName || 'User'}'s <span className="text-pink-500 italic font-serif">Profile</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-sm sm:text-base">
                                Personalize your boutique experience and preferences
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center md:justify-start items-center gap-3">

                            <Label
                                htmlFor="profilePic"
                                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-100 transition-all active:scale-95"
                            >
                                <ImagePlus size={16} />
                                <span>Change Photo</span>
                            </Label>

                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="uppercase tracking-wider">{updateUser.role || 'Member'} Account</span>
                            </div>

                            {isAdmin && (
                                <NavLink
                                    to="/dashboard/sales"
                                    className="inline-flex items-center px-4 py-2.5 rounded-2xl text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-colors"
                                >
                                    Admin Panel
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="bg-slate-200/50 p-1 rounded-2xl mb-8 w-fit">
                        <TabsTrigger value="profile" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all font-bold text-slate-500">
                            Identity
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all font-bold text-slate-500">
                            Orders
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="outline-none animate-in fade-in slide-in-from-bottom-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <User size={16} /> Basic Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-400 ml-1">First Name</Label>
                                            <Input name='firstName' value={updateUser.firstName} onChange={handleChange} className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-400 ml-1">Last Name</Label>
                                            <Input name='lastName' value={updateUser.lastName} onChange={handleChange} className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-slate-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-400 ml-1">Email</Label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <Input disabled value={updateUser.email} className="pl-11 bg-slate-100 border-none h-12 rounded-xl opacity-60" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-400 ml-1">Phone</Label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <Input name='phoneNo' value={updateUser.phoneNo} onChange={handleChange} className="pl-11 bg-slate-50 border-none h-12 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <MapPin size={16} /> Location
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-400 ml-1">Address</Label>
                                        <Input name='address' value={updateUser.address} onChange={handleChange} className="bg-slate-50 border-none h-12 rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-400 ml-1">City</Label>
                                            <Input name='city' value={updateUser.city} onChange={handleChange} className="bg-slate-50 border-none h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-400 ml-1">Zip Code</Label>
                                            <Input name='zipCode' value={updateUser.zipCode} onChange={handleChange} className="bg-slate-50 border-none h-12 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                          <div className="mt-10 rounded-2xl  bg-white/80 backdrop-blur-lg border-t border-slate-200 p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unsaved Changes</p>
                            <p className="text-[10px] text-slate-400">Updates will be applied to your global account</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                className="flex-1 sm:flex-none rounded-xl font-bold text-slate-500"
                                onClick={() => window.location.reload()}
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 sm:min-w-[200px] h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                            >
                                {loading ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
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
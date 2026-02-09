import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader, Camera, ArrowRight, User, History } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
        setLoading(true); e.preventDefault();
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

         } 
        finally { setLoading(false); }
    }

    return (
        <div className='pt-24 min-h-screen bg-white font-sans text-black mb-20'>
            <div className="max-w-5xl mx-auto px-6">
                
                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-8 mb-3 gap-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Personal Archive</span>
                        <h1 className="text-4xl font-bold tracking-tighter mt-2">{updateUser.firstName || 'User'}'s Profile</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Role: {updateUser.role || 'Member'}</span>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 mb-10 gap-10">
                        <TabsTrigger value="profile" className="p-0 bg-transparent text-xl font-bold data-[state=active]:underline underline-offset-8 decoration-2 tracking-tighter">Identity</TabsTrigger>
                        <TabsTrigger value="orders" className="p-0 bg-transparent text-xl font-bold data-[state=active]:underline underline-offset-8 decoration-2 tracking-tighter">Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="m-0 focus-visible:ring-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            
                            {/* Avatar: No border, sharp edges */}
                            <div className="lg:col-span-4">
                                <div className="relative aspect-square w-full bg-gray-50 group overflow-hidden">
                                    <img 
                                        src={updateUser?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
                                        className="w-full h-full object-cover  transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        alt="Profile" 
                                    />
                                    <Label htmlFor="profilePic" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={32} />
                                        <Input type='file' accept='image/*' id='profilePic' className='hidden' onChange={handleFileChange} />
                                    </Label>
                                </div>
                                <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Click image to modify visual identity</p>
                            </div>

                            {/* Form: Borderless inputs with labels as placeholders */}
                            <div className="lg:col-span-8 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    {[
                                        { label: 'First Name', name: 'firstName' },
                                        { label: 'Last Name', name: 'lastName' },
                                        { label: 'Contact Number', name: 'phoneNo' },
                                        { label: 'Email', name: 'email', disabled: true },
                                    ].map((field) => (
                                        <div key={field.name} className="relative group">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">
                                                {field.label}
                                            </Label>
                                            <Input 
                                                name={field.name}
                                                disabled={field.disabled}
                                                value={updateUser[field.name]}
                                                onChange={handleChange}
                                                className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-black text-lg font-medium bg-transparent transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="relative group">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">Physical Address</Label>
                                    <Input 
                                        name='address'
                                        value={updateUser.address}
                                        onChange={handleChange}
                                        className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-black text-lg font-medium bg-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="relative group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">City</Label>
                                        <Input name='city' value={updateUser.city} onChange={handleChange} className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-black text-lg font-medium bg-transparent" />
                                    </div>
                                    <div className="relative group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">Zip Code</Label>
                                        <Input name='zipCode' value={updateUser.zipCode} onChange={handleChange} className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-black text-lg font-medium bg-transparent" />
                                    </div>
                                </div>

                                <div>
                                    <Button 
                                        type='submit' 
                                        className='group relative w-full md:w-auto px-16 py-8 bg-black text-white hover:bg-black overflow-hidden rounded-none'
                                    >
                                        <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <div className="relative flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                                            {loading ? <Loader className="animate-spin" /> : <>Save Record <ArrowRight size={16} /></>}
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="orders" className="min-h-[400px] border-t border-gray-100 pt-10">
                        <div className="flex flex-col gap-6 opacity-30">
                            <h2 className="text-4xl font-bold tracking-tighter">Null_Archive</h2>
                            <p className="max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed">Your transaction history is currently empty. All future interactions will be indexed here.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
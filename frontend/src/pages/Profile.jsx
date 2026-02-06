import React, { useState } from 'react'

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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { Loader } from 'lucide-react'

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
        if (!selectedFile) return; // 🧠 prevent crash if no file selected

        setFile(selectedFile);
        setUpdateUser({
            ...updateUser,
            profilePic: URL.createObjectURL(selectedFile), // for preview only
        });
    };


    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const accessToken = localStorage.getItem("accessToken")
        try {
            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file) //image  file for backend multer
            }
            const res = await axios.put(`http://localhost:8000/api/user/updateuser/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "content-Type": "multipart/form-data"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }
            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile")


        }

    }



    return (
        <div className='pt-20 min-h-screen bg-gray-100'>
            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div>
                        <div className='flex flex-col justify-center items-center bg-gray-100'>
                            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
                            <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
                                <div className='flex flex-col items-center'>
                                    <img src={updateUser?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} alt='img'
                                        className='w-36 h-36 rounded-full object-cover border-4 border-pink-800 p-1' />
                                    <Label className='mt-3 text-pink-600 font-medium text-sm cursor-pointer' htmlFor='profilePic'>Change Photo
                                        <Input type='file' accept='image/*' id='profilePic' className='hidden'
                                            onChange={handleFileChange}
                                        />
                                    </Label>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className="block text-sm font-medium">First Name</Label>
                                            <Input
                                                type='text'
                                                name='firstName'
                                                placeholder="john"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                className='mt-1 w-full border rounded-lg px-3 py-2' />
                                                
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Last Name</Label>
                                            <Input
                                                type='text'
                                                name='lastName'
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                placeholder="doe"
                                                className='mt-1 w-full border rounded-lg px-3 py-2' />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Email</Label>
                                        <Input type='email' name='email' disabled
                                            value={updateUser.email}
                                            onChange={handleChange}
                                            className='mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed' />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Phone Number</Label>
                                        <Input
                                            type='text'
                                            name='phoneNo'
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
                                            placeholder='enter your contact number'
                                            className='mt-1 w-full border rounded-lg px-3 py-2' />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Address</Label>
                                        <Input
                                            type='text'
                                            name='address'
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            placeholder='enter your Adress'
                                            className='mt-1 w-full border rounded-lg px-3 py-2' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className="block text-sm font-medium">City</Label>
                                            <Input
                                                type='text'
                                                name='city'
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                placeholder='enter your city'
                                                className='mt-1 w-full border rounded-lg px-3 py-2' />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Zip code</Label>
                                            <Input
                                                type='text'
                                                name='zipCode'
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
                                                placeholder='enter your Zipcode'
                                                className='mt-1 w-full border rounded-lg px-3 py-2' />
                                        </div>
                                    </div>


                                    <Button
                                        type='submit'
                                        className='w-full bg-pink-600 hover:bg-pink-700 text-white mt-4'>
                                        {loading ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update"
                                        )}
                                    </Button>

                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you&apos;ll be logged
                                out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-current">Current password</Label>
                                <Input id="tabs-demo-current" type="password" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">New password</Label>
                                <Input id="tabs-demo-new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

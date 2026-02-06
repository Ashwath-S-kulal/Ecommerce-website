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
import { Eye, EyeOff, Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const submitHandler = async(e) => {
        e.preventDefault()
        console.log(formData);
        try {

            setLoading(true);
            const res=await axios.post(`http://localhost:8000/api/user/register`,formData,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(res.data.success){
                navigate('/verify');
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message );
        }
        finally{
            setLoading(false);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-pink-100">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-xl font-semibold capitalize">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-6" onSubmit={submitHandler}>
                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password field */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit buttons */}
                        <div className="flex flex-col gap-2 pt-2">
                            <Button type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-700 text-white">
                              {loading?<><Loader className="h-4 w-4 animate-spin mr-2"/>Loading</>:"Sign Up"}  
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-gray-600">
                    Already have an account?
                    <Link to={'/login'} className="ml-1 text-blue-600 hover:underline">
                        Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

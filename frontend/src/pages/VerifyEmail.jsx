import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("Verifying...");
    const navigate = useNavigate();

    const verifyEmail = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/user/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setStatus("Email Verified Successfully!");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }

        } catch (error) {
            console.log(error);
            console.log("Response:", error.response?.data);
            setStatus("Verification Failed. Please try again.");

        }
    }

    useEffect(() => {
        verifyEmail();
    }, [token])
    return (
        <div className='relative w-full h-[760px] bg-pink-100 overflow-hidden'>
            <div className='min-h-screen flex items-center justify-center'>
                <div className='bg-white p-6 rounded-2xl shadow-2xl text-center w-[90%] max-w-md'>
                    <h2 className='text-2xl font-semibold text-gary-500 mb-4'>{status}</h2>
                </div>
            </div>
        </div>
    )
}

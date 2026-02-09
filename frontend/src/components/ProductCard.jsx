import { ShoppingCart, Heart, X } from 'lucide-react' 
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCart, setWishlist } from '@/redux/productSlice'
import { useNavigate } from 'react-router-dom'

export default function ProductCard  ({ product, loading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const { wishlist } = useSelector(store => store.product);

    const productImg = product?.productImg;
    const productPrice = product?.productPrice;
    const productName = product?.productName;

    // Logic remains same
    const addtoCart = async (productId) => {
        if (!accessToken) return toast.error("Please login first");
        try {
            const res = await axios.post('/api/cart/add', { productId }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                toast.success("Product added to cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) { console.error(error); }
    };

    const toggleWishlist = async () => {
        if (!accessToken) return toast.error("Please login first");
        const endpoint = isInWishlist ? '/api/wishlist/remove' : '/api/wishlist/add';
        const method = isInWishlist ? 'delete' : 'post';        
        try {
            const res = await axios({
                method,
                url: endpoint,
                data: { productId: product._id },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
                dispatch(setWishlist(res.data.wishlist));
            }
        } catch (error) { console.error(error); }
    };

    const isInWishlist = wishlist?.items?.some(item => item.productId?._id === product?._id);

    return (
        <div className='bg-white border border-gray-200  shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-4 transition-all shadow-md hover:shadow-xl w-full max-w-[300px]'>
            {/* Image Container */}
            <div className='bg-[#F8F9FA] rounded-[24px] border aspect-square relative flex items-center justify-center overflow-hidden group'>
                {loading || !product ? (
                        <WishlistSkeleton/>
                ) : (
                    <>
                        <img
                            src={productImg?.[0]?.url}
                            alt={productName}
                            onClick={() => navigate(`/products/${product._id}`)}
                            className='w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110 cursor-pointer'
                        />

                        {/* Top Action Button (Wishlist or Close) */}
                        <button
                            onClick={toggleWishlist}
                            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            {isInWishlist ? (
                                <Heart size={16} className="text-pink-600 fill-pink-600" />
                            ) : (
                                <Heart size={16} className="text-gray-400" /> 
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className='mt-5 px-1 space-y-2'>
                {loading || !product ? (
                    <div className='space-y-2'>
                        <WishlistSkeleton/>
                    </div>
                ) : (
                    <>
                        <h1 className='text-[#0F172A] font-bold text-[15px] line-clamp-1 tracking-tight uppercase'>
                            {productName}
                        </h1>
                        <h2 className='text-[#0F172A] font-extrabold text-xl'>
                            ₹{productPrice?.toLocaleString('en-IN')}
                        </h2>
                        
                        <Button
                            className='w-full bg-[#0F172A] hover:bg-[#1e293b] text-white rounded-2xl h-10 mt-4 flex items-center justify-center gap-2 font-bold transition-all active:scale-95'
                            onClick={() => addtoCart(product._id)}
                        >
                            <ShoppingCart size={16} />
                            Add to cart
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};



const WishlistSkeleton = () => (
    <div className="max-w-[1440px] mx-auto pt-24 px-4 md:px-10">
        <Skeleton className="h-10 w-48 mb-12 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 p-2 bg-white rounded-[24px]">
                    <Skeleton className="aspect-[1/1.2] w-full rounded-[18px]" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full rounded-[14px]" />
                </div>
            ))}
        </div>
    </div>
);
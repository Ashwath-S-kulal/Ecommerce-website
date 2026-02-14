import { ShoppingCart, Heart } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCart, setWishlist } from '@/redux/productSlice'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product, loading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const { wishlist } = useSelector(store => store.product);

    const isInWishlist = wishlist?.items?.some(item => item.productId?._id === product?._id);

    const addtoCart = async (productId) => {
        if (!accessToken) return toast.error("Please login first");
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/cart/add`, { productId }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                toast.success("Product added to cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) { console.error(error); }
    };

    const toggleWishlist = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking heart
        if (!accessToken) return toast.error("Please login first");
        const endpoint = isInWishlist ? `${import.meta.env.VITE_BASE_URI}/api/wishlist/remove` : `${import.meta.env.VITE_BASE_URI}/api/wishlist/add`;
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

    if (loading || !product) return <CardSkeleton />;

    return (
        <div className='group bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-md md:rounded-xl p-3 md:p-4 transition-all duration-300 w-full flex flex-col h-full'>
            <div className='bg-[#F8F9FA] rounded-md md:rounded-xl border border-gray-50 aspect-square relative flex items-center justify-center overflow-hidden shrink-0'>
                <img
                    src={product?.productImg?.[0]?.url}
                    alt={product?.productName}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className='w-3/4 h-3/4 object-contain transition-transform duration-500 group-hover:scale-110 cursor-pointer'
                />
                <button
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
                >
                    <Heart 
                        size={18} 
                        className={isInWishlist ? "text-pink-600 fill-pink-600" : "text-gray-400"} 
                    />
                </button>
            </div>

            <div className='mt-4 px-1 flex flex-col flex-grow'>
                <h1 className='text-[#0F172A] font-bold text-sm md:text-[15px] line-clamp-1 tracking-tight uppercase'>
                    {product?.productName}
                </h1>
                <h2 className='text-[#0F172A] font-extrabold text-lg md:text-xl mt-1'>
                    ₹{product?.productPrice?.toLocaleString('en-IN')}
                </h2>
                
                <div className="mt-auto">
                    <Button
                        className='w-full bg-[#0F172A] hover:bg-[#1e293b] text-white rounded-xl md:rounded-xl h-9 md:h-11 mt-4 flex items-center justify-center gap-2 font-bold transition-all active:scale-95 text-xs md:text-sm'
                        onClick={() => addtoCart(product._id)}
                    >
                        <ShoppingCart size={16} />
                        <span className="hidden xs:inline">Add</span>
                        <span className="xs:hidden">Add to cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CardSkeleton = () => (
    <div className='bg-white border border-gray-100 rounded-[32px] p-4 w-full animate-pulse'>
        <Skeleton className="aspect-square w-full rounded-[24px] mb-4" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full rounded-2xl" />
    </div>
);

export const ProductGridSkeleton = () => (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
);
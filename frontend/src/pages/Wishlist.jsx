import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingBag, Trash2, ArrowRight, X, Sparkles, Plus, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { setWishlist, setCart } from '@/redux/productSlice';
import { toast } from 'sonner';

export default function Wishlist() {
    const { wishlist } = useSelector(store => store.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const API = `${import.meta.env.VITE_BASE_URI}/api/wishlist`;
    const CART_API = `${import.meta.env.VITE_BASE_URI}/api/cart`;
    const accessToken = localStorage.getItem('accessToken');

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/get`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.data.success) {
                dispatch(setWishlist(res.data.wishlist || { items: [] }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const res = await axios.delete(`${API}/remove`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { productId },
            });
            if (res.data.success) {
                dispatch(setWishlist(res.data.wishlist));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove");
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            const res = await axios.post(`${CART_API}/add`, { productId }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.data.success) {
                dispatch(setCart(res.data.cart));
                toast.success("Added to cart");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, [dispatch]);

    if (loading) return <WishlistSkeleton />;

    return (
        <div className="min-h-screen bg-[#F9FAFB] pt-20 md:pt-24 pb-20 px-3 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-0 md:mb-12 gap-4 border-b border-gray-100 pb-6 md:pb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            My Wishlist 
                            <span className="bg-rose-50 text-rose-500 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold">
                                {wishlist?.items?.length || 0}
                            </span>
                        </h1>
                        <p className="text-gray-400 text-[11px] md:text-sm mt-0.5 md:mt-1">Saved items for your aesthetic upgrade.</p>
                    </div>
                    <Button asChild variant="outline" className="hidden md:block rounded-full border-gray-200 h-9 md:h-11 px-6 md:px-8 text-xs font-bold hover:bg-black hover:text-white transition-all">
                        <Link to="/products">Browse More</Link>
                    </Button>
                </div>

                {wishlist?.items?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-x-4 md:gap-y-10">
                        {wishlist.items.map((item) => (
                            <div key={item.productId?._id} className="group relative flex flex-col bg-white p-1.5 md:p-2 rounded-2xl shadow-sm border border-transparent hover:border-rose-100 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300">
                                
                                <div className="relative aspect-square md:aspect-[1/1.2] overflow-hidden rounded-xl mb-2 md:mb-4 bg-gray-50/50">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item.productId?._id);
                                        }}
                                        className="absolute top-1.5 right-1.5 z-10 p-1.5 md:p-2 bg-white/80 hover:bg-rose-500 hover:text-white text-gray-400 backdrop-blur-md rounded-full transition-all duration-200 shadow-sm"
                                    >
                                        <X size={12} className="md:w-[14px] md:h-[14px]" />
                                    </button>

                                    <img
                                        src={item.productId?.productImg?.[0]?.url}
                                        alt={item.productId?.productName}
                                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                                        className="w-full h-full p-4 md:p-6 object-contain transition-transform rounded-xl duration-700 group-hover:scale-110 cursor-pointer"
                                    />
                                </div>

                                <div className="px-1 md:px-2 pb-1.5 md:pb-2 flex flex-col flex-grow">
                                    <h3 
                                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                                        className="text-[11px] md:text-[13px] font-bold text-gray-800 line-clamp-1 mb-0.5 md:mb-1 group-hover:text-rose-500 transition-colors cursor-pointer"
                                    >
                                        {item.productId?.productName}
                                    </h3>
                                    <p className="text-[12px] md:text-sm font-black text-gray-900 mb-2 md:mb-4">
                                        ₹{item.productId?.productPrice?.toLocaleString()}
                                    </p>
                                    
                                    <button 
                                        onClick={() => handleMoveToCart(item.productId?._id)}
                                        className="mt-auto flex items-center justify-center gap-1.5 w-full bg-gray-900 hover:bg-rose-500 text-white py-2 md:py-2.5 rounded-lg md:rounded-[14px] text-[9px] md:text-[11px] font-black uppercase tracking-wider md:tracking-widest transition-all active:scale-95 shadow-sm"
                                    >
                                        <ShoppingCart size={12} className="md:w-[14px] md:h-[14px]" />
                                        <span className="inline">Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-white rounded-3xl md:rounded-[40px] shadow-sm border border-gray-50 px-6 text-center">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
            <Heart size={24} className="md:w-7 md:h-7 text-rose-400 fill-rose-100" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Your wishlist is empty</h2>
        <p className="text-gray-400 text-xs md:text-sm mt-2 mb-8 max-w-xs">Items you save will appear here for your next aesthetic upgrade!</p>
        <Link to="/products">
            <Button className="bg-black text-white rounded-full px-8 md:px-10 h-11 md:h-14 hover:bg-rose-500 transition-all text-xs font-bold uppercase tracking-widest">
                Shop Arrivals
            </Button>
        </Link>
    </div>
);

const WishlistSkeleton = () => (
    <div className="max-w-[1440px] mx-auto pt-24 px-4 md:px-10">
        <Skeleton className="h-8 md:h-10 w-32 md:w-48 mb-8 md:mb-12 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3 p-2 bg-white rounded-2xl border border-gray-50">
                    <Skeleton className="aspect-square md:aspect-[1/1.2] w-full rounded-xl" />
                    <Skeleton className="h-3 w-3/4 rounded-full" />
                    <Skeleton className="h-8 md:h-10 w-full rounded-lg" />
                </div>
            ))}
        </div>
    </div>
);
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
        <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 px-4 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-gray-100 pb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
                            My Wishlist <span className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full font-bold">{wishlist?.items?.length || 0}</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Items you've saved for your next aesthetic upgrade.</p>
                    </div>
                    <Button asChild variant="outline" className="rounded-full border-gray-200 px-8 hover:bg-black hover:text-white transition-all">
                        <Link to="/products">Browse More</Link>
                    </Button>
                </div>

                {wishlist?.items?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                        {wishlist.items.map((item) => (
                            <div key={item.productId?._id} className="group relative flex flex-col bg-white p-2 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
                                                                <div className="relative aspect-[1/1.2] overflow-hidden rounded-xl mb-4 bg-gray-50">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item.productId?._id);
                                        }}
                                        className="absolute top-2 right-2 z-10 p-2 bg-white/70 hover:bg-rose-500 hover:text-white text-gray-600 backdrop-blur-md rounded-full transition-all duration-200"
                                    >
                                        <X size={14} />
                                    </button>

                                    <img
                                        src={item.productId?.productImg?.[0]?.url}
                                        alt={item.productId?.productName}
                                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                                        className="w-full h-full p-6 object-cover transition-transform rounded-xl duration-700 group-hover:scale-110 cursor-pointer"
                                    />
                                </div>
                                <div className="px-2 pb-2 flex flex-col flex-grow">
                                    <h3 
                                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                                        className="text-[13px] font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-rose-600 transition-colors cursor-pointer"
                                    >
                                        {item.productId?.productName}
                                    </h3>
                                    <p className="text-sm font-black text-gray-900 mb-4">
                                        ₹{item.productId?.productPrice?.toLocaleString()}
                                    </p>
                                    <button 
                                        onClick={() => handleMoveToCart(item.productId?._id)}
                                        className="mt-auto flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-rose-600 text-white py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md hover:shadow-rose-200"
                                    >
                                        <ShoppingCart size={14} />
                                        Add to Cart
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
    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-50">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
            <Heart size={28} className="text-rose-400 fill-rose-100" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
        <p className="text-gray-400 text-sm mt-2 mb-8">Save items to find them here later!</p>
        <Link to="/products">
            <Button className="bg-black text-white rounded-full px-10 py-6 hover:bg-rose-600 transition-all">
                Shop Arrivals
            </Button>
        </Link>
    </div>
);

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
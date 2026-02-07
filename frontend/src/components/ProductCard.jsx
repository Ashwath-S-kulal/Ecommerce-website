import { ShoppingCart, Heart } from 'lucide-react'   // ✅ ADD Heart
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCart, setWishlist } from '@/redux/productSlice'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, loading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const productImg = product?.productImg;
    const productPrice = product?.productPrice;
    const productName = product?.productName;
    const { wishlist } = useSelector(store => store.product);


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
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // ================= ADD WISHLIST =================
    const addToWishlist = async (productId) => {
        if (!accessToken) return toast.error("Please login first");
        try {
            const res = await axios.post('/api/wishlist/add', { productId }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                toast.success("Added to wishlist");
                dispatch(setWishlist(res.data.wishlist))
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await axios.delete('/api/wishlist/remove', {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { productId }
            });

            if (res.data.success) {
                toast.success("Removed from wishlist");
                dispatch(setWishlist(res.data.wishlist));
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const toggleWishlist = () => {
        if (!accessToken) return toast.error("Please login first");

        if (isInWishlist) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    // =================================================
    const isInWishlist = wishlist?.items?.some(
        item => item.productId?._id === product?._id
    );
    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max'>
            <div className='w-full h-full aspect-square overflow-hidden relative'>
                {loading || !product ? (
                    <Skeleton className='w-full h-full rounded-lg' />
                ) : (
                    <>
                        <img
                            src={productImg?.[0]?.url}
                            alt='img'
                            onClick={() => navigate(`/products/${product._id}`)}
                            className='w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer'
                        />

                        {/* ❤️ WISHLIST BUTTON */}
                        <button
                            onClick={toggleWishlist}
                            className={`absolute top-3 right-3 p-2 rounded-full shadow-md 
    ${isInWishlist ? 'bg-pink-600' : 'bg-white hover:bg-pink-100'}`}
                        >

                            <Heart
                                size={18}
                                className={isInWishlist ? 'text-white fill-white' : 'text-pink-600'}
                            />

                        </button>

                    </>
                )}
            </div>

            {loading || !product ? (
                <div className='px-2 space-y-2 my-2'>
                    <Skeleton className='w-[200px] h-4' />
                    <Skeleton className='w-[100px] h-4' />
                    <Skeleton className='w-[150px] h-8' />
                </div>
            ) : (
                <div className='px-2 space-y-1'>
                    <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
                    <h2 className='font-bold'>₹{productPrice}</h2>
                    <Button
                        className='bg-pink-600 mb-3 w-full'
                        onClick={() => addtoCart(product._id)}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;

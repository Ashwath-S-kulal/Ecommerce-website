import React, { useState } from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setCart, setWishlist } from '@/redux/productSlice'
import { useNavigate } from 'react-router-dom'
import {
    Minus,
    Plus,
    ShoppingBag,
    Star,
    Flame,
    Heart,
    ArrowRight
} from 'lucide-react'

export default function ProductDesc({ product }) {
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')
    const { wishlist } = useSelector(store => store.product)

    // Check if product is in wishlist
    const isInWishlist = wishlist?.items?.some(item => item.productId?._id === product?._id)

    const addToCart = async (productId) => {
        if (!accessToken) return toast.error("Please login to add items")
        setLoading(true)
        try {
            const res = await axios.post('/api/cart/add', { productId }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                toast.success(`Item added to tray`)
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to add to cart")
        } finally {
            setLoading(false)
        }
    }

    const toggleWishlist = async () => {
        if (!accessToken) return toast.error("Please login first")
        const endpoint = isInWishlist ? '/api/wishlist/remove' : '/api/wishlist/add'
        try {
            const res = await axios({
                method: isInWishlist ? 'delete' : 'post',
                url: endpoint,
                data: { productId: product._id },
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
                dispatch(setWishlist(res.data.wishlist))
            }
        } catch (error) { console.error(error) }
    }

    const stockCount = product?._id
        ? (product._id.charCodeAt(product._id.length - 1) % 8) + 2
        : 5;

    return (
        <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700'>
            {/* Header Info */}
            <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <span className='px-3 py-1 bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full'>
                            {product.category}
                        </span>
                        <div className='flex items-center gap-1 text-amber-500'>
                            <Star size={14} fill="currentColor" />
                            <span className='text-xs font-bold text-gray-500'>4.8 (2.4k Reviews)</span>
                        </div>
                    </div>
                    <button onClick={toggleWishlist} className='p-2 hover:bg-pink-50 rounded-full transition-colors'>
                        <Heart size={22} className={isInWishlist ? 'fill-pink-600 text-pink-600' : 'text-slate-300'} />
                    </button>
                </div>
                <h1 className='font-black text-3xl text-slate-900 tracking-tighter leading-tight'>
                    {product.productName}
                </h1>
                <p className='text-sm font-bold text-slate-400 uppercase tracking-[0.2em]'>
                    Collection by {product.brand || "Sanjeevini"}
                </p>
            </div>

            {/* Pricing Section */}
            <div className='flex items-center gap-4'>
                <h2 className='text-4xl font-black text-slate-900'>₹{product.productPrice.toLocaleString()}</h2>
                <div className='flex flex-col'>
                    <span className='text-sm text-slate-400 line-through font-bold'>₹{(product.productPrice * 1.25).toFixed(0)}</span>
                    <span className='text-[10px] font-black text-green-600 uppercase'>Save 25%</span>
                </div>
            </div>

            {/* Urgency Indicator */}
                <div className='flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl w-fit border border-orange-100'>
                    <Flame size={16} className='text-orange-500 animate-pulse' />
                    <p className='text-[11px] font-bold text-orange-700 uppercase'>
                        Only {stockCount} items left in stock!
                    </p>
            </div>

            <p className='text-slate-500 text-sm leading-relaxed max-w-full italic border-l-2 border-pink-100 pl-4'>
                {product.productDesc || "Handcrafted with love and precision, this exclusive piece brings traditional artisan skill to your modern lifestyle."}
            </p>

            {/* Interactive Controls */}
            <div className='space-y-6 pt-4'>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-3'>
                        <Button
                            disabled={loading}
                            onClick={() => addToCart(product._id)}
                            className="flex-[2] h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex gap-3"
                        >
                            <ShoppingBag size={18} />
                            {loading ? "Adding..." : "Add to Cart"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/cart')}
                            className="flex-1 h-12 border-2 border-slate-900 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex gap-2"
                        >
                            Go to Cart
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
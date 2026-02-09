import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { Search, RotateCcw, Filter, ChevronRight, Hash } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton" // Ensure this is imported

// Custom Skeleton Component
const WishlistSkeleton = () => (
    <div className="col-span-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-10">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4 p-4 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                <Skeleton className="aspect-square w-full rounded-[24px]" />
                <div className="space-y-2 px-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full rounded-2xl mt-4" />
                </div>
            </div>
        ))}
    </div>
);

export default function Products() {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [sortOrder, setSortOrder] = useState('')

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [absoluteMax, setAbsoluteMax] = useState(0)

    const dispatch = useDispatch()

    const categories = ["All", ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    const brands = ["All", ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/product/getallproducts`);
            if (res.data.success) {
                const fetched = res.data.products;
                setAllProducts(fetched);
                const highest = Math.max(...fetched.map(p => p.productPrice), 0);
                setAbsoluteMax(highest);
                setMaxPrice(highest);
                dispatch(setProducts(fetched))
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (allProducts.length === 0 && !loading) return
        let filtered = [...allProducts]

        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }
        if (category !== "All") filtered = filtered.filter(p => p.category === category)
        if (brand !== "All") filtered = filtered.filter(p => p.brand === brand)

        filtered = filtered.filter(p => p.productPrice >= minPrice && p.productPrice <= maxPrice)

        if (sortOrder === "lowtohigh") filtered.sort((a, b) => a.productPrice - b.productPrice)
        else if (sortOrder === "hightolow") filtered.sort((a, b) => b.productPrice - a.productPrice)

        dispatch(setProducts(filtered))
    }, [search, category, brand, sortOrder, minPrice, maxPrice, allProducts, dispatch])

    useEffect(() => { getAllProducts(); }, []);

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setMinPrice(0);
        setMaxPrice(absoluteMax);
        setSortOrder("");
    };

    return (
        <div className='min-h-screen bg-[#F9FAFB] pt-24 pb-20 px-6'>
            <div className='max-w-screen mx-auto'>

                {/* --- Header --- */}
                <div className='flex items-center justify-between mb-10'>
                    <div className='flex items-center gap-3'>
                        <div className='w-1 h-8 bg-black rounded-full' />
                        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Products</h1>
                    </div>
                    <p className='text-xs font-medium text-gray-400 uppercase tracking-tighter'>
                        Index: {products?.length} / {allProducts.length}
                    </p>
                </div>

                {/* --- Control Deck --- */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-16'>
                    <div className='lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6'>
                        <div className='relative'>
                            <Search className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-300' size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full bg-transparent border-b border-gray-100 pb-3 pl-8 outline-none focus:border-black transition-all text-sm font-medium placeholder:text-gray-200'
                            />
                        </div>

                        <div className='flex flex-wrap gap-3'>
                            <select
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className='h-11 px-5 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 outline-none border-none hover:bg-gray-100 transition-colors'
                            >
                                <option value="All">All Categories</option>
                                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select
                                value={brand} onChange={(e) => setBrand(e.target.value)}
                                className='h-11 px-5 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 outline-none border-none hover:bg-gray-100 transition-colors'
                            >
                                <option value="All">All Brands</option>
                                {brands.filter(b => b !== "All").map(b => <option key={b} value={b}>{b}</option>)}
                            </select>

                            <select
                                value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                className='h-11 px-5 bg-black text-white rounded-xl text-xs font-bold outline-none border-none hover:opacity-80 transition-opacity ml-auto'
                            >
                                <option value="">Sort By</option>
                                <option value="lowtohigh">Low to High</option>
                                <option value="hightolow">High to Low</option>
                            </select>
                            <button
                                onClick={resetFilters}
                                className='h-10 px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors border border-transparent hover:border-zinc-100'
                            >
                                Reset <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between'>
                        <div className='space-y-4 py-2'>
                            <div className='space-y-1'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Price Min</p>
                                <div className='flex justify-between items-end'>
                                    <span className='text-sm font-bold'>₹{minPrice}</span>
                                    <input
                                        type="range" min="0" max={absoluteMax} value={minPrice}
                                        onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), maxPrice))}
                                        className='w-2/3 h-1 accent-black appearance-none bg-gray-100 rounded-full'
                                    />
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Price Max</p>
                                <div className='flex justify-between items-end'>
                                    <span className='text-sm font-bold'>₹{maxPrice}</span>
                                    <input
                                        type="range" min="0" max={absoluteMax} value={maxPrice}
                                        onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), minPrice))}
                                        className='w-2/3 h-1 accent-black appearance-none bg-gray-100 rounded-full'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Product Grid & Loading Logic --- */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10'>
                    {loading ? (
                        <WishlistSkeleton />
                    ) : products.length > 0 ? (
                        products.map((p) => (
                            <div key={p._id} className="transition-all duration-300 hover:-translate-y-2">
                                <ProductCard product={p} />
                            </div>
                        ))
                    ) : (
                        <div className='col-span-full py-20 text-center'>
                            <Filter size={32} className='mx-auto text-gray-100 mb-4' />
                            <p className='text-gray-400 font-medium italic'>No matches found in this range.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
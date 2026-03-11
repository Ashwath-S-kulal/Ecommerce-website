import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { Search, RotateCcw, Filter, ChevronRight, ChevronLeft, Sparkles, SlidersHorizontal, X } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

const WishlistSkeleton = () => (
    <>
        {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm w-full">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                    <Skeleton className="h-8 w-full rounded-xl mt-3" />
                </div>
            </div>
        ))}
    </>
);

const HorizontalScroller = ({ title, products, icon: Icon }) => (
    <div className='mt-16 mb-10'>
        <div className='flex items-center gap-2 mb-6 px-1'>
            {Icon && <Icon size={18} className="text-black" />}
            <h2 className='text-sm md:text-lg font-black tracking-tight text-gray-900 uppercase'>{title}</h2>
        </div>
        <div className='flex overflow-x-auto gap-1 pb-4 no-scrollbar snap-x scroll-smooth'>
            {products.map((p) => (
                <div key={p._id} className="min-w-[150px] md:min-w-[240px] snap-start transition-all duration-300 hover:-translate-y-1">
                    <ProductCard product={p} />
                </div>
            ))}
        </div>
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
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [absoluteMax, setAbsoluteMax] = useState(0)

    const dispatch = useDispatch()
    const categories = ["All", ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    const brands = ["All", ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);



    const getAllProducts = async (pageNumber = 1) => {
        try {

            if (pageNumber === 1) {
                setLoading(true);      
            } else {
                setLoadingMore(true);  
            }
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URI}/api/product/getallproducts`,
                {
                    params: {
                        page: pageNumber,
                        limit: 12
                    }
                }
            );
            if (res.data.success) {
                const fetched = res.data.products;
                if (pageNumber === 1) {
                    setAllProducts(fetched);
                    dispatch(setProducts(fetched));
                } else {
                    const updated = [...products, ...fetched];
                    setAllProducts(updated);
                    dispatch(setProducts(updated));
                }
                setHasMore(res.data.hasMore);
                if (pageNumber === 1) {
                    const highest = Math.max(...fetched.map(p => p.productPrice), 0);
                    setAbsoluteMax(highest);
                    setMaxPrice(highest);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        getAllProducts(1);
    }, []);

    const loadMoreProducts = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        getAllProducts(nextPage);
    };

    useEffect(() => {
        if (allProducts.length === 0 && !loading) return
        let filtered = [...allProducts]
        if (search.trim() !== "") filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        if (category !== "All") filtered = filtered.filter(p => p.category === category)
        if (brand !== "All") filtered = filtered.filter(p => p.brand === brand)
        filtered = filtered.filter(p => p.productPrice >= minPrice && p.productPrice <= maxPrice)
        if (sortOrder === "lowtohigh") filtered.sort((a, b) => a.productPrice - b.productPrice)
        else if (sortOrder === "hightolow") filtered.sort((a, b) => b.productPrice - a.productPrice)
        dispatch(setProducts(filtered))
    }, [search, category, brand, sortOrder, minPrice, maxPrice, allProducts, dispatch])

    useEffect(() => { getAllProducts(); }, []);



    const recentArrivals = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    const resetFilters = () => {
        setSearch(""); setCategory("All"); setBrand("All");
        setMinPrice(0); setMaxPrice(absoluteMax); setSortOrder("");
    };

    return (
        <div className='min-h-screen bg-[#F9FAFB] pt-20 pb-10 px-4 md:px-6'>
            <div className='max-w-full mx-3 md:mx-10'>
                <div className='flex items-end justify-between mb-8 px-1'>
                    <div className='flex items-center gap-2'>
                        <div className='w-1 h-6 bg-black rounded-full' />
                        <h1 className='text-xl md:text-3xl font-black tracking-tight text-gray-900 '>Products</h1>
                    </div>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        {/* Changed .length() to .length and added ?. for safety */}
                        Products found {products?.length || 0}
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 mb-12'>
                    <div className='lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-3 md:p-5 shadow-sm flex flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='relative flex-1'>
                                <Search className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='w-full bg-transparent border-b border-gray-50 pb-2 pl-7 outline-none focus:border-black transition-all text-sm font-medium'
                                />
                            </div>
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className='lg:hidden p-2.5 bg-black text-white rounded-xl active:scale-95 transition-transform'>
                                {isFilterOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
                            </button>
                        </div>

                        <div className={`${isFilterOpen ? 'flex' : 'hidden'} lg:flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200`}>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className='h-9 flex-1 lg:flex-none px-3 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-500 outline-none hover:bg-gray-100 transition-colors'>
                                <option value="All">All Categories</option>
                                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={brand} onChange={(e) => setBrand(e.target.value)} className='h-9 flex-1 lg:flex-none px-3 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-500 outline-none hover:bg-gray-100 transition-colors'>
                                <option value="All">All Brands</option>
                                {brands.filter(b => b !== "All").map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className='h-9 flex-1 lg:flex-none px-3 bg-black text-white rounded-lg text-[11px] font-bold outline-none ml-auto'>
                                <option value="">Sort By</option>
                                <option value="lowtohigh">Price: Low to High</option>
                                <option value="hightolow">Price: High to Low</option>
                            </select>
                            <button onClick={resetFilters} className='h-9 px-3 text-[10px] font-black uppercase text-gray-400 hover:text-red-500 flex items-center gap-2'>
                                <RotateCcw size={12} />
                            </button>
                        </div>
                    </div>

                    <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm`}>
                        <div className='space-y-4'>
                            {[{ label: 'Min', val: minPrice, setter: setMinPrice, limit: maxPrice, type: 'min' }, { label: 'Max', val: maxPrice, setter: setMaxPrice, limit: minPrice, type: 'max' }].map((p, i) => (
                                <div key={i} className='space-y-1'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>{p.label} Price</p>
                                        <span className='text-[11px] font-bold text-black'>₹{p.val}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max={absoluteMax} value={p.val}
                                        onChange={(e) => p.setter(p.type === 'min' ? Math.min(parseInt(e.target.value), p.limit) : Math.max(parseInt(e.target.value), p.limit))}
                                        className='w-full h-1 accent-black appearance-none bg-gray-100 rounded-full'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-2 '>
                    {loading ? (
                        <WishlistSkeleton />
                    ) : products.length > 0 ? (
                        products.map((p) => (
                            <div key={p._id} className="transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]">
                                <ProductCard product={p} />

                            </div>
                        ))
                    ) : (
                        <div className='col-span-full py-20 text-center'>
                            <Filter size={24} className='mx-auto text-gray-200 mb-3' />
                            <p className='text-gray-400 text-sm italic'>No matches found.</p>
                        </div>
                    )}
                </div>

                {!loading && hasMore && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={loadMoreProducts}
                            disabled={loadingMore}
                            className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loadingMore ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}


                {!loading && recentArrivals.length > 0 && (
                    <HorizontalScroller title="Recent Arrivals" products={recentArrivals} icon={Sparkles} />
                )}
            </div>

            <style jsx global>{`
                @media (max-width: 767px) {
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                }
                @media (min-width: 768px) {
                    .no-scrollbar::-webkit-scrollbar { display: block; height: 5px; }
                    .no-scrollbar::-webkit-scrollbar-track { background: #f9f9f9; border-radius: 10px; }
                    .no-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
                    .no-scrollbar::-webkit-scrollbar-thumb:hover { background: #000; }
                }
            `}</style>
        </div>
    )
}
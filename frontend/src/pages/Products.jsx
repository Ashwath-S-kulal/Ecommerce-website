import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { Search, RotateCcw, Filter, ChevronRight, ChevronLeft, Hash, Sparkles, SlidersHorizontal, X } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

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

const HorizontalScroller = ({ title, products, icon: Icon }) => (
    <div className='mt-24 mb-10'>
        <div className='flex items-center justify-between mb-8 px-2'>
            <div className='flex items-center gap-3'>
                {Icon && <Icon size={22} className="text-black" />}
                <h2 className='text-xl font-black tracking-tight text-gray-900 uppercase'>{title}</h2>
            </div>
        </div>
        <div className='flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x scroll-smooth'>
            {products.map((p) => (
                <div key={p._id} className="min-w-[200px] md:min-w-[260px] snap-start transition-all duration-300 hover:-translate-y-2">
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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerRow, setItemsPerRow] = useState(6);

    const dispatch = useDispatch()

    const categories = ["All", ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    const brands = ["All", ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

    // Detect screen size to maintain "Two Rows" logic
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1280) setItemsPerRow(6);
            else if (width >= 1024) setItemsPerRow(5);
            else if (width >= 768) setItemsPerRow(4);
            else if (width >= 640) setItemsPerRow(3);
            else setItemsPerRow(2);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/product/getallproducts`);
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
        setCurrentPage(1);
    }, [search, category, brand, sortOrder, minPrice, maxPrice, allProducts, dispatch])

    useEffect(() => { getAllProducts(); }, []);

    const itemsPerPage = itemsPerRow * 2;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const getPaginationRange = () => {
        const range = [];
        const delta = 1;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }
        return range;
    };

    const handlePageChange = (page) => {
        if (page === "...") return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const recentArrivals = [...allProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

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
                <div className='flex items-center justify-between mb-10'>
                    <div className='flex items-center gap-3'>
                        <div className='w-1 h-8 bg-black rounded-full' />
                        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Products</h1>
                    </div>
                    <p className='hidden sm:block text-xs font-medium text-gray-400 uppercase tracking-tighter'>
                        Page {currentPage} of {totalPages || 1} — Total: {products?.length}
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-16'>
                    <div className='lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-4 lg:p-6 shadow-sm flex flex-col gap-6'>
                        <div className='flex items-center gap-4'>
                            <div className='relative flex-1'>
                                <Search className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-300' size={20} />
                                <input
                                    type="text"
                                    placeholder="Search inventory..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='w-full bg-transparent border-b border-gray-100 pb-3 pl-8 outline-none focus:border-black transition-all text-sm font-medium placeholder:text-gray-200'
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className='lg:hidden p-3 bg-black text-white rounded-2xl hover:opacity-80 transition-all'
                            >
                                {isFilterOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
                            </button>
                        </div>

                        <div className={`
                            ${isFilterOpen ? 'flex' : 'hidden'} 
                            lg:flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-300
                        `}>
                            <select
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className='h-11 flex-1 lg:flex-none px-5 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 outline-none border-none hover:bg-gray-100 transition-colors'
                            >
                                <option value="All">All Categories</option>
                                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select
                                value={brand} onChange={(e) => setBrand(e.target.value)}
                                className='h-11 flex-1 lg:flex-none px-5 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 outline-none border-none hover:bg-gray-100 transition-colors'
                            >
                                <option value="All">All Brands</option>
                                {brands.filter(b => b !== "All").map(b => <option key={b} value={b}>{b}</option>)}
                            </select>

                            <select
                                value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                className='h-11 flex-1 lg:flex-none px-5 bg-black text-white rounded-xl text-xs font-bold outline-none border-none hover:opacity-80 transition-opacity ml-auto'
                            >
                                <option value="">Sort By</option>
                                <option value="lowtohigh">Low to High</option>
                                <option value="hightolow">High to Low</option>
                            </select>

                            <button
                                onClick={resetFilters}
                                className='h-10 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors border border-transparent hover:border-zinc-100 w-full lg:w-auto'
                            >
                                Reset <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>
                    <div className={`
                        bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between
                        ${isFilterOpen ? 'block' : 'hidden'} lg:block
                    `}>
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

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 min-h-[400px]'>
                    {loading ? (
                        <WishlistSkeleton />
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((p) => (
                            <div key={p._id} className="transition-all duration-300 hover:-translate-y-2">
                                <ProductCard product={p} />
                            </div>
                        ))
                    ) : (
                        <div className='col-span-full py-20 text-center'>
                            <Filter size={32} className='mx-auto text-gray-100 mb-4' />
                            <p className='text-gray-400 font-medium italic'>No matches found.</p>
                        </div>
                    )}
                </div>

                {!loading && totalPages > 1 && (
                    <div className='mt-20 flex justify-center items-center gap-2'>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className='p-2 rounded-xl border border-gray-100 bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm'
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className='flex items-center gap-1'>
                            {getPaginationRange().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                        ? 'bg-black text-white shadow-md'
                                        : page === '...'
                                            ? 'cursor-default text-gray-400'
                                            : 'bg-white border border-gray-100 text-gray-600 hover:border-black'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className='p-2 rounded-xl border border-gray-100 bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm'
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {!loading && recentArrivals.length > 0 && (
                    <HorizontalScroller
                        title="Recent Arrivals"
                        products={recentArrivals}
                        icon={Sparkles}
                    />
                )}
            </div>

            <style jsx global>{`
    /* 1. Default: Hide scrollbar for mobile/small screens (below 768px) */
    @media (max-width: 767px) {
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    }

    /* 2. MD Breakpoint and up: Show Beautiful Custom Scrollbar */
    @media (min-width: 768px) {
        /* Define the width/height of the scrollbar */
        .no-scrollbar::-webkit-scrollbar {
            display: block; /* Show it */
            height: 6px;    /* Height for horizontal scroll */
            width: 6px;     /* Width for vertical scroll */
        }

        /* The background of the scrollbar area */
        .no-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        /* The actual draggable handle */
        .no-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d1d1; /* Subtle gray */
            border-radius: 10px;
            transition: background 0.3s ease;
        }

        /* Hover effect on the handle */
        .no-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #000000; /* Turns black on hover to match your theme */
        }
        
        /* Optional: Add padding to the container to ensure scrollbar doesn't overlap content */
        .no-scrollbar {
            padding-bottom: 12px;
            scrollbar-width: thin; /* For Firefox */
            scrollbar-color: #d1d1d1 #f1f1f1; /* For Firefox */
        }
    }
`}</style>
        </div>
    )
}
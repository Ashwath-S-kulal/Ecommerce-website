import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

export default function Products() {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState('')
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            const res = await axios.get(`/api/product/getallproducts`);
            console.log("Response:", res.data);
            if (res.data.success) {
                setAllProducts(res.data.products);
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "Failed to fetch products");
        }
        finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (allProducts.length === 0) return

        let filtered = [...allProducts]
        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }
        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand)
        }
        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowtohigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        }
        else if (sortOrder === "hightolow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }
        dispatch(setProducts(filtered))
    }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className='pt-20 pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
                <FilterSidebar
                    allProducts={allProducts}
                    priceRange={priceRange}
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    setPriceRange={setPriceRange}
                />
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowtohigh">Price: Low To High</SelectItem>
                                    <SelectItem value="hightolow">Price: High To Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {Array.isArray(products) && products.length > 0 ? (
                            products
                                .filter(product => product && product._id) // 🔥 IMPORTANT
                                .map((product) => (
                                    <ProductCard key={product._id} product={product} loading={loading} />
                                ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center">No products found.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

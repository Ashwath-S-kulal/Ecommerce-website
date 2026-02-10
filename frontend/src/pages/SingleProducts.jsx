import ProductCard from '@/components/ProductCard'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import BreadCrumps from '@/components/ui/BreadCrumps'
import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Truck, ShieldCheck } from 'lucide-react'

export default function SingleProducts() {
    const { id: productId } = useParams()
    const { products } = useSelector((store) => store.product)
    const product = products.find((item) => item._id === productId)

    const similarProducts = useMemo(() => {
        if (!product) return []
        return products
            .filter((p) => p.category === product.category && p._id !== productId)
            .slice(0, 24) 
    }, [products, product, productId])

    const suggestedProducts = useMemo(() => {
        if (!product) return []
        return products
            .filter((p) => p.category !== product.category && p._id !== productId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 12) 
    }, [products, product, productId])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productId])

    if (!product) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse font-black text-slate-200 text-6xl italic">LOADING...</div>
        </div>
    )

    return (
        <div className='min-h-screen bg-[#FDFDFD] selection:bg-pink-100'>
            <div className='pt-24 pb-20 max-w-screen mx-auto px-6'>
                
                <div className="mb-8 opacity-60 hover:opacity-100 transition-opacity">
                    <BreadCrumps product={product} />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
                    <div className='lg:col-span-5'>
                        <div className="sticky top-28">
                            <ProductImg images={product.productImg} product={product} />
                        </div>
                    </div>

                    <div className='lg:col-span-7 flex flex-col gap-10'>
                        <section>
                            <ProductDesc product={product} />
                        </section>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-amber-50 p-6 rounded-[32px] flex flex-col justify-between aspect-square lg:aspect-auto">
                                <Truck size={24} className="text-pink-400" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Shipping</p>
                                    <p className="text-xs font-bold">Fast boutique delivery within 3-5 days.</p>
                                </div>
                            </div>
                            <div className="bg-pink-50 p-6 rounded-[32px] text-pink-900 flex flex-col justify-between">
                                <ShieldCheck size={24} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Authenticity</p>
                                    <p className="text-xs font-bold">100% Certified Sanjeevini Quality.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {similarProducts.length > 0 && (
                    <div className="mt-20 border-t border-slate-100 pt-5">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                Similar <span className="font-serif italic text-pink-500">{product.category}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                            {similarProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-15  border-t border-slate-100 pt-5">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                            Wait! You Might Also <span className="font-serif italic text-pink-500">Love These</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                        {suggestedProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
import ProductCard from '@/components/ProductCard'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import BreadCrumps from '@/components/ui/BreadCrumps'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react'

export default function SingleProducts() {
    const { id: productId } = useParams()
    const { products } = useSelector((store) => store.product)
    const product = products.find((item) => item._id === productId)

    // Smooth scroll to top on product change
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

                {/* Main Content: Asymmetrical Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
                    
                    {/* Left: Image Section (Spans 7 columns) */}
                    <div className='lg:col-span-5'>
                        <div className="sticky top-28">
                            <ProductImg images={product.productImg} product={product} />
                        </div>
                    </div>

                    {/* Right: Info Section (Spans 5 columns) */}
                    <div className='lg:col-span-7 flex flex-col gap-10'>
                        <section className="">
                            <ProductDesc product={product} />
                        </section>

                        {/* Bento-style Info Cards */}
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

                {/* Bottom Section: Aesthetic Separation */}
                <div className=" border-t border-slate-100 pt-20">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">You Might Also <span className="font-serif italic text-pink-500">Adore</span></h2>
                    </div>
                    
                    {/* Placeholder for Related Products */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                        {products.filter(p => p._id !== productId).slice(0, 12).map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
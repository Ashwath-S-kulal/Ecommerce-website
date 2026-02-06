import ProductCard from '@/components/ProductCard'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import BreadCrumps from '@/components/ui/BreadCrumps'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function SingleProducts() {
    const params =useParams()
    const productId= params.id

    const {products} = useSelector((store)=>store.product)
    const product = products.find((item)=>item._id===productId)

  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto'>
      <BreadCrumps product={product}/>
      <div className='mt-10 grid grid-cols-2 items-start'>
        <ProductImg images={product.productImg}/>
        <ProductDesc product={product}/>
      </div>
    </div>
  )
}

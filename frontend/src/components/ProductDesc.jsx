import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setCart } from '@/redux/productSlice'

export default function ProductDesc({product}) {
   
const accessToken = localStorage.getItem('accessToken')
const dispatch = useDispatch()
const addToCart = async(productId)=>{
    try {
        const res = await axios.post('/api/cart/add', {productId},{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        if(res.data.success){
            toast.success('Product added to cart')
            dispatch(setCart(res.data.cart))
        }
    } catch (error) {
        console.log(error);
        
    }
}
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-3xl text-gray-800'>{product.productName}</h1>
        <p className='text-gray-600'>{product.category} | {product.brand}</p>

        <h2>₹ {product.productPrice}</h2>
        <p className='line-clamp-6'>{product.productDesc}</p>
        <div className='flex gap-2 items-center w-[300px]'>
            <p className='text-gray-800 font-semibold'>Quantity :</p>
            <Input type='number' defaultValue={1} className='w-16'/>
        </div>
        <Button onClick={()=>addToCart(product._id)} className="bg-pink-600">Add to Cart</Button>
    </div>
  )
}

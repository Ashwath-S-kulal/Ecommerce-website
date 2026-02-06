import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2 } from 'lucide-react';
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';


export default function Cart() {

  const { cart } = useSelector(store => store.product);
  const subTotal = cart.totalPrice
  const shipping = subTotal > 299 ? 0 : 10;
  const tax= subTotal * 0.05;
  const total = subTotal + shipping + tax;
  const dispatch = useDispatch();

  const API= "/api/cart";
  const accessToken = localStorage.getItem('accessToken');

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API}/get`, {
        headers:{
          Authorization : `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`,{ productId, type }, {
        headers:{
          Authorization : `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers:{
          Authorization : `Bearer ${accessToken}`,
        },
        data: {productId}
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
        toast.success("Product removed from cart")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    loadCart();
  },[dispatch])

  return (
    <div className='pt-20 bg-gray-50 min-h-screen px-4'>
      {
        cart?.items?.length > 0 ? 
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6'>Your Cart</h1>
          <div className='max-w-7xl mx-auto flex gap-7'>
            <div className='flex flex-col gap-5 flex-1'>
              {cart?.items.map((product, index) => {
                return <Card key={index}>
                  <div className='flex justify-between items-center pr-7'>
                    <div className='flex items-center w-[350px]'>
                      <img src={product.productId?.productImg?.[0]?.url } alt='img' className='w-24 h-24 object-cover rounded-lg' />
                      <div className='w-[280px]'>
                        <h1 className='font-semibold truncate'>{product.productId.productName}</h1>
                        <h2 className='font-bold text-pink-600'>₹{product.productId.productPrice}</h2>
                      </div>
                    </div>
                    <div className='flex gap-5 items-center'>
                      <Button variant="outline" onClick={()=>handleUpdateQuantity(product.productId._id, 'decrease')}>-</Button>
                      <span>{product.quantity}</span>
                      <Button variant="outline" onClick={()=>handleUpdateQuantity(product.productId._id, 'increase')}>+</Button>
                    </div>
                    <p>₹{(product.productId.productPrice)*(product.quantity)}</p>
                    <p onClick={()=>handleRemove(product.productId._id)} className='flex text-red-500 items-center gap-1 cursor-pointer'><Trash2></Trash2> Remove</p>
                  </div>
                </Card>
              })}
            </div>
            <div> 
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex justify-between mb-2'>
                    <span>Subtotal ({cart.items.length} items) </span>
                    <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between mb-2'> 
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className='flex justify-between mb-2'> 
                    <span>Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className='space-y-3 pt-4'>
                    <div className='flex space-x-2'>
                      <Input placeholder="promo code"></Input>
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button className='w-full bg-pink-600 text-white'>PLACE ORDER</Button>
                    <Button variant='outline' className="w-full bg-transparent">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div> : <div className='flex flex-col items-center justify-center gap-6 mt-20'>
          <div className='bg-gray-100 p-10 rounded-full'>
            <ShoppingBag size={80} className='text-gray-300' />
          </div>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-800'>Your cart is empty</h2>
            <p className='text-gray-500 mt-2'>Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Button asChild className="bg-pink-600 hover:bg-pink-700 px-8">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
    }
    </div>

  )
}

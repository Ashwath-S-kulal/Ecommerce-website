import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ShieldCheck, Heart, Truck, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';

export default function Cart() {
  const { cart } = useSelector(store => store.product);
  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 5000 || subTotal === 0 ? 0 : 50;
  const tax = subTotal * 0.00;
  const total = subTotal + shipping + tax;
  const dispatch = useDispatch();

  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min((subTotal / freeShippingThreshold) * 100, 100);

  const API = "/api/cart";
  const accessToken = localStorage.getItem('accessToken');

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId }
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className='pt-20 pb-10 bg-[#f8f9fa] min-h-screen px-3 lg:px-6 mb-10'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-screen mx-auto'>
          <div className="flex items-end justify-between mb-5 border-b pb-4 border-gray-200">
            <div>
              <h1 className='text-3xl font-black text-gray-900 tracking-tighter'>My Cart</h1>
              <p className="text-[11px] pt-5 font-bold text-gray-400 uppercase tracking-widest">{cart?.items?.length} Units</p>
            </div>
            <Link to="/products" className="flex items-center text-[11px] font-bold uppercase tracking-widest text-pink-600 hover:opacity-70 transition-opacity">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Add More
            </Link>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
            <div className='lg:col-span-8 space-y-3'>
              <div className="bg-white p-3 rounded-xl border border-pink-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1 text-pink-600"><Truck size={14} /> {subTotal >= freeShippingThreshold ? "Free Shipping Unlocked!" : "Shipping Progress"}</span>
                  <span className="text-gray-400">Target: ₹{freeShippingThreshold}</span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full transition-all duration-500" style={{ width: `${progressToFreeShipping}%` }} />
                </div>
              </div>

              {cart?.items.map((product, index) => (
                <Card key={index} className="overflow-hidden border border-gray-100 shadow-sm bg-white rounded-2xl">
                  <div className='flex p-3 gap-4 items-center'>
                    <img
                      src={product?.productId?.productImg?.[0]?.url}
                      alt='img'
                      className='w-20 h-24 object-cover rounded-lg bg-gray-50'
                    />

                    <div className='flex-1 min-w-0'>
                      <div className="flex justify-between items-start">
                        <h2 className='font-bold text-sm text-gray-800 truncate max-w-[600px]'>
                          {product?.productId?.productName}
                        </h2>
                        <div >
                          <button onClick={() => handleRemove(product?.productId?._id)} className="text-red-400 hover:text-red-600 font-semibold transition-colors flex gap-1 items-center">
                            <Trash2 size={16} /><span className='text-sm'>Remove</span>
                          </button>
                        </div>

                      </div>
                      <p className='text-[11px] font-medium text-gray-400'>{product.productId?.category}</p>

                      <div className='flex items-center justify-between mt-3'>
                        <div className="flex items-center border border-gray-100 rounded-md bg-gray-50/50 scale-90 -ml-2">
                          <button
                            onClick={() => handleUpdateQuantity(product?.productId?._id, 'decrease')}
                            className="p-1.5 hover:text-pink-600 disabled:opacity-30"
                            disabled={product?.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className='w-8 text-center text-xs font-bold text-gray-700'>{product?.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(product?.productId._id, 'increase')}
                            className="p-1.5 hover:text-pink-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className='text-sm font-black text-gray-900'>
                          ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className='lg:col-span-4'>
              <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden sticky top-24">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Order Summary</h3>

                  <div className="space-y-2.5">
                    <div className='flex justify-between text-[13px] text-gray-500'>
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className='flex justify-between text-[13px] text-gray-500'>
                      <span>Shipping</span>
                      <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className='flex justify-between text-[13px] text-gray-500'>
                      <span>Estimated Tax</span>
                      <span className="font-bold text-gray-900">₹{tax.toFixed(0)}</span>
                    </div>
                  </div>

                  <Separator className="bg-gray-50" />

                  <div className='flex justify-between items-center py-1'>
                    <span className='text-sm font-black uppercase tracking-widest'>Total</span>
                    <span className='text-xl font-black text-pink-600'>₹{Math.round(total).toLocaleString('en-IN')}</span>
                  </div>

                  <div className='pt-2 space-y-3'>
                    <Button
                      asChild // Use asChild to let Link handle the navigation
                      className='w-full h-12 text-xs font-black tracking-[0.1em] bg-gray-900 hover:bg-pink-600 rounded-xl transition-all shadow-md active:scale-95'
                    >
                      <Link to="/address">PLACE ORDER</Link>
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold tracking-tighter">
                      <ShieldCheck size={12} className="text-gray-200" />
                      128-BIT ENCRYPTED SECURE CHECKOUT
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-gray-100 pb-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
                My Cart <span className="bg-rose-100 text-rose-600 text-xs px-3 py-1 rounded-full font-bold">{cart?.items?.length || 0}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">Items you've saved for purchase.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full border-gray-200 px-8 hover:bg-black hover:text-white transition-all">
              <Link to="/products">Browse More</Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-50">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={28} className="text-rose-400 fill-rose-100" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your Cart is empty</h2>
            <p className="text-gray-400 text-sm mt-2 mb-8">Your Cart tray is waiting for items.</p>
            <Link to="/products">
              <Button className="bg-black text-white rounded-full px-10 py-6 hover:bg-rose-600 transition-all">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
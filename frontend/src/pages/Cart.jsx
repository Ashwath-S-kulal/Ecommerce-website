import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ArrowLeft, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
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

  const API = `${import.meta.env.VITE_BASE_URI}/api/cart`;
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
    <div className='pt-20 pb-10 bg-[#f8f9fa] min-h-screen px-3 md:px-6 mb-10'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-[1200px] mx-auto'>
          <div className="flex flex-row items-center justify-between mb-6 border-b pb-4 border-gray-200">
            <div>
              <h1 className='text-xl md:text-3xl font-black text-gray-900 tracking-tighter'>My Cart</h1>
              <p className="text-[11px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">{cart?.items?.length} Items</p>
            </div>
            <Link to="/products" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-pink-600 hover:text-pink-700 transition-colors">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Add More
            </Link>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
            <div className='lg:col-span-8 space-y-4'>
              <div className="bg-white p-4 rounded-xl border border-pink-50 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-pink-600">
                    <Truck size={15} />
                    {subTotal >= freeShippingThreshold ? "Free Shipping Unlocked!" : "Shipping Progress"}
                  </span>
                  <span className="text-gray-400">Target: ₹{freeShippingThreshold}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full transition-all duration-700 ease-out"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {cart?.items.map((product, index) => (
                  <Card key={index} className="overflow-hidden border-none shadow-sm bg-white rounded-sm">
                    <div className='flex p-3 py-0 md:p-4 gap-3 md:gap-5 items-center'>
                      <img
                        src={product?.productId?.productImg?.[0]?.url}
                        alt='img'
                        className='w-20 h-24 md:w-24 md:h-32 object-contain bg-gray-50 flex-shrink-0'
                      />

                      <div className='flex-1 min-w-0'>
                        <div className="flex justify-between items-start mb-1">
                          <h2 className='font-bold text-[13px] md:text-base text-gray-800 line-clamp-1 pr-2'>
                            {product?.productId?.productName}
                          </h2>
                          <p className='text-[12px] md:text-sm font-black text-gray-900 whitespace-nowrap'>
                            ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <p className='text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-tight mb-4'>
                          {product.productId?.category}
                        </p>

                        <div className='flex items-center justify-between'>
                          <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50/80 p-0.5">
                            <button
                              onClick={() => handleUpdateQuantity(product?.productId?._id, 'decrease')}
                              className="p-1.5 md:p-2 hover:text-pink-600 disabled:opacity-30 transition-colors"
                              disabled={product?.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className='w-7 text-center text-xs font-black text-gray-700'>{product?.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(product?.productId._id, 'increase')}
                              className="p-1.5 md:p-2 hover:text-pink-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(product?.productId?._id)}
                            className="text-red-500 hover:text-red-600 cursor-pointer transition-colors flex gap-1.5 items-center group"
                          >
                            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                            <span className='text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:inline'>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className='lg:col-span-4'>
              <Card className="border-none shadow-xl lg:shadow-md bg-white overflow-hidden sticky top-24">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Checkout Summary</h3>

                  <div className="space-y-3">
                    <div className='flex justify-between text-[13px]'>
                      <span className="text-gray-500 font-medium">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className='flex justify-between text-[13px]'>
                      <span className="text-gray-500 font-medium">Shipping</span>
                      <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className='flex justify-between text-[13px]'>
                      <span className="text-gray-500 font-medium">Estimated Tax</span>
                      <span className="font-bold text-gray-900">₹{tax.toFixed(0)}</span>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className='flex justify-between items-center py-1'>
                    <span className='text-xs font-black uppercase tracking-widest text-gray-900'>Total Amount</span>
                    <span className='text-2xl font-black text-pink-600 tracking-tighter'>
                      ₹{Math.round(total).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="relative flex items-center justify-between p-2 rounded-sm border-2 border-gray-100 bg-white/50 hover:border-pink-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-colors">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                        <p className="text-[10px] text-gray-400 font-medium">Pay when your order arrives</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full border-2 border-pink-500 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    </div>
                  </div>

                  <div className='pt-2 space-y-4'>
                    <Button
                      asChild
                      className='w-full h-14 text-[11px] font-black tracking-[0.15em] bg-gray-900 hover:bg-pink-600 transition-all shadow-lg active:scale-95'
                    >
                      <Link to="/address">PLACE ORDER</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-row items-center justify-between mb-6 border-b pb-4 border-gray-200">
            <div>
              <h1 className='text-2xl md:text-3xl font-black text-gray-900 tracking-tighter'>My Cart</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cart?.items?.length} Items</p>
            </div>
            <Link to="/products" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-pink-600 hover:text-pink-700 transition-colors">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Add More
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center py-32 bg-white shadow-sm border border-gray-50">
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
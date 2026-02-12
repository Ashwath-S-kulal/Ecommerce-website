import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addAddress, deleteAddress, setSelectedAddress } from "@/redux/productSlice";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Trash2, Plus, ArrowRight, Home, ShoppingBag, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "", street: "", city: "", state: "", zip: "", country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector((store) => store.product);

  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 5000 ? 0 : 50;
  const tax = Number((subtotal * 0.00).toFixed(2));
  const total = subtotal + shipping + tax;

  const handleCheckoutTrigger = () => {
    if (selectedAddress === null || !addresses[selectedAddress]) {
      toast.error("Please select an address");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleFinalCheckout = async () => {
    setLoading(true);
    const orderData = {
      products: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      address: addresses[selectedAddress],
    };

    try {
      const res = await axios.post(
        "/api/order/create",
        orderData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsConfirmOpen(false); 
        toast.success("Order placed successfully");
        navigate(`/ordersuccess/${res.data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 mt-20">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Checkout <span className="text-pink-500 italic font-serif">Process</span>
          </h1>
          <p className="text-slate-500 font-medium">Confirm your delivery details and finalize your order.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              {showForm ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                      <MapPin size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">New Delivery Address</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="fullName" placeholder="Full Name" onChange={handleChange} className="rounded-xl" />
                    <Input name="phone" placeholder="Phone Number" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <Input name="email" placeholder="Email Address" onChange={handleChange} className="rounded-xl" />
                  <Input name="street" placeholder="Street Address" onChange={handleChange} className="rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="city" placeholder="City" onChange={handleChange} className="rounded-xl" />
                    <Input name="state" placeholder="State" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="zip" placeholder="Zip Code" onChange={handleChange} className="rounded-xl" />
                    <Input name="country" placeholder="Country" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="flex-1 bg-slate-900 rounded-2xl h-12 font-bold">Save Address</Button>
                    {addresses.length > 0 && (
                      <Button variant="ghost" onClick={() => setShowForm(false)} className="h-12 px-6 rounded-2xl font-bold">Cancel</Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Home size={20} className="text-pink-500" /> Saved Addresses
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-pink-600 font-bold rounded-full">
                      <Plus size={16} className="mr-1" /> Add New
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {addresses.map((addr, index) => (
                      <div
                        key={index}
                        onClick={() => dispatch(setSelectedAddress(index))}
                        className={`relative group border-2 p-5 rounded-[24px] transition-all cursor-pointer ${
                          selectedAddress === index ? "border-pink-500 bg-pink-50/30" : "border-slate-100 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-black text-slate-800">{addr.fullName}</p>
                            <p className="text-slate-500 text-sm">{addr.street}, {addr.city}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(index)); }} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {selectedAddress === index && (
                          <div className="absolute top-4 right-4 w-4 h-4 bg-pink-500 rounded-full border-4 border-white animate-in zoom-in" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleCheckoutTrigger} 
                    disabled={selectedAddress === null}
                    className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[20px] font-black text-lg shadow-xl"
                  >
                    Complete Purchase <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="rounded-[32px] border-slate-200 overflow-hidden shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                <CardTitle className="text-lg font-black uppercase tracking-widest text-slate-500">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Shipping Fee</span>
                  <span className={`${shipping === 0 ? 'text-emerald-500' : 'text-slate-900'} font-bold`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Estimated Tax</span>
                  <span className="text-slate-900 font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-900">Total Amount</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8 border-none">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-2">
              <ShoppingBag size={32} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
              Confirm Order
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              You are placing an order for <span className="text-slate-900 font-bold">₹{total.toLocaleString()}</span>. 
              Please confirm your details are correct.
            </DialogDescription>
          </DialogHeader>

          {selectedAddress !== null && addresses[selectedAddress] && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 my-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-400 mt-0.5" />
                <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                  <p className="text-slate-900 uppercase tracking-tighter mb-1">Delivering To:</p>
                  {addresses[selectedAddress].fullName}<br />
                  {addresses[selectedAddress].street}, {addresses[selectedAddress].city}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={loading} className="flex-1 h-12 rounded-xl font-bold">
              Cancel
            </Button>
            <Button onClick={handleFinalCheckout} disabled={loading} className="flex-1 cursor-pointer h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm & Buy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
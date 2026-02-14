import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addAddress, deleteAddress, setSelectedAddress, setAddresses } from "@/redux/productSlice";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapPin, Trash2, Plus, ArrowRight, Home, ShoppingBag, Loader2, Edit2 } from "lucide-react";
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
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 5000 ? 0 : 50;
  const tax = Number((subtotal * 0.00).toFixed(2));
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/address/get`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAddresses(res.data.addresses));
        if (res.data.addresses.length === 0) setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken, dispatch]);

  const handleEditClick = (e, addr) => {
    e.stopPropagation();
    setEditingId(addr._id);
    setFormData(addr);
    setShowForm(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URI}/api/address/update/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (res.data.success) {
          fetchAddresses();
          toast.success("Address updated");
        }
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/address/add`, formData, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(addAddress(res.data.address));
          toast.success("Address saved successfully");
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
  };

  const handleDelete = async (e, addressId) => {
    e.stopPropagation();
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URI}/api/address/remove/${addressId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(deleteAddress(addressId));
        fetchAddresses();
        toast.success("Address deleted");
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete address");
    }
  };

  const handleCheckoutTrigger = () => {
    const exists = addresses.find(a => a._id === selectedAddress);
    if (!selectedAddress || !exists) {
      toast.error("Please select a delivery address");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleFinalCheckout = async () => {
    setLoading(true);
    const selectedObj = addresses.find(a => a._id === selectedAddress);
    const orderData = {
      products: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      address: selectedObj,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/order/create`, orderData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (res.data.success) {
        setIsConfirmOpen(false);
        toast.success("Order placed successfully!");
        navigate(`/ordersuccess/${res.data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-pink-500" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10 pt-16 md:pt-24 lg:pt-28 mt-5 mb-15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6 md:space-y-8">
                <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl md:text-4xl">
            Checkout <span className="text-pink-500 italic font-serif">Process</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Complete your order by providing delivery details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
                    <div className="order-2 lg:order-1 lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm">
              
              {showForm ? (
                <div className="space-y-5 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      {editingId ? "Edit Address" : "New Delivery Address"}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Full Name</label>
                      <Input name="fullName" value={formData.fullName} placeholder="Ex: John Doe" onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Phone</label>
                      <Input name="phone" value={formData.phone} placeholder="Ex: +91 98765..." onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Email</label>
                    <Input name="email" value={formData.email} placeholder="Ex: john@example.com" onChange={handleChange} className="rounded-xl h-11" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Street Address</label>
                    <Input name="street" value={formData.street} placeholder="Apartment, suite, unit, etc." onChange={handleChange} className="rounded-xl h-11" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">City</label>
                      <Input name="city" value={formData.city} placeholder="City" onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">State</label>
                      <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Zip Code</label>
                      <Input name="zip" value={formData.zip} placeholder="Zip" onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Country</label>
                      <Input name="country" value={formData.country} placeholder="Country" onChange={handleChange} className="rounded-xl h-11" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:flex-1 bg-slate-900 hover:bg-black rounded-xl md:rounded-2xl h-12 font-bold transition-all">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? "Update Address" : "Save Address"}
                    </Button>
                    <Button variant="ghost" onClick={resetForm} className="w-full sm:w-auto h-12 px-6 rounded-xl md:rounded-2xl font-bold">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Home size={18} className="text-pink-500" /> 
                      <span className="hidden xs:inline">Saved</span> Addresses
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-pink-600 font-bold rounded-full hover:bg-pink-50">
                      <Plus size={16} className="mr-1" /> Add New
                    </Button>
                  </div>

                  <div className="grid gap-3 md:gap-4">
                    {addresses.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                        <MapPin size={32} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm font-medium">No addresses saved yet</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => dispatch(setSelectedAddress(addr._id))}
                          className={`relative flex items-start gap-3 md:gap-4 group border-2 p-4 md:p-5 rounded-[20px] md:rounded-[24px] transition-all cursor-pointer select-none ${selectedAddress === addr._id
                            ? "border-pink-500 bg-pink-50/30 ring-1 ring-pink-500/10"
                            : "border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white"
                          }`}
                        >
                          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddress === addr._id
                            ? "bg-pink-500 border-pink-500 scale-110"
                            : "border-slate-300 bg-white"
                          }`}>
                            {selectedAddress === addr._id && (
                              <div className="w-2 bg-white h-2 rounded-full" />
                            )}
                          </div>

                          <div className="flex-1 flex justify-between items-start gap-2">
                            <div className="space-y-0.5">
                              <p className={`font-bold text-sm md:text-base transition-colors ${selectedAddress === addr._id ? "text-pink-700" : "text-slate-800"}`}>
                                {addr.fullName}
                              </p>
                              <p className="text-slate-500 text-[11px] md:text-sm leading-snug">
                                {addr.street}, {addr.city}, {addr.state} {addr.zip}
                              </p>
                              <p className="text-slate-400 text-[10px] md:text-xs font-semibold">{addr.phone}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-0.5">
                              <button
                                onClick={(e) => handleEditClick(e, addr)}
                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, addr._id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Button 
                    onClick={handleCheckoutTrigger} 
                    disabled={!selectedAddress || addresses.length === 0} 
                    className="w-full h-12 md:h-14 bg-slate-900 hover:bg-black text-white rounded-xl md:rounded-[20px] font-black text-base md:text-lg shadow-xl active:scale-95 transition-transform"
                  >
                    Complete Purchase <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-28">
            <Card className="rounded-[24px] md:rounded-[32px] border-slate-200 overflow-hidden shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 md:px-8 py-4 md:py-6">
                <CardTitle className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-500">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-3 md:space-y-4">
                <div className="flex justify-between text-slate-600 text-sm md:text-base font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm md:text-base font-medium">
                  <span>Shipping Fee</span>
                  <span className={`${shipping === 0 ? 'text-emerald-500' : 'text-slate-900'} font-bold`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm md:text-base font-medium">
                  <span>Estimated Tax</span>
                  <span className="text-slate-900 font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base md:text-lg font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic">₹{total.toLocaleString()}</span>
                </div>
                
                {selectedAddress && (
                  <div className="lg:hidden mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Ready to deliver to selected address</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="w-[92%] max-w-[425px] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border-none overflow-hidden">
          <DialogHeader className="flex flex-col items-center text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-1">
              <ShoppingBag size={24} className="md:w-8 md:h-8" />
            </div>
            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Confirm Order
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs md:text-sm font-medium">
              You are placing an order for <span className="text-slate-900 font-bold">₹{total.toLocaleString()}</span>. 
              Review your details before buying.
            </DialogDescription>
          </DialogHeader>

          {selectedAddress !== null && addresses.find(a => a._id === selectedAddress) && (
            <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 my-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 mt-1" />
                <div className="text-[11px] md:text-xs text-slate-600 font-semibold leading-relaxed">
                  <p className="text-slate-900 uppercase tracking-tighter mb-1 text-[10px]">Delivering To:</p>
                  <p className="text-slate-900 font-bold">{addresses.find(a => a._id === selectedAddress).fullName}</p>
                  <p className="line-clamp-2">{addresses.find(a => a._id === selectedAddress).street}, {addresses.find(a => a._id === selectedAddress).city}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-2">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={loading} className="w-full sm:flex-1 h-11 md:h-12 rounded-lg md:rounded-xl font-bold">
              Cancel
            </Button>
            <Button onClick={handleFinalCheckout} disabled={loading} className="w-full sm:flex-1 h-11 md:h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-lg md:rounded-xl font-bold shadow-lg shadow-pink-100 active:scale-95 transition-transform">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm & Buy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
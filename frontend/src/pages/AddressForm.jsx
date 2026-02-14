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
          const newData = fetchAddresses();
          dispatch(setAddresses(newData));
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

  if (fetching) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 mt-20">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Checkout <span className="text-pink-500 italic font-serif">Process</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              {showForm ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Address" : "New Delivery Address"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="fullName" value={formData.fullName} placeholder="Full Name" onChange={handleChange} className="rounded-xl" />
                    <Input name="phone" value={formData.phone} placeholder="Phone Number" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <Input name="email" value={formData.email} placeholder="Email Address" onChange={handleChange} className="rounded-xl" />
                  <Input name="street" value={formData.street} placeholder="Street Address" onChange={handleChange} className="rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="city" value={formData.city} placeholder="City" onChange={handleChange} className="rounded-xl" />
                    <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="zip" value={formData.zip} placeholder="Zip Code" onChange={handleChange} className="rounded-xl" />
                    <Input name="country" value={formData.country} placeholder="Country" onChange={handleChange} className="rounded-xl" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} disabled={loading} className="flex-1 bg-slate-900 rounded-2xl h-12 font-bold">
                      {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Address" : "Save Address"}
                    </Button>
                    <Button variant="ghost" onClick={resetForm} className="h-12 px-6 rounded-2xl font-bold">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Home size={20} className="text-pink-500" /> Saved Addresses</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-pink-600 font-bold rounded-full">
                      <Plus size={16} className="mr-1" /> Add New
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => dispatch(setSelectedAddress(addr._id))}
                        className={`relative flex items-center gap-4 group border-2 p-5 rounded-[24px] transition-all cursor-pointer select-none ${selectedAddress === addr._id
                          ? "border-pink-500 bg-pink-50/30 ring-1 ring-pink-500/20"
                          : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAddress === addr._id
                          ? "bg-pink-500 border-pink-500"
                          : "border-slate-300 bg-white"
                          }`}>
                          {selectedAddress === addr._id && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 flex justify-between items-start">
                          <div className="space-y-1">
                            <p className={`font-black transition-colors ${selectedAddress === addr._id ? "text-pink-700" : "text-slate-800"}`}>
                              {addr.fullName}
                            </p>
                            <p className="text-slate-500 text-sm leading-tight">
                              {addr.street}, {addr.city}, {addr.state} {addr.zip}
                            </p>
                            <p className="text-slate-400 text-xs font-medium">{addr.phone}</p>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={(e) => handleEditClick(e, addr)}
                              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                              title="Edit Address"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, addr._id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                              title="Delete Address"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleCheckoutTrigger} disabled={!selectedAddress} className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[20px] font-black text-lg shadow-xl">
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
            <Button onClick={handleFinalCheckout} disabled={loading} className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm & Buy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
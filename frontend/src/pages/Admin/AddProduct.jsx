import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { Loader2, PackagePlus, Info, Tag, Layers, FileText, Camera } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const AddProduct = () => {
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  })
  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const { products } = useSelector(store => store.product)

  const initialState = {
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img)
    })

    try {
      setLoading(true)
      const res = await axios.post('/api/product/add', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        setProductData(initialState);      
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50/50 pb-20'>
      {/* --- HEADER BANNER (Per Screenshot) --- */}
      <div className='bg-[#E91E63] pt-12 pb-24 px-8 flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-black text-white tracking-tight'>Create New Listing</h1>
          <p className='text-pink-100 mt-1 opacity-90'>Fill in the information below to add a new product to your store.</p>
        </div>
        <div className='bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30'>
          <PackagePlus className='text-white' size={28} />
        </div>
      </div>

      {/* --- FORM CONTAINER --- */}
      <div className='container mx-auto px-4 -mt-16'>
        <div className='max-w-4xl mx-auto bg-white rounded-[32px] shadow-2xl shadow-pink-100/50 border border-slate-100 overflow-hidden'>
          
          <div className='p-8 md:p-12 space-y-10'>
            
            {/* --- SECTION 1: GENERAL INFO --- */}
            <section className='space-y-6'>
              <div className='flex items-center gap-2 text-[#E91E63] font-bold text-xs uppercase tracking-[0.2em] mb-4'>
                <Info size={14} /> Product Identification
              </div>
              <h2 className='text-2xl font-black text-slate-800 border-b border-slate-50 pb-4'>General Information</h2>
              
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label className="text-slate-600 font-bold ml-1">Product Name</Label>
                  <Input 
                    className='h-12 rounded-xl border-slate-200 focus:ring-pink-500 focus:border-pink-500'
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Handmade Silk Saree" required 
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-slate-600 font-bold ml-1">Price (INR)</Label>
                  <div className='relative'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium'>₹</span>
                    <Input 
                      type='number'
                      className='h-12 pl-10 rounded-xl border-slate-200'
                      value={productData.productPrice}
                      onChange={handleChange}
                      name="productPrice" placeholder="0" required 
                    />
                  </div>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label className="text-slate-600 font-bold flex items-center gap-2 ml-1">
                    <Tag size={14}/> Brand
                  </Label>
                  <Input 
                    className='h-12 rounded-xl border-slate-200'
                    value={productData.brand}
                    onChange={handleChange}
                    name="brand" placeholder="e.g. Sanjeevini Group" required 
                  />
                </div>
                <div className='space-y-2'>
                  <Label className="text-slate-600 font-bold flex items-center gap-2 ml-1">
                    <Layers size={14}/> Category
                  </Label>
                  <Input 
                    className='h-12 rounded-xl border-slate-200'
                    value={productData.category}
                    onChange={handleChange}
                    name="category" placeholder="e.g. Handicrafts" required 
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label className="text-slate-600 font-bold flex items-center gap-2 ml-1">
                  <FileText size={14}/> Description
                </Label>
                <Textarea 
                  name="productDesc"
                  className='min-h-[120px] rounded-xl border-slate-200 resize-none p-4'
                  value={productData.productDesc}
                  onChange={handleChange}
                  placeholder="Tell customers more about the product features and quality..." 
                />
              </div>
            </section>

            {/* --- SECTION 2: VISUAL ASSETS --- */}
            <section className='space-y-6 pt-6 border-t border-slate-50'>
              <div className='flex items-center gap-2 text-[#E91E63] font-bold text-xs uppercase tracking-[0.2em] mb-4'>
                <Camera size={14} /> Visual Assets
              </div>
              <div className='p-8 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/50'>
                <ImageUpload productData={productData} setProductData={setProductData} />
              </div>
            </section>

            {/* --- SUBMIT BUTTON --- */}
            <div className='pt-6'>
              <Button 
                disabled={loading} 
                onClick={submitHandler}
                className="w-full h-16 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-2xl text-lg font-black shadow-xl shadow-pink-200 transition-all active:scale-[0.98] flex gap-3 items-center justify-center" 
                type="submit"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <PackagePlus size={20} />
                    Publish Product
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
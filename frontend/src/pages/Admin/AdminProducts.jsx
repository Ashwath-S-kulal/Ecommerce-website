import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2, Package, ArrowUpDown, Loader2, Info, LayoutGrid, Tag, IndianRupee } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import ImageUpload from '@/components/ImageUpload'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AdminProduct() {
  const { products } = useSelector((store) => store?.product)
  const [editProduct, setEditProduct] = useState("")
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(null)
  const [sortOrder, setSortOrder] = useState("recent")

  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    const formData = new FormData()
    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id)
    formData.append("existingImages", JSON.stringify(existingImages))

    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => { formData.append("files", file) })

    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URI}/api/product/update/${editProduct._id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success("Product updated successfully")
        const updateProducts = products.map((product) =>
          product._id === editProduct._id ? res.data.product : product
        )
        dispatch(setProducts(updateProducts))
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update product")
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteProductHandler = async (productId) => {
    setIsDeleting(productId)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URI}/api/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(products.filter((product) => product._id !== productId)))
      }
    } catch (error) {
      console.log(error)
      toast.error("Delete failed")
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredProducts = products
    ?.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.productPrice - b.productPrice
      if (sortOrder === "highToLow") return b.productPrice - a.productPrice
      if (sortOrder === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

  return (
    <div className='p-4 md:p-8 flex flex-col gap-6 min-h-screen bg-[#f9fafb] pt-12 selection:bg-pink-100'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2'>
            <Package className='text-pink-600' size={28} /> Sanjeevini <span className="font-serif italic font-normal text-pink-500">Products</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium md:ml-9">Manage your sanjeevini product catalog</p>
        </div>
        
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 size-4' />
            <Input
              type='text'
              placeholder="Search products..."
              className="pl-10 w-full lg:w-[300px] bg-white border-slate-100 rounded-2xl shadow-sm focus:ring-pink-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-100 rounded-2xl shadow-sm">
              <div className='flex items-center gap-2'>
                <ArrowUpDown size={14} className='text-slate-400' />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className='border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-transparent md:bg-white'>
                <div className="hidden md:block overflow-x-auto">
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/50 border-b border-slate-100'>
                <th className='px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400'>Product</th>
                <th className='px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400'>Details</th>
                <th className='px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400'>Price</th>
                <th className='px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50 bg-white'>
              {!products ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-4"><div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-xl" /><Skeleton className="h-4 w-32" /></div></td>
                    <td className="px-8 py-4"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-3 w-16" /></td>
                    <td className="px-8 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-8 py-4"><div className="flex justify-end gap-2"><Skeleton className="h-9 w-9 rounded-xl" /><Skeleton className="h-9 w-9 rounded-xl" /></div></td>
                  </tr>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className='hover:bg-slate-50/30 transition-colors group'>
                    <td className='px-8 py-5'>
                      <div className='flex items-center gap-4 max-w-[300px]'>
                        <img src={product?.productImg[0]?.url} alt="" className='w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0 shadow-sm' />
                        <span className='font-bold text-slate-700 truncate block group-hover:text-pink-600 transition-colors'>{product?.productName}</span>
                      </div>
                    </td>
                    <td className='px-8 py-5'>
                      <div className='flex flex-col text-sm'>
                        <span className='text-slate-900 font-bold tracking-tight'>{product.brand}</span>
                        <span className='text-slate-400 text-[10px] font-black uppercase tracking-widest'>{product.category}</span>
                      </div>
                    </td>
                    <td className='px-8 py-5 font-black text-slate-900'>₹{product?.productPrice.toLocaleString('en-IN')}</td>
                    <td className='px-8 py-5 text-right'>
                        <div className='flex justify-end gap-2'>
                           <ActionButtons 
                            product={product} 
                            open={open} 
                            setOpen={setOpen} 
                            editProduct={editProduct} 
                            setEditProduct={setEditProduct}
                            handleChange={handleChange}
                            handleSave={handleSave}
                            isUpdating={isUpdating}
                            isDeleting={isDeleting}
                            deleteProductHandler={deleteProductHandler}
                           />
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='md:hidden flex flex-col gap-4'>
           {!products ? (
             Array.from({ length: 3 }).map((_, i) => (
               <Card key={i} className="p-4 space-y-4">
                 <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                 </div>
               </Card>
             ))
           ) : (
             filteredProducts.map((product) => (
               <Card key={product._id} className="p-4 bg-white border-slate-100 shadow-sm relative">
                  <div className="flex gap-4 mb-4">
                    <img src={product?.productImg[0]?.url} alt="" className='w-20 h-20 rounded-xl object-cover border border-slate-100' />
                    <div className="flex flex-col justify-center overflow-hidden">
                      <h3 className="font-bold text-slate-700 truncate">{product.productName}</h3>
                      <p className="text-xs font-black text-pink-500 uppercase tracking-widest mt-1">{product.category}</p>
                      <p className="text-lg font-black text-slate-900 mt-1">₹{product?.productPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                    <span className="text-xs font-bold text-slate-400">Brand: {product.brand}</span>
                    <div className="flex gap-2">
                       <ActionButtons 
                        product={product} 
                        open={open} 
                        setOpen={setOpen} 
                        editProduct={editProduct} 
                        setEditProduct={setEditProduct}
                        handleChange={handleChange}
                        handleSave={handleSave}
                        isUpdating={isUpdating}
                        isDeleting={isDeleting}
                        deleteProductHandler={deleteProductHandler}
                       />
                    </div>
                  </div>
               </Card>
             ))
           )}
        </div>
      </Card>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}


const ActionButtons = ({ product, open, setOpen, editProduct, setEditProduct, handleChange, handleSave, isUpdating, isDeleting, deleteProductHandler }) => (
  <>
    <Dialog open={open && editProduct?._id === product._id} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className='h-10 w-10 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all' onClick={() => { setEditProduct(product); setOpen(true); }}>
          <Edit size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[800px] h-[700px] md:h-[600px] mt-8 rounded-xl p-0 border-none shadow-2xl overflow-hidden bg-white">
        <div className="bg-slate-900 p-6 md:p-8 text-white relative">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-500 p-2 rounded-xl">
                <Edit className="text-white" size={20} />
              </div>
              <DialogTitle className='text-2xl md:text-3xl font-black tracking-tighter'>Edit Product</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 font-medium text-sm">
              Modify the details of <span className="text-white font-bold">"{product.productName}"</span>
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className='p-4 md:p-8 grid gap-6 max-h-[60vh] overflow-y-auto no-scrollbar'>
          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2'>
              <Info size={12}/> Product Name
            </Label>
            <Input name="productName" value={editProduct?.productName} onChange={handleChange} className='rounded-xl h-12 border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2'>
                <IndianRupee size={12}/> Price
              </Label>
              <Input type="number" name="productPrice" value={editProduct?.productPrice} onChange={handleChange} className='rounded-xl h-12 border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-pink-600' />
            </div>
            <div className='space-y-2'>
              <Label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2'>
                <Tag size={12}/> Category
              </Label>
              <Input name="category" value={editProduct?.category} onChange={handleChange} className='rounded-xl h-12 border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium' />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2'>
              <LayoutGrid size={12}/> Description
            </Label>
            <Textarea name='productDesc' value={editProduct?.productDesc} onChange={handleChange} className='rounded-xl min-h-32 border-slate-100 bg-slate-50/50 focus:bg-white transition-all leading-relaxed' />
          </div>

          <div className="bg-slate-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-dashed border-slate-200">
            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
          </div>
        </div>

        <DialogFooter className='p-4 md:p-8 pt-0 pb-4 md:pb-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3'>
          <DialogClose asChild>
            <Button variant="ghost" className='w-full sm:w-auto rounded-xl px-6 font-bold text-slate-400 hover:text-slate-600'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isUpdating} className='w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-pink-200 transition-all hover:scale-105 active:scale-95'>
            {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className='h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all'>
          {isDeleting === product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90vw] max-w-md rounded-[30px] md:rounded-[40px] p-6 md:p-8 border-none shadow-2xl bg-white'>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
            <Trash2 size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl md:text-2xl font-black text-slate-900 tracking-tight'>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-sm">
              You are about to delete <span className="text-slate-900 font-bold">"{product.productName}"</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-6">
            <AlertDialogCancel className='rounded-2xl h-12 border-slate-100 font-bold text-slate-400 hover:bg-slate-50'>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProductHandler(product._id)} className='bg-red-500 hover:bg-red-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-red-100 transition-all hover:scale-105'>
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  </>
)
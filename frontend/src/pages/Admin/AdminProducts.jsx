import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2, Package, ArrowUpDown, Loader2 } from 'lucide-react' // Added Loader2
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton
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
  const [sortOrder, setSortOrder] = useState("")
  
  // Loading states
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(null) // Stores ID of product being deleted

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
      const res = await axios.put(`/api/product/update/${editProduct._id}`, formData, {
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
      const res = await axios.delete(`/api/product/delete/${productId}`, {
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
      return 0
    })

  return (
    <div className='p-8 flex flex-col gap-6 min-h-screen bg-[#f9fafb] pt-12'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2'>
            <Package className='text-pink-600' /> Inventory Management
          </h1>
        </div>
        
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4' />
            <Input
              type='text'
              placeholder="Search products..."
              className="pl-10 w-full md:w-[300px] bg-white border-gray-200 rounded-xl shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-xl shadow-sm">
              <div className='flex items-center gap-2'>
                <ArrowUpDown size={14} className='text-gray-400' />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className='border-none shadow-sm rounded-2xl overflow-hidden'>
        <div className="overflow-x-auto">
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>Product</th>
                <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>Details</th>
                <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500'>Price</th>
                <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50 bg-white'>
              {/* LOADING SKELETON STATE */}
              {!products ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-lg" /><Skeleton className="h-4 w-32" /></div></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-3 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-9 w-9 rounded-lg" /></div></td>
                  </tr>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className='hover:bg-gray-50/50 transition-colors group'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4 max-w-[300px]'>
                        <img src={product?.productImg[0]?.url} alt="" className='w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0' />
                        <span className='font-bold text-gray-700 truncate block group-hover:text-pink-600 transition-colors'>{product?.productName}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col text-sm'>
                        <span className='text-gray-900 font-medium'>{product.brand}</span>
                        <span className='text-gray-400 text-xs'>{product.category}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 font-black text-gray-900'>₹{product?.productPrice.toLocaleString('en-IN')}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        {/* EDIT */}
                        <Dialog open={open && editProduct?._id === product._id} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className='h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-lg' onClick={() => { setEditProduct(product); setOpen(true); }}>
                              <Edit size={18} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className='text-2xl font-black'>Edit Product</DialogTitle>
                              <DialogDescription>Update listing details for your customers.</DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-5 py-4'>
                              <div className='grid gap-2'>
                                <Label className='font-bold ml-1'>Name</Label>
                                <Input name="productName" value={editProduct?.productName} onChange={handleChange} className='rounded-xl h-11' />
                              </div>
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='grid gap-2'>
                                  <Label className='font-bold ml-1'>Price (₹)</Label>
                                  <Input type="number" name="productPrice" value={editProduct?.productPrice} onChange={handleChange} className='rounded-xl h-11' />
                                </div>
                                <div className='grid gap-2'>
                                  <Label className='font-bold ml-1'>Category</Label>
                                  <Input name="category" value={editProduct?.category} onChange={handleChange} className='rounded-xl h-11' />
                                </div>
                              </div>
                              <div className='grid gap-2'>
                                <Label className='font-bold ml-1'>Description</Label>
                                <Textarea name='productDesc' value={editProduct?.productDesc} onChange={handleChange} className='rounded-xl min-h-24' />
                              </div>
                              <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                            </div>
                            <DialogFooter className='pt-4 border-t gap-2'>
                              <DialogClose asChild><Button variant="outline" className='rounded-xl px-6'>Cancel</Button></DialogClose>
                              <Button onClick={handleSave} disabled={isUpdating} className='bg-pink-600 hover:bg-pink-700 rounded-xl px-8 shadow-lg shadow-pink-100'>
                                {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* DELETE */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className='h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg'>
                              {isDeleting === product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className='rounded-3xl'>
                            <AlertDialogHeader>
                              <AlertDialogTitle className='text-xl font-bold'>Remove this product?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete "{product.productName}".</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className='rounded-xl'>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProductHandler(product._id)} className='bg-red-500 hover:bg-red-600 rounded-xl'>
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
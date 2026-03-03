import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import imageCompression from "browser-image-compression"

const ImageUpload = ({ productData, setProductData }) => {

  // ✅ Compress Image
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.log("Compression error:", error)
      return file
    }
  }

  // ✅ Handle File Selection
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])

    if (!files.length) return

    // compress all images before saving to state
    const compressedFiles = await Promise.all(
      files.map(async (file) => await compressImage(file))
    )

    setProductData((prev) => ({
      ...prev,
      productImg: [...prev.productImg, ...compressedFiles]
    }))
  }

  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImages = prev.productImg.filter((_, i) => i !== index)
      return { ...prev, productImg: updatedImages }
    })
  }

  return (
    <div className='grid gap-2 my-5'>
      <Label>Product Images</Label>

      <Input
        type='file'
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      <Button variant="outline">
        <label htmlFor="file-upload" className='cursor-pointer'>
          Upload Images
        </label>
      </Button>

      {/* Image Preview */}
      {productData.productImg.length > 0 && (
        <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
          {productData.productImg.map((file, idx) => {

            const preview = URL.createObjectURL(file)

            return (
              <Card key={idx} className="relative group overflow-hidden">
                <CardContent>
                  <img
                    src={preview}
                    alt=""
                    className='w-full h-32 object-cover rounded-md'
                  />

                  <button
                    onClick={() => removeImage(idx)}
                    className='absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full'
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
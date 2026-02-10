import React, { useState, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ProductImg({ images = [] }) {
    const [mainImg, setMainImg] = useState(images[0]?.url || '');

    useEffect(() => {
        if (images.length > 0) setMainImg(images[0].url);
    }, [images]);

    
    if (!images.length) return <div className="w-full aspect-square bg-gray-100 animate-pulse rounded-lg" />;

    return (
        <div className='flex flex-col-reverse md:flex-row gap-4 md:gap-5 w-full max-w-4xl mx-auto'>
                        <div className='flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide'>
                {images.map((img, index) => (
                    <img
                        key={index}
                        onClick={() => setMainImg(img.url)}
                        src={img.url}
                        alt={`thumbnail-${index}`}
                        className={`cursor-pointer min-w-[70px] w-20 h-20 md:w-24 md:h-24 object-cover border-2 rounded-xl transition-all shadow-sm
                            ${mainImg === img.url ? 'border-[#0F172A] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
                        `}
                    />
                ))}
            </div>
            <div className='flex-1 bg-[#F8F9FA] rounded-[24px] border border-gray-100 overflow-hidden shadow-sm'>
                <Zoom>
                    <img 
                        src={mainImg} 
                        alt="Product view" 
                        className='w-full aspect-square object-cover  md:h-[527px] cursor-zoom-in' 
                    />
                </Zoom>
            </div>
        </div>
    )
}
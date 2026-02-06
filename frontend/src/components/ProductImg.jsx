import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ProductImg({ images }) {
    const [mainImg, setMainImg] = useState(images[0].url);
    return (
        <div className='flex gap-5 w-max'>
            <div className='gap-5 flex flex-col'>
                {
                    images.map((img) => {
                        return <img
                            onClick={() => setMainImg(img.url)}
                            src={img.url} alt='img' className='cursor-pointer w-20 h-20 border shadow-lg' />

                    })
                }
            </div>
            <Zoom>
                <img src={mainImg} alt="img" className='w-[500px] h-[500px] object-cover border shadow-lg' />
            </Zoom>
        </div>
    )
}

import React from 'react'
import { Button } from './ui/button'
import image from '../assets/hero-img.png'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 py-10">
                    Welcome to ShopEase
                </h1>
                <p className='text-xl mb-6 text-blue-100'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Reiciendis necessitatibus aut voluptatem blanditiis? 
                    Temporibus est eaque modi, at ad hic. Cumque dolorum 
                    excepturi accusamus deleniti pariatur sunt quo quisquam provident?</p>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">Shop Now</Button>
                        <Button variant="outline" className=" border-white text-white  hover:bg-white hover:text-blue-600 bg-transparent">View Deals</Button>
                    </div>
                    
            </div>
            <div className=' relative object w-sm flex items-center justify-center justify-self-center mt-16'>
                <img src={image} alt='' width={250} className='rounded-lg shadow-2xl '/>
            </div>
        </div>

      </div>
    </section>
  )
}

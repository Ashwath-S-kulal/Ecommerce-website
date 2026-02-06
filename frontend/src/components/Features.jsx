import React from "react";
import { Truck, ShieldCheck, Headphones } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        
        {/* Free Shipping */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Free Shipping
          </h3>
          <p className="text-gray-500 text-sm">On orders over $50</p>
        </div>

        {/* Secure Payment */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Secure Payment
          </h3>
          <p className="text-gray-500 text-sm">100% secure transactions</p>
        </div>

        {/* 24/7 Support */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Headphones className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            24/7 Support
          </h3>
          <p className="text-gray-500 text-sm">Always here to help</p>
        </div>

      </div>
    </section>
  );
}

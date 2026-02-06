import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-pink-500 text-3xl font-bold">🛒KART</span>
          </div>
          <p className="text-sm mb-4">
            Powering Your World with the Best in Electronics.
          </p>
          <ul className="space-y-1 text-sm">
            <li>123 Electronics St, Style City, NY 10001</li>
            <li>Email: support@Zaptro.com</li>
            <li>Phone: (123) 456-7890</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-pink-500">Contact Us</a></li>
            <li><a href="#" className="hover:text-pink-500">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-pink-500">FAQs</a></li>
            <li><a href="#" className="hover:text-pink-500">Order Tracking</a></li>
            <li><a href="#" className="hover:text-pink-500">Size Guide</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-pink-500"><Facebook /></a>
            <a href="#" className="hover:text-pink-500"><Instagram /></a>
            <a href="#" className="hover:text-pink-500"><Twitter /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay in the Loop</h3>
          <p className="text-sm mb-4">
            Subscribe to get special offers, free giveaways, and more
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © 2025 <span className="text-pink-500 font-semibold">EKart</span>. All rights reserved.
      </div>
    </footer>
  );
}

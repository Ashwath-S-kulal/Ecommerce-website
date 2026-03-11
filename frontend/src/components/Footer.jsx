import React from "react";
import { Mail, Phone, MapPin, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-pink-800 font-black text-xl">
            <Leaf size={24} /> SANJEEVINI
          </div>
          <p className="text-white text-sm max-w-xs">
            Empowering rural livelihoods through community-led entrepreneurship in Avarse.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12">
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2  text-sm text-white">
              <li><a href="/" className="hover:text-pink-600">Home</a></li>
              <li><a href="/products" className="hover:text-pink-600">Products</a></li>
              <li><a href="/about" className="hover:text-pink-600">About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-center gap-2"><MapPin size={14} /> Avarse, Karnataka</li>
              <li className="flex items-center gap-2"><Mail size={14} /> info@sanjeevini.in</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +91 XXX XXX XXXX</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        © 2026 Sanjeevini Group Avarse. All rights reserved.
      </div>
    </footer>
  );
}
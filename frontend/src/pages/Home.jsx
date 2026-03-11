import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Bell, ArrowRight, Crown, LogIn, Users, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { setCart, setNotifications, setWishlist, setProducts } from '@/redux/productSlice';
import HeroCarousel from '@/components/coresol';

const BASE_URL = import.meta.env.VITE_BASE_URI;

const CAROUSEL_DATA = [
  { id: 1, title: "Avarse Heritage", subtitle: "Artistry in every stitch", image: 'https://media.istockphoto.com/id/1364905810/photo/traditional-indian-colourful-tea-pots-on-display-at-a-store.webp?a=1&b=1&s=612x612&w=0&k=20&c=b7R1lF13W1okrjSh-yt6Kg644LdvUKi6ZP4ssRkvLZ0=' },
  { id: 2, title: "Empowering Lives", subtitle: "Crafted by Village Studios", image: 'https://media.istockphoto.com/id/1372472192/photo/handmade-bamboo-mudda-chair-for-sale-on-roadside-bazaar-market-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=GtTb6BHMKjvsBZ5W_M-a9VKErBlNenM9kqkdyNEEhMo=' },
  { id: 3, title: "Eco-Conscious", subtitle: "100% Sustainable Materials", image: 'https://media.istockphoto.com/id/1446459501/photo/young-man-working-in-a-block-printing-factory-in-jaipur-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=6qpSGpvuscPEznjgTvwi1UcuFqIxmbKONsrxKncvVwM=' },
  { id: 4, title: "Creative Spirit", subtitle: "Hand-painted Masterpieces", image: 'https://media.istockphoto.com/id/1078456356/photo/indian-woman-painting-vases-in-her-workshop-rajasthan-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=Pbc3Y__1KbvsigQY2f2UdfC2X5AQ0KQJp6v2zx-e84M=' },
  { id: 5, title: "Loom Stories", subtitle: "Tradition on a thread", image: 'https://media.istockphoto.com/id/147631166/photo/indian-woman-weaving-by-hand-on-a-loom.webp?a=1&b=1&s=612x612&w=0&k=20&c=sRuiFfV9HSDhMGw0fq_VLLsN9C1yhY3sth1M8-6CtdE=' }
];

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { products } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadUserData(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, [isAdmin]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const resCart = await axios.get(`${BASE_URL}/api/cart/`, { headers });
      const resWish = await axios.get(`${BASE_URL}/api/wishlist/get`, { headers });
      if (resCart.data?.success) dispatch(setCart(resCart.data.cart));
      if (resWish.data?.success) dispatch(setWishlist(resWish.data.wishlist));
      if (isAdmin) {
        const resNotif = await axios.get(`${BASE_URL}/api/notification/get`, { headers, params: { page: 1, limit: 15 } });
        if (resNotif.data?.success) dispatch(setNotifications(resNotif.data.notifications));
      }
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/product/getallproducts?page=1&limit=12`);
      if (res.data.success) dispatch(setProducts(res.data.products));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-pink-100 selection:text-pink-600">
      <main className="pt-24 max-w-screen-2xl mx-auto px-4 md:px-10 pb-20">
        <section>
          <HeroCarousel />
        </section>

        <section className="mt-20">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-pink-500 rounded-full" />
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">New Arrivals</h3>
                <p className="text-slate-400 text-xs font-medium">Handcrafted with love in Karnataka</p>
              </div>
            </div>
            <NavLink to="/products">
              <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all group active:scale-95">
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </NavLink>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              products?.slice(0, 6).map((item) => (
                <ProductCard key={item._id} item={item} />
              ))
            )}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-24">
          <div className="lg:col-span-5">
            <SanjeeviniSection />
          </div>
          <div className="lg:col-span-7">
            <MembersList data={membersData} />
          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}




import { NavLink, useNavigate } from 'react-router-dom';

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  const handlePress = () => {
    navigate(`/products/${item._id}`);
  };

  return (
    <div
      onClick={handlePress}
      className="group relative bg-white p-3 rounded-3xl border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-[4/5] w-full rounded-2xl bg-slate-50 overflow-hidden relative">
        <img
          src={item?.productImg?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={item.productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="mt-4 px-1">
        <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
          {item.productName}
        </h4>

        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-lg font-black text-pink-600">₹{item.productPrice}</p>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


const SanjeeviniSection = () => (
  <div className="sticky top-28 space-y-8">
    <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />
      <Sparkles className="text-pink-400 mb-6" size={32} />
      <h3 className="text-4xl font-black mb-6 tracking-tight">Our Impact Story</h3>
      <p className="text-slate-400 leading-relaxed mb-8">
        Sanjeevini (KSRLPS) empowers over <span className="text-white font-bold">28 Lakh rural women</span> across Karnataka through financial inclusion and community cooperatives.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
          <TrendingUp size={24} className="text-emerald-400 mb-2" />
          <p className="text-2xl font-black">2.8M+</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Women Impacted</p>
        </div>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
          <Users size={24} className="text-blue-400 mb-2" />
          <p className="text-2xl font-black">61</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Groups</p>
        </div>
      </div>
    </div>

    <div className="bg-pink-50 p-8 rounded-[2.5rem] border border-pink-100/50">
      <h4 className="text-xl font-black text-pink-900 mb-3">Vision & Mission</h4>
      <p className="text-pink-800/70 text-sm leading-relaxed">
        To establish a self-reliant rural ecosystem where every woman is an empowered entrepreneur and a pillar of the local economy.
      </p>
    </div>
  </div>
);



const MembersList = ({ data }) => (
  <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Leadership <Crown className="text-yellow-500" size={28} />
        </h3>
        <p className="text-slate-400 text-sm font-medium">The visionaries behind our community</p>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl pr-8 border border-slate-100">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
          <Crown size={30} />
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">President</p>
          <p className="text-lg font-black text-slate-900 leading-none">Smt. Yashodha</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <div key={item.id} className="group flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-slate-50 hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200 cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <Users size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors">{item.name}</p>
            <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500">{item.group}</p>
          </div>
          <div className="px-3 py-1 bg-slate-100 rounded-full group-hover:bg-white/10 group-hover:text-white transition-all">
            <p className="text-[8px] font-black uppercase tracking-widest">{item.product}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);



const ProductSkeleton = () => (
  <div className="bg-white p-4 rounded-3xl border border-slate-50 animate-pulse">
    <div className="aspect-[4/5] bg-slate-100 rounded-2xl mb-4" />
    <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-3" />
    <div className="h-6 bg-slate-100 rounded-full w-1/2" />
  </div>
);





const membersData = [
  { id: 1, name: 'ರೇಣುಕಾ ಕಾಮತ್', group: 'ತೀರ್ಥವಿನಾಯಕ ಸಂಜೀವಿನಿ', product: 'ಹಪ್ಪಳ ಸಂಡಿಗೆ' },
  { id: 2, name: 'ಗೀತಾ ಕಾಮತ್', group: 'ತೀರ್ಥವಿನಾಯಕ ಸಂಜೀವಿನಿ', product: 'ಹಪ್ಪಳ ಸಂಡಿಗೆ' },
  { id: 3, name: 'ಮಾಂಗಲ್ಯ', group: 'ಓಂ ಶಕ್ತಿ ಸಂಜೀವಿನಿ', product: 'ಕ್ಯಾಂಡಲ್' },
  { id: 4, name: 'ಸುಗಂಧಿ', group: 'ಓಂ ಶಕ್ತಿ ಸಂಜೀವಿನಿ', product: 'ಫ್ಯಾನ್ಸಿ ಸ್ಟೋರ್' },
  { id: 5, name: 'ಯಶೋಧಾ', group: 'ಭುವನೇಶ್ವರಿ ಸಂಜೀವಿನಿ', product: 'ಹಾಳೆ ತಟ್ಟೆ' },
  { id: 6, name: 'ಹೇಮಾ', group: 'ಭುವನೇಶ್ವರಿ ಸಂಜೀವಿನಿ', product: 'ಬಟ್ಟೆ ಮತ್ತು ಫುಟ್‌ವೇರ್ ಅಂಗಡಿ' },
  { id: 7, name: 'ಶಕುಂತಲಾ', group: 'ಲಕ್ಷ್ಮೀನಾರಾಯಣ ಸ್ತ್ರೀಶಕ್ತಿ', product: 'ಹೋಟೆಲ್' },
  { id: 8, name: 'ಪೂರ್ಣಿಮಾ', group: 'ಶ್ರೀಲಕ್ಷ್ಮಿ ಸಂಜೀವಿನಿ', product: 'ಬತ್ತಿಕಟ್ಟು' },
  { id: 9, name: 'ಚಂದ್ರಕಲಾ', group: 'ಶ್ರೀರಕ್ಷಾ ಸಂಜೀವಿನಿ', product: 'ಕೋಳಿ ಫಾರಂ' },
  { id: 10, name: 'ಶ್ಯಾಮಲಾ', group: 'ಶ್ರೀರಕ್ಷಾ ಸಂಜೀವಿನಿ', product: 'ಹೈನುಗಾರಿಕೆ' },
  { id: 11, name: 'ಶೈಲಜಾ', group: 'ಜನನಿ ಸಂಜೀವಿನಿ', product: 'ಮಲ್ಲಿಗೆ ಕೃಷಿ' },
  { id: 12, name: 'ಪಾರ್ವತಿ', group: 'ಬ್ರಹ್ಮಲಿಂಗೇಶ್ವರ ಸಂಜೀವಿನಿ', product: 'ಮಲ್ಲಿಗೆ ಕೃಷಿ' },
  { id: 13, name: 'ಬೇಬಿ', group: 'ಶ್ರೀನಿಧಿ ಸ್ತ್ರೀಶಕ್ತಿ', product: 'ಪರೋಟ ತಯಾರಿಕೆ' },
  { id: 14, name: 'ಪ್ರೇಮಾ', group: 'ಶ್ರೀಲಕ್ಷ್ಮಿ ಸಂಜೀವಿನಿ', product: 'ಕೋಳಿ ಫಾರಂ' },
  { id: 15, name: 'ಚಂದ್ರಾವತಿ', group: 'ಮಹಾಲಿಂಗೇಶ್ವರ ಸ್ತ್ರೀಶಕ್ತಿ', product: 'ಬತ್ತಿಕಟ್ಟು' },
  { id: 16, name: 'ಪ್ರೇಮಲತಾ', group: 'ಶ್ರೀಲಕ್ಷ್ಮಿ ಸ್ತ್ರೀಶಕ್ತಿ', product: 'ಫ್ಯಾನ್ಸಿ ಸ್ಟೋರ್' },
  { id: 17, name: 'ಜ್ಯೋತಿ', group: 'ಸ್ನೇಹ ಸಂಜೀವಿನಿ', product: 'ನಾಟಿಕೋಳಿ, ಅಡಿಕೆ ನರ್ಸರಿ' },
  { id: 18, name: 'ಪ್ರಭಾವತಿ', group: 'ಗಣಪತಿ ಸ್ತ್ರೀಶಕ್ತಿ', product: 'ಕೋಳಿ ಫಾರಂ' },
];
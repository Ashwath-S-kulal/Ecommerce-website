import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCart, setNotifications, setWishlist } from '@/redux/productSlice';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Users, ArrowUpRight, Heart, MapPin, Leaf, Zap, CheckCircle2, Calendar, Star, Instagram } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.user);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const loadUserData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const requests = [
          axios.get(`${import.meta.env.VITE_BASE_URI}/api/cart/`, { headers }),
          axios.get(`${import.meta.env.VITE_BASE_URI}/api/wishlist/get`, { headers })
        ];

        const isAdmin = user?.role === 'admin';
        if (isAdmin) {
          requests.push(axios.get(`${import.meta.env.VITE_BASE_URI}/api/notification/get`, { headers }));
        }

        const responses = await Promise.all(requests);
        if (responses[0].data.success) dispatch(setCart(responses[0].data.cart));
        if (responses[1].data.success) dispatch(setWishlist(responses[1].data.wishlist));

        if (isAdmin && responses[2] && responses[2].data.success) {
          dispatch(setNotifications(responses[2].data.notifications));
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    };

    loadUserData();
  }, [dispatch, user]);

  return (
    <div className="bg-[#FCFAFA] text-slate-900 selection:bg-pink-100 selection:text-pink-600 pb-20 md:pb-0 overflow-x-hidden">
      <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center pt-24 lg:pt-20 px-4 md:px-6">
        <div className="container mx-auto grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 lg:mb-6">
              <span className="hidden lg:block h-[1px] w-8 bg-pink-600"></span>
              <span className="text-[10px] lg:text-xs font-black tracking-[0.2em] text-pink-600 uppercase">Avarse Rural Collective</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
              Every Purchase <br />
              <span className="italic font-serif text-pink-600">Ignites a Life.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-sm mx-auto lg:mx-0 mb-8 leading-relaxed">
              We are a self-sustaining ecosystem where 100% of production and logistics are managed by women from the Sanjeevini Group.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                onClick={() => window.installSanjeeviniApp()}
                className="bg-green-600 text-white px-4 py-2 rounded-full"
              >
                Download App
              </Button>
              <Button variant="ghost" className="rounded-full px-6 h-12 w-full sm:w-auto border border-slate-200">Our Impact</Button>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-[350px] md:h-[500px] lg:h-[600px] p-2">
              <div className="rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800" className="w-full h-full object-cover" alt="Artisan" />
              </div>
              <div className="grid grid-rows-2 gap-3 md:gap-4">
                <div className="bg-pink-600 rounded-2xl md:rounded-[40px] p-4 md:p-8 text-white flex flex-col justify-between">
                  <Heart className="w-5 h-5 md:w-8 md:h-8" fill="white" />
                  <p className="font-bold text-lg md:text-2xl leading-tight">"Avarse's heritage in every stitch."</p>
                </div>
                <div className="rounded-2xl md:rounded-[40px] overflow-hidden border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=800" className="w-full h-full object-cover" alt="Community" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-y border-slate-100">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4">
          {[
            { label: "Women Employed", val: "50+", icon: <Users size={18} /> },
            { label: "Families Supported", val: "200+", icon: <Heart size={18} /> },
            { label: "Eco-Materials", val: "100%", icon: <Leaf size={18} /> },
            { label: "Villages Impacted", val: "12", icon: <MapPin size={18} /> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-pink-600 mb-3 bg-pink-50 p-3 rounded-xl">{stat.icon}</div>
              <h4 className="text-2xl md:text-3xl font-black tracking-tight">{stat.val}</h4>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-[#FCFAFA]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">The Pink Cycle</h2>
              <p className="text-slate-500 text-sm md:text-base">How we ensure every rupee goes back to our women.</p>
            </div>
            <div className="text-xs font-black text-pink-600 flex items-center gap-2 cursor-pointer hover:underline tracking-widest uppercase">
              Learn About Ethics <ArrowUpRight size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap />, title: "Handcrafted by Her", desc: "No machines, no factories. Skilled hands working from village home-studios.", tags: ["Zero Carbon", "Fair Wages"] },
              { icon: <ShieldCheck />, title: "Quality of Avarse", desc: "Senior artisans mentor and QC every product to meet global standards.", tags: ["3-Stage QC", "Heritage Tech"] },
              { icon: <Truck />, title: "Pink Logistics", desc: "Our own women delivery partners handle the final mile to your door.", tags: ["Women Fleet", "Safe & Reliable"] }
            ].map((card, i) => (
              <div key={i} className="group bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 hover:border-pink-200 transition-all hover:shadow-xl">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-8 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{card.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-full uppercase tracking-tighter">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">The Closed Loop <br className="hidden md:block" /><span className="text-pink-600">Of Empowerment</span></h2>
              <div className="space-y-6">
                {[
                  { t: "Sourcing", d: "Local organic farms.", icon: <Leaf size={20} /> },
                  { t: "Creation", d: "Home-studios in Avarse.", icon: <Zap size={20} /> },
                  { t: "Delivery", d: "Women on Wheels fleet.", icon: <Truck size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.t}</h4>
                      <p className="text-xs text-slate-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-slate-50 rounded-[32px] md:rounded-[50px] p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-1/2">
                  <img src="https://img.etimg.com/thumb/width-420,height-315,imgsize-137532,resizemode-75,msid-120765177/jobs/hr-policies-trends/women-left-out-of-the-215-billion-logistics-boom-make-up-7-of-the-workforce-in-nse-listed-logistics-companies-udaiti-cii-report/women-powering-logistics-efficiency.jpg" className="rounded-2xl md:rounded-3xl shadow-lg w-full h-48 md:h-auto object-cover" alt="Delivery" />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <span className="text-pink-600 font-bold text-[10px] uppercase tracking-widest mb-2 block">Women on Wheels</span>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">Last Mile, Led by Her.</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">Our village women are trained in driving and inventory, breaking glass ceilings in rural logistics.</p>
                  <Button variant="outline" className="rounded-xl border-slate-200 w-full sm:w-auto">Track Delivery</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FCFAFA]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Inside Sanjeevini</h2>
            <p className="text-slate-500 text-sm">A glimpse into the daily lives of our artisans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1489659639091-8b687bc4386e?q=80&w=600" className="rounded-2xl w-full h-48 lg:h-40 object-cover" alt="Artisan 1" />
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Star className="text-yellow-400 mb-2" fill="currentColor" size={14} />
                <p className="text-[11px] font-bold italic">"Independence changed my family's future."</p>
                <p className="text-[9px] mt-2 text-slate-400 uppercase">- Lakshmi, Weaver</p>
              </div>
            </div>
            <div className="hidden sm:block space-y-4 lg:pt-8">
              <img src="https://imageio.forbes.com/specials-images/imageserve/65aebac3ef04a10bbceaa553/Women-can-do-it--Four-female-characters-walk-up-together-and-hold-arms--Girls-support/0x0.jpg?format=jpg&crop=2499%2C1666%2Cx0%2Cy165%2Csafe&width=480" className="rounded-2xl w-full h-80 object-cover" alt="Artisan 2" />
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=600" className="rounded-2xl w-full h-64 object-cover" alt="Artisan 3" />
            </div>
            <div className="bg-pink-500 p-8 rounded-2xl text-white flex flex-col justify-between min-h-[200px]">
              <Instagram size={24} />
              <h4 className="font-bold text-lg leading-tight">Follow @SanjeeviniAvarse</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 flex flex-wrap justify-center lg:justify-between gap-6 opacity-80 text-[10px] tracking-[0.2em] uppercase font-bold text-center">
          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-pink-500" /> 100% Handcrafted</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-pink-500" /> Women-Led Logistics</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-pink-500" /> Village Collective</div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white p-6 md:p-12 rounded-[40px] md:rounded-[60px] border border-slate-100 shadow-xl">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter">Visit Avarse Village</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto lg:mx-0 text-sm">Our creative workspace is within walking distance of our artisans' homes.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-bold border-b border-slate-50 pb-4">
                <MapPin size={18} className="text-pink-600 shrink-0" /> Main Production Center, Avarse
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-bold border-b border-slate-50 pb-4">
                <Calendar size={18} className="text-pink-600 shrink-0" /> Mon-Sat, 9AM - 5PM
              </div>
              <Button variant="link" className="text-pink-600 font-bold p-0 h-auto text-xs">Village Tour Details <ArrowUpRight size={14} className="ml-1" /></Button>
            </div>
          </div>
          <div className="h-[250px] md:h-[400px] bg-slate-100 rounded-[30px] md:rounded-[40px] overflow-hidden contrast-125 hover:grayscale-0 transition-all duration-700">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000" className="w-full h-full object-cover" alt="Map View" />
          </div>
        </div>
      </section>

      <footer className="pt-20 pb-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2 text-center sm:text-left">
              <h3 className="text-xl font-black mb-4 tracking-tighter uppercase">Sanjeevini <span className="text-pink-600">Avarse</span></h3>
              <p className="text-slate-400 max-w-xs mx-auto sm:mx-0 text-sm leading-relaxed mb-6">Empowering rural women through craft and commerce since 2018.</p>
              <div className="flex justify-center sm:justify-start gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all cursor-pointer"><Instagram size={16} /></div>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-black text-xs uppercase tracking-widest mb-6">Explore</h4>
              <ul className="text-sm text-slate-500 space-y-3 font-medium">
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Shop All</li>
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Our Artisans</li>
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Impact Report</li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-black text-xs uppercase tracking-widest mb-6">Support</h4>
              <ul className="text-sm text-slate-500 space-y-3 font-medium">
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Shipping</li>
                <li className="hover:text-pink-600 cursor-pointer transition-colors">Returns</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Sanjeevini Collective</p>
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-900 cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HERO_INTERVAL = 5000;

const CAROUSEL_DATA = [
  { id: 1, title: "Avarse Heritage", subtitle: "Artistry in every stitch", image: 'https://media.istockphoto.com/id/1364905810/photo/traditional-indian-colourful-tea-pots-on-display-at-a-store.webp?a=1&b=1&s=612x612&w=0&k=20&c=b7R1lF13W1okrjSh-yt6Kg644LdvUKi6ZP4ssRkvLZ0=' },
  { id: 2, title: "Empowering Lives", subtitle: "Crafted by Village Studios", image: 'https://media.istockphoto.com/id/1372472192/photo/handmade-bamboo-mudda-chair-for-sale-on-roadside-bazaar-market-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=GtTb6BHMKjvsBZ5W_M-a9VKErBlNenM9kqkdyNEEhMo=' },
  { id: 3, title: "Eco-Conscious", subtitle: "100% Sustainable Materials", image: 'https://media.istockphoto.com/id/1446459501/photo/young-man-working-in-a-block-printing-factory-in-jaipur-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=6qpSGpvuscPEznjgTvwi1UcuFqIxmbKONsrxKncvVwM=' },
  { id: 4, title: "Creative Spirit", subtitle: "Hand-painted Masterpieces", image: 'https://media.istockphoto.com/id/1078456356/photo/indian-woman-painting-vases-in-her-workshop-rajasthan-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=Pbc3Y__1KbvsigQY2f2UdfC2X5AQ0KQJp6v2zx-e84M=' },
  { id: 5, title: "Loom Stories", subtitle: "Tradition on a thread", image: 'https://media.istockphoto.com/id/147631166/photo/indian-woman-weaving-by-hand-on-a-loom.webp?a=1&b=1&s=612x612&w=0&k=20&c=sRuiFfV9HSDhMGw0fq_VLLsN9C1yhY3sth1M8-6CtdE=' }
];

export default function HeroCarousel() {

  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: "smooth"
    });

    setActive(index);
  };

  const nextSlide = () => {
    const next = active === CAROUSEL_DATA.length - 1 ? 0 : active + 1;
    scrollToIndex(next);
  };

  const prevSlide = () => {
    const prev = active === 0 ? CAROUSEL_DATA.length - 1 : active - 1;
    scrollToIndex(prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, HERO_INTERVAL);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <section className="relative group">

      {/* SLIDES */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth rounded-[2.5rem] "
      >
        {CAROUSEL_DATA.map((item, index) => (
          <div
            key={item.id}
            className="min-w-full h-[400px] md:h-[500px] snap-center relative rounded-[2.5rem] overflow-hidden group/item shadow-2xl shadow-slate-200"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 md:p-16 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest w-fit mb-4">
                <Sparkles size={12} /> Featured Project
              </div>

              <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                {item.title}
              </h2>

              <p className="text-white/70 text-sm md:text-lg font-medium mt-4 max-w-md">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* NAV BUTTONS */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition hidden md:block"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition hidden md:block"
      >
        <ChevronRight size={20} />
      </button>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {CAROUSEL_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all ${
              active === index
                ? "w-6 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
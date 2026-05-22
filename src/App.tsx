import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'motion/react';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import Wave from './components/Wave';
import Hero from './components/Hero';
import Mission from './components/Mission';
import GlaceRoyalPint from './components/GlaceRoyalPint';
import ProductList from './components/ProductList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { Theme, THEMES, Product } from './types';
import { ChevronLeft, ChevronRight, Instagram, Facebook, Youtube } from 'lucide-react';
import { useShopify } from './hooks/useShopify';

interface SectionWrapperProps {
  children: React.ReactNode;
  theme: Theme;
  onInView: (theme: Theme) => void;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}

function SectionWrapper({ children, theme, onInView }: SectionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      onInView(theme);
    }
  }, [isInView, theme, onInView]);

  return <div ref={ref}>{children}</div>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('chocolate');
  const {
    cart,
    products,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useShopify();
  
  const themes: Theme[] = ['chocolate', 'strawberry', 'mint'];
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll tracking for desktop hero pinning and cup movement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Desktop only: cycle hero themes while scrolling through the pinned hero
  useEffect(() => {
    if (isMobile) return;

    return smoothProgress.on('change', (latest) => {
      if (latest <= 0.8) {
        const themeIndex = Math.min(
          Math.floor((latest / 0.6) * themes.length),
          themes.length - 1
        );
        setTheme(themes[themeIndex]);
      }
    });
  }, [smoothProgress, isMobile, themes]);

  // Map scroll progress to 3D cup position and scale
  // 0 to 0.5: Hero section (staying in place)
  // 0.5 to 1.0: Moving to Mission section
  const cupY = useTransform(smoothProgress, [0, 0.8, 1], ["0%", "0%", "120%"]);
  const cupScale = useTransform(smoothProgress, [0, 0.5, 0.8, 1], [1, 1, 0.9, 0.8]);
  const cupOpacity = useTransform(smoothProgress, [0.9, 1], [1, 0.5]);

  const toggleTheme = useCallback((direction: 'next' | 'prev') => {
    setTheme((current) => {
      const currentIndex = themes.indexOf(current);
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % themes.length
          : (currentIndex - 1 + themes.length) % themes.length;
      return themes[nextIndex];
    });
  }, [themes]);

  useEffect(() => {
    // GSAP background color animation
    gsap.to('body', {
      backgroundColor: THEMES[theme].bg,
      duration: 0.8,
      ease: "power2.inOut"
    });
  }, [theme]);

  return (
    <main ref={containerRef} className="relative w-full">
      <Navbar 
        cartCount={cart?.lines?.edges?.reduce((acc: number, item: any) => acc + item.node.quantity, 0) || 0} 
        onCartClick={() => setIsCartOpen(true)}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isLoading={isLoading}
      />

      {/* Hero: full viewport on mobile (arrows only); scroll-pinned on desktop */}
      <div id="home" className="relative h-screen lg:h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── MOBILE LAYOUT (hidden on lg+) ── */}
          <div className="lg:hidden relative h-full w-full">
            {/* Pint image as floating right-side visual */}
            <AnimatePresence mode="wait">
              <motion.img
                key={theme + '-mobile-pint'}
                src={THEMES[theme].fullImage}
                alt="Ice cream pint"
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute bottom-16 right-[-10%] h-[65%] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
              />
            </AnimatePresence>

            {/* Gradient overlay so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-20 pointer-events-none" />

            {/* Hero text content */}
            <div className="relative z-30 h-full flex flex-col justify-center px-6 pt-20 pb-28">
              <AnimatePresence mode="wait">
                <Hero key={theme} theme={theme} onAddToCart={handleAddToCart} products={products} />
              </AnimatePresence>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT (hidden below lg) ── */}
          <div className="hidden lg:grid relative z-20 grid-cols-[45%_55%] h-full pt-32 max-w-[1800px] mx-auto px-16">
            <div className="h-full">
              <AnimatePresence mode="wait">
                <Hero key={theme} theme={theme} onAddToCart={handleAddToCart} products={products} />
              </AnimatePresence>
            </div>

            <motion.div
              style={{ y: cupY, scale: cupScale, opacity: cupOpacity }}
              className="relative h-full flex items-center justify-center z-30"
            >
              <div className="w-full h-full">
                <GlaceRoyalPint theme={theme} />
              </div>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <button
              onClick={() => toggleTheme('prev')}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => toggleTheme('next')}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <Wave theme={theme} color={THEMES[theme].wave} />
        </div>
      </div>

      {/* Mission Section - The cup will arrive here */}
      <SectionWrapper theme="chocolate" onInView={setTheme}>
        <Mission />
      </SectionWrapper>

      <SectionWrapper theme="chocolate" onInView={setTheme}>
        <ProductList onAddToCart={handleAddToCart} products={products} isLoading={isLoading} />
      </SectionWrapper>

      <SectionWrapper theme="mint" onInView={setTheme}>
        <Testimonials />
      </SectionWrapper>

      <SectionWrapper theme="chocolate" onInView={setTheme}>
        <FAQ />
      </SectionWrapper>



      {/* Branding Overlay */}
      <div className="fixed top-8 left-8 z-50 pointer-events-none hidden lg:block">
        <h1 className="text-white text-2xl font-display tracking-tight">Glacé Royale</h1>
      </div>

      <Footer />
    </main>
  );
}

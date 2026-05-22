import { motion } from 'motion/react';
import { Theme, THEMES, Product, AddToCartOptions } from '../types';

interface HeroProps {
  theme: Theme;
  onAddToCart: (product: Product, options?: AddToCartOptions) => void;
  products: Product[];
}

export default function Hero({ theme, onAddToCart, products }: HeroProps) {
  const title = "Taste Joy in Every Bite";
  const words = title.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center h-full px-4 md:px-16 z-20 relative">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-x-4"
      >
        {words.map((word, index) => (
          <motion.h1
            key={index}
            variants={child}
            className="text-white text-5xl md:text-[5.5rem] leading-[0.9] tracking-[-0.03em] font-display"
          >
            {word}
          </motion.h1>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 md:mt-8 text-white/80 max-w-md text-base md:text-lg font-sans leading-relaxed"
      >
        {THEMES[theme].description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <button
          onClick={() => {
            const product = products.find((p) => p.theme === theme);
            if (product) onAddToCart(product);
          }}
          className="px-6 py-3 md:px-10 md:py-4 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto"
          style={{ backgroundColor: THEMES[theme].button }}
        >
          ORDER NOW
        </button>
        <a 
          href="#menu"
          className="flex items-center justify-center px-6 py-3 md:px-10 md:py-4 rounded-full font-semibold text-white/80 hover:text-white transition-all border border-white/20 hover:bg-white/5 w-full sm:w-auto"
        >
          SEE MENU ITEMS
        </a>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 md:mt-16 flex items-center gap-4"
      >
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
              <img
                src={`https://picsum.photos/seed/user${i}/100/100`}
                alt="User"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        <div>
          <p className="text-white font-bold text-sm">10K+ Reviews</p>
          <p className="text-white/60 text-xs">Customers are satisfied</p>
        </div>
      </motion.div>
    </div>
  );
}

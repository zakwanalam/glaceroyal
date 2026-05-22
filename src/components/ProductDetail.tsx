import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product, THEMES, AddToCartOptions } from '../types';
import { useState, useEffect } from 'react';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, options?: AddToCartOptions) => void;
  isLoading?: boolean;
}

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  isLoading = false,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const themeConfig = THEMES[product.theme] || THEMES.chocolate;
  const galleryImages =
    product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const hasMultipleImages = galleryImages.length > 1;

  const goToPrevImage = () => {
    setActiveImageIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1));
  };

  const goToNextImage = () => {
    setActiveImageIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1));
  };

  const features = [
    { icon: <Leaf size={20} />, title: 'All Natural', desc: 'No artificial flavors' },
    { icon: <Truck size={20} />, title: 'Free Delivery', desc: 'Orders over $30' },
    { icon: <Shield size={20} />, title: 'Quality Promise', desc: '100% satisfaction' },
  ];

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[201] bg-white rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/10 backdrop-blur-xl flex items-center justify-center hover:bg-black/20 transition-colors cursor-pointer"
            >
              <X size={20} className="text-black/70" />
            </button>

            {/* Image gallery */}
            <div
              className="relative w-full lg:w-1/2 min-h-[300px] md:min-h-[400px] lg:min-h-0 flex items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${themeConfig.bg}22, ${themeConfig.bg}44)` }}
            >
              <div
                className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
                style={{ background: themeConfig.bg }}
              />
              <div
                className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-2xl -bottom-20 -left-20"
                style={{ background: themeConfig.bg }}
              />

              <div className="relative z-10 w-[70%] max-w-[400px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryImages[activeImageIndex]}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    src={galleryImages[activeImageIndex]}
                    alt={`${product.name} — image ${activeImageIndex + 1}`}
                    className="w-full aspect-square object-cover rounded-[32px] shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevImage}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} className="text-[#3D2B1F]" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} className="text-[#3D2B1F]" />
                    </button>

                    <div className="flex justify-center gap-2 mt-4">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            index === activeImageIndex
                              ? 'w-6 bg-[#3D2B1F]'
                              : 'w-2 bg-[#3D2B1F]/30 hover:bg-[#3D2B1F]/50'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 justify-center">
                      {galleryImages.map((url, index) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            index === activeImageIndex
                              ? 'border-[#3D2B1F] shadow-md'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 z-10 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg"
                style={{ background: themeConfig.button }}
              >
                {themeConfig.calories} cal / serving
              </motion.div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col p-6 md:p-10 lg:p-14 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
                  style={{ background: `${themeConfig.bg}20`, color: themeConfig.button }}
                >
                  {product.theme} collection
                </span>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[#3D2B1F] leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-[#3D2B1F]/50 font-medium">4.9 (128 reviews)</span>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-[#3D2B1F]">{product.price}</span>
                  <span className="text-sm text-[#3D2B1F]/40 ml-2 line-through">
                    ${(parseFloat(product.price.replace('$', '')) * 1.3).toFixed(2)}
                  </span>
                </div>

                <p className="mt-6 text-[#3D2B1F]/60 leading-relaxed text-base md:text-lg">
                  {product.description || themeConfig.description}
                </p>

                <div className="h-px bg-[#3D2B1F]/10 my-8" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center border-2 border-[#3D2B1F]/10 rounded-full px-2 py-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#3D2B1F]/5 transition-colors cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#3D2B1F]/5 transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        onAddToCart(product, { quantity });
                        onClose();
                      }}
                      className="flex-1 py-4 rounded-full font-bold text-white flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: themeConfig.button }}
                    >
                      <ShoppingCart size={20} />
                      {isLoading ? 'ADDING…' : `ADD TO CART — ${product.price}`}
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        onAddToCart(product, { quantity, redirectToCheckout: true });
                      }}
                      className="flex-1 py-4 rounded-full font-bold border-2 border-[#3D2B1F] text-[#3D2B1F] flex items-center justify-center gap-2 hover:bg-[#3D2B1F]/5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'PROCESSING…' : 'BUY NOW'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  {features.map((feature) => (
                    <div key={feature.title} className="text-center p-4 rounded-2xl bg-[#3D2B1F]/[0.03]">
                      <div
                        className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{ background: `${themeConfig.bg}20`, color: themeConfig.button }}
                      >
                        {feature.icon}
                      </div>
                      <p className="text-xs font-bold text-[#3D2B1F]">{feature.title}</p>
                      <p className="text-[10px] text-[#3D2B1F]/40 mt-0.5">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

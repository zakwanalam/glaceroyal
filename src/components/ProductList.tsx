import { useLayoutEffect, useRef, useState } from 'react';
import { Product, AddToCartOptions } from '../types';
import { ShoppingCart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductDetail from './ProductDetail';

gsap.registerPlugin(ScrollTrigger);

interface ProductListProps {
  onAddToCart: (product: Product, options?: AddToCartOptions) => void;
  products: Product[];
  isLoading?: boolean;
}

export default function ProductList({ onAddToCart, products, isLoading }: ProductListProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current?.children || [], {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        }
      });

      // Initialize cards with transform properties to prevent jerk
      cardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            transformPerspective: 1000,
          });
        }
      });

      // Cards Entrance Animation
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <>
      <section id="menu" ref={sectionRef} className="min-h-screen py-20 md:py-24 px-4 sm:px-8 md:px-16 bg-[#B37256]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-display text-[#3D2B1F]">Explore Our Delicious Taste</h2>
              <p className="text-[#3D2B1F]/60 mt-4 max-w-md">Every scoop is a celebration of sunshine. Crafted with love, real fruit, and ultra-creamy textures.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-[#3D2B1F]/20 flex items-center justify-center hover:bg-[#3D2B1F] hover:text-white transition-all">←</button>
              <button className="w-12 h-12 rounded-full border border-[#3D2B1F]/20 flex items-center justify-center hover:bg-[#3D2B1F] hover:text-white transition-all">→</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="group bg-white rounded-[40px] p-6 shadow-xl hover:shadow-2xl transition-shadow duration-500 will-change-transform cursor-pointer"
                style={{ transformStyle: 'preserve-3d', transformPerspective: 1000 }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square rounded-[30px] overflow-hidden mb-6 bg-gray-100" style={{ transform: 'translateZ(50px)' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Quick View
                    </span>
                  </div>
                </div>

                <div className="space-y-2" style={{ transform: 'translateZ(30px)' }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-xl text-[#3D2B1F]">{product.name}</h3>
                    <span className="font-bold text-[#3D2B1F]">{product.price}</span>
                  </div>
                  <p className="text-sm text-[#3D2B1F]/60 line-clamp-2">{product.description}</p>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, { quantity: 1, redirectToCheckout: true });
                    }}
                    className="w-full mt-4 bg-black text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingCart size={18} />
                    {isLoading ? 'PROCESSING…' : 'BUY NOW'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
        isLoading={isLoading}
      />
    </>
  );
}

import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Sparkles, Star } from 'lucide-react';
import chocolateChunks from '../assets/chocolate_chunks.png';
import strawberries from '../assets/strawberries.png';
import mintLeaves from '../assets/mint_leaves.png';

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const missionText = "We believe in capturing the joy of summer in every scoop. Our ice creams are made with the finest ingredients and real fruits.";
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text into words for animation
      const words = textRef.current?.querySelectorAll('.word');
      if (words) {
        gsap.from(words, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 1,
          },
          opacity: 0.1,
          y: 20,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Parallax for floating elements
      gsap.to(".parallax-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: (i, target) => {
          const depth = target.dataset.depth || 0.2;
          return -300 * depth;
        },
        rotate: 45,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="mission" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-24 md:py-40 bg-[#FEFBEA]/50 relative overflow-hidden w-full px-4 sm:px-8 md:px-16"
    >
      {/* Background Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div data-depth="0.1" className="parallax-item absolute top-1/4 left-10 text-[#4DB6AC]/20"><Leaf size={120} /></div>
        <div data-depth="0.3" className="parallax-item absolute top-1/2 right-20 text-[#E57373]/20"><Sparkles size={80} /></div>
        <div data-depth="0.2" className="parallax-item absolute bottom-1/4 left-1/3 text-[#B37256]/20"><Star size={60} /></div>
        <div data-depth="0.4" className="parallax-item absolute top-20 right-1/4 text-[#3D2B1F]/10"><Leaf size={40} className="rotate-45" /></div>
      </div>

      <div className="w-full max-w-7xl text-center z-10">
        <h2
          ref={textRef}
          className="text-4xl md:text-6xl lg:text-8xl font-display text-[#3D2B1F] leading-[1.05] tracking-tight mb-16 flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-2"
        >
          {missionText.split(' ').map((word, i) => (
            <span key={i} className="word inline-block">{word}</span>
          ))}
        </h2>

        <div className="flex justify-center gap-4 sm:gap-8 mt-16">
          {[
            { img: chocolateChunks, alt: "Chocolate Chunks" },
            { img: strawberries, alt: "Fresh Strawberries" },
            { img: mintLeaves, alt: "Mint Leaves" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 100 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-8 border-white shadow-2xl hover:scale-110 transition-transform duration-500 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

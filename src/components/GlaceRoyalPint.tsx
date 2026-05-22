import { motion, AnimatePresence } from 'motion/react';
import { Theme, THEMES } from '../types';

interface GlaceRoyalPintProps {
  theme: Theme;
}

export default function GlaceRoyalPint({ theme }: GlaceRoyalPintProps) {
  const themes: Theme[] = ['chocolate', 'strawberry', 'mint'];
  const currentIndex = themes.indexOf(theme);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        {themes.map((t, index) => {
          const config = THEMES[t];

          // Calculate relative position (0 = active, 1 = next, 2 = after-next)
          // This creates a right-stacked layout like the reference design
          const relativePos = (index - currentIndex + themes.length) % themes.length;

          let x = 0;
          let scale = 1;
          let blur = 0;
          let opacity = 1;
          let zIndex = 20;

          if (relativePos === 0) {
            // Focal Pint
            x = -120; // Move slightly left to balance the stack on the right
            scale = 1.7;
            zIndex = 50;
            blur = 0;
            opacity = 1;
          } else if (relativePos === 1) {
            // First background pint
            x = 220;
            scale = 0.9;
            zIndex = 30;
            blur = 8;
            opacity = 0.6;
          } else if (relativePos === 2) {
            // Second background pint
            x = 420;
            scale = 0.7;
            zIndex = 10;
            blur = 16;
            opacity = 0.3;
          } else if (relativePos === 3) {
            // Third background pint
            x = 620;
            scale = 0.5;
            zIndex = 5;
            blur = 24;
            opacity = 0.1;
          }

          return (
            <motion.div
              key={t}
              initial={false}
              animate={{
                x,
                scale,
                opacity,
                zIndex,
                filter: `blur(${blur}px)`
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                duration: 0.8
              }}
              className="absolute w-full max-w-[450px] aspect-square flex items-center justify-center"
            >
              <img
                src={config.fullImage}
                alt={config.title}
                className="w-full h-full object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
              />

              {/* Individual ground shadows */}
              <motion.div
                animate={{
                  opacity: relativePos === 0 ? 1 : 0.3,
                  scale: relativePos === 0 ? 1 : 0.6
                }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/30 blur-3xl rounded-full -z-10"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

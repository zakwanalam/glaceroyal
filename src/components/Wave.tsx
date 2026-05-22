import { motion } from 'motion/react';
import { Theme } from '../types';

interface WaveProps {
  theme: Theme;
  color: string;
}

export default function Wave({ theme, color }: WaveProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-10 pointer-events-none"
      style={{ height: '38.2vh' }}
    >
      <motion.svg
        viewBox="0 0 1440 320"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
        initial={false}
        animate={{ fill: color }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <path
          d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </motion.svg>
    </div>
  );
}

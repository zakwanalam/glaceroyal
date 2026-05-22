import { motion } from 'motion/react';
import { ShoppingCart, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90%] md:max-w-2xl px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-8">
        <a href="#home" className="text-white font-display text-xl tracking-tight">Glacé Royale</a>
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'HOME', href: '#home' },
            { label: 'MENU', href: '#menu' },
            { label: 'ABOUT', href: '#mission' },
            { label: 'CONTACT', href: '#contact' }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white/70 hover:text-white text-xs font-semibold tracking-wider transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-white/80 hover:text-white transition-colors">
          <User size={20} />
        </button>
        <button 
          onClick={onCartClick}
          className="relative p-2 text-white/80 hover:text-white transition-colors"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

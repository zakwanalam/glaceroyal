import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#538D64] pt-40 pb-12 px-4 sm:px-8 md:px-16 overflow-hidden">
      {/* Wavy Top Divider - Ultra smooth path with no steps */}
      <div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-32 fill-[#538D64]"
        >
          <path d="M0,120V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V120Z"></path>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-white relative z-10">
        {/* Branding & Address */}
        <div className="space-y-6">
          <h2 className="text-3xl font-display tracking-tight text-white mb-8">Glacé Royale</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-white/60 mb-2">Address</h3>
              <p className="text-white/90 leading-relaxed">
                284 Bleecker Street<br />
                New York, NY 10014, USA
              </p>
            </div>
            <p className="text-white/90">
              <a href="tel:+12128732941" className="hover:text-white transition-colors">
                (212) 873-2941
              </a>
            </p>
            <p className="text-white/90 underline italic underline-offset-4">hello@glaceroyal.com</p>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/60">Opening Hours</h3>
          <div className="space-y-4 text-white/90">
            <div>
              <p className="font-semibold text-white">Mon - Fri</p>
              <p>11:00 AM – 11:00 PM</p>
            </div>
            <div>
              <p className="font-semibold text-white">Sat - Sun</p>
              <p>12:00 PM – 12:00 AM</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/60">Quick Links</h3>
          <ul className="space-y-3">
            {['Home', 'About', 'Contact', 'Order Online'].map((link) => (
              <li key={link}>
                <a href="#" className="text-white/90 hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/60">Social Media</h3>
          <ul className="space-y-3">
            {[
              { name: 'Instagram', icon: <Instagram size={18} /> },
              { name: 'Facebook', icon: <Facebook size={18} /> },
              { name: 'Twitter', icon: <Twitter size={18} /> }
            ].map((social) => (
              <li key={social.name}>
                <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-white/40">Copyright © 2026 Glace Royal. All Rights Reserved.</p>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <a
            href="https://bravenlabs.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            Powered by <span className="font-bold text-white/90">BravenLabs</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

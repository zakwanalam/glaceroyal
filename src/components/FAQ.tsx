import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, HelpCircle, Truck, Leaf, Package } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    question: 'What makes your ice cream different?',
    answer: 'We use real tropical fruits, fresh dairy, and zero artificial flavors. Every batch is handcrafted in small quantities to maintain quality.',
    icon: <HelpCircle size={20} />
  },
  {
    id: 2,
    question: 'Do you offer home delivery?',
    answer: 'Yes! We deliver across the city in specialized temperature-controlled packaging to ensure your ice cream arrives perfectly frozen.',
    icon: <Truck size={20} />
  },
  {
    id: 3,
    question: 'Is your ice cream vegan or dairy-free?',
    answer: 'We have a dedicated line of plant-based flavors made with coconut and almond milk that are just as creamy as our dairy options.',
    icon: <Leaf size={20} />
  },
  {
    id: 4,
    question: 'Can I order in bulk for events/parties?',
    answer: 'Absolutely! We offer special catering packages and bulk discounts for weddings, birthdays, and corporate events.',
    icon: <Package size={20} />
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="py-20 md:py-32 px-4 sm:px-8 md:px-16 bg-[#4DB6AC]/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-3xl md:text-6xl font-display text-[#3D2B1F] mb-4 md:mb-6">FAQ's</h2>
          <p className="text-[#3D2B1F]/60 leading-relaxed text-sm md:text-base">We've answered the most common questions to make your experience as smooth as our ice cream.</p>

          <div className="flex gap-4 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg text-[#3D2B1F]">
                {i === 1 ? <HelpCircle size={20} /> : i === 2 ? <Truck size={20} /> : <Leaf size={20} />}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-2/3 space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-[30px] overflow-hidden shadow-xl transition-all"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#4DB6AC]">{faq.icon}</span>
                  <span className="font-bold text-[#3D2B1F] text-base md:text-lg">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  className="text-[#3D2B1F]/40"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 md:px-8 md:pb-8 text-[#3D2B1F]/60 leading-relaxed text-sm md:text-base"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

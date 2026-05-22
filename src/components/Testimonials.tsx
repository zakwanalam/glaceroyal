import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Aisha Khan',
    text: "Honestly the best ice cream I've ever had. The chocolate chunks flavor is unreal — so rich and creamy. I keep coming back every weekend!",
    avatar: 'https://picsum.photos/seed/aisha/100/100'
  },
  {
    id: 2,
    name: 'James Mercer',
    text: "I tried the mint chip on a whim and now I'm completely hooked. It's fresh, indulgent, and absolutely nothing like the store-bought stuff.",
    avatar: 'https://picsum.photos/seed/john/100/100'
  },
  {
    id: 3,
    name: 'Sofia Reyes',
    text: "The strawberry swirl is like summer in a cup. Real fruit, incredible texture, and that beautiful pink color. My whole family loves it.",
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-24 px-4 sm:px-8 md:px-16 bg-[#FEFBEA]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-display text-[#3D2B1F] mb-4">Explore Our Delicious Taste</h2>
        <p className="text-[#3D2B1F]/60 mb-16">Real stories from real people who can't get enough of Glacé Royale.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-[40px] shadow-xl relative text-left flex flex-col justify-between"
            >
              <Quote className="absolute top-8 right-8 text-[#3D2B1F]/10 w-12 h-12" />
              <p className="text-[#3D2B1F]/80 leading-relaxed mb-8 italic">"{review.text}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-[#3D2B1F]">{review.name}</h4>
                  <p className="text-xs text-[#3D2B1F]/60">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

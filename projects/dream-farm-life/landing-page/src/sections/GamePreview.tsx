import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'

const screenshots = [
  {
    src: '/assets/images/screenshot-farm.jpg',
    alt: 'Dream Farm Life — Farm overview with crops, barn, and buildings',
    label: 'Build Your Farm',
  },
  {
    src: '/assets/images/screenshot-orders.jpg',
    alt: 'Dream Farm Life — Complete orders and earn rewards',
    label: 'Fulfill Orders',
  },
]

export default function GamePreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Game Preview"
          title="A Peek Inside the Farm"
          subtitle="See what awaits you — crops to grow, orders to fill, and a farm to call your own."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {screenshots.map((shot, i) => (
            <motion.div
              key={shot.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-farm-brown/5 hover:shadow-xl transition-shadow"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                <span className="font-display font-bold text-white text-lg">
                  {shot.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

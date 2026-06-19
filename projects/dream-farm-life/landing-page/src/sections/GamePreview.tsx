import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'

const videos = [
  {
    src: '/assets/videos/farming-preview.mp4',
    poster: '/assets/videos/poster-farming.jpg',
    label: 'Farm & Build',
    description: 'Grow crops, raise animals, and expand your farm.',
  },
  {
    src: '/assets/videos/orders-preview.mp4',
    poster: '/assets/videos/poster-orders.jpg',
    label: 'Fulfill Orders',
    description: 'Complete orders to earn coins, stars, and XP.',
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
          {videos.map((video, i) => (
            <motion.div
              key={video.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-farm-brown/5 hover:shadow-xl transition-shadow"
            >
              <video
                src={video.src}
                poster={video.poster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                <span className="font-display font-bold text-white text-lg block">
                  {video.label}
                </span>
                <span className="text-white/70 text-sm">
                  {video.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

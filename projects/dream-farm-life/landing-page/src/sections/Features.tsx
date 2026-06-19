import { motion } from 'framer-motion'
import { Sprout, Beef, Building2, Coins, Image, Wifi } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const features = [
  {
    icon: Sprout,
    title: 'Tanam Beragam Tanaman',
    description: 'Gandum, jagung, tomat, wortel, kentang, dan labu. Setiap tanaman punya waktu tumbuh dan hasil berbeda.',
    emoji: '🌱',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Beef,
    title: 'Ternak Hewan',
    description: 'Pelihara sapi, ayam, dan domba. Beri makan, ambil produknya, dan jual untuk koin.',
    emoji: '🐄',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Building2,
    title: 'Bangun & Upgrade',
    description: 'Bangun lumbung, silo, dan kandang. Upgrade untuk kapasitas lebih besar dan tampilan baru.',
    emoji: '🏡',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Coins,
    title: 'Earn $DREAM Token',
    description: 'Setiap panen dan penjualan menghasilkan $DREAM — token SPL di blockchain Solana.',
    emoji: '💰',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Image,
    title: 'Koleksi NFT',
    description: 'Tanah, hewan, dan bangunan langka sebagai NFT. Trade di marketplace atau koleksi.',
    emoji: '🖼️',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Wifi,
    title: 'Main Offline',
    description: 'Bermain kapan saja, di mana saja. Progress tersimpan dan settle on-chain saat online.',
    emoji: '📶',
    color: 'bg-blue-50 text-blue-600',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Features"
          title="Semua yang Kamu Butuhkan"
          subtitle="Fitur lengkap untuk membangun pertanian impianmu, dari menanam hingga menghasilkan."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group p-6 bg-farm-cream rounded-2xl border border-farm-brown/5 hover:border-farm-green/20 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-farm-soil mb-2">
                {feature.title}
              </h3>
              <p className="text-farm-brown text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

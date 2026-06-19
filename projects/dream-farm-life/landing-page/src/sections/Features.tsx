import { motion } from 'framer-motion'
import { Sprout, Beef, Building2, Coins, Image, Wifi } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const features = [
  {
    icon: Sprout,
    title: 'Grow Various Crops',
    description: 'Wheat, corn, tomatoes, carrots, potatoes, and pumpkins. Each crop has unique growth times and yields.',
    emoji: '🌱',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Beef,
    title: 'Raise Animals',
    description: 'Raise cows, chickens, and sheep. Feed them, collect their products, and sell for coins.',
    emoji: '🐄',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Building2,
    title: 'Build & Upgrade',
    description: 'Build barns, silos, and coops. Upgrade for more capacity and fresh new looks.',
    emoji: '🏡',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Coins,
    title: 'Earn $DREAM Token',
    description: 'Every harvest and sale earns $DREAM — an SPL token on the Solana blockchain.',
    emoji: '💰',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Image,
    title: 'Collect NFTs',
    description: 'Rare land, animals, and buildings as NFTs. Trade them on the marketplace or collect.',
    emoji: '🖼️',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Wifi,
    title: 'Play Offline',
    description: 'Play anytime, anywhere. Progress saves locally and settles on-chain when you go online.',
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
          title="Everything You Need"
          subtitle="Full feature set to build your dream farm — from planting to earning."
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

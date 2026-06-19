import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'

const nfts = [
  {
    name: 'Golden Wheat Field',
    type: 'Land',
    rarity: 'Legendary',
    rarityColor: 'bg-yellow-400 text-yellow-900',
    emoji: '🌾',
    bg: 'from-yellow-100 to-amber-100',
  },
  {
    name: 'Crystal Cow',
    type: 'Animal',
    rarity: 'Rare',
    rarityColor: 'bg-purple-400 text-purple-900',
    emoji: '🐄',
    bg: 'from-purple-100 to-pink-100',
  },
  {
    name: 'Red Barn',
    type: 'Building',
    rarity: 'Common',
    rarityColor: 'bg-gray-300 text-gray-700',
    emoji: '🏠',
    bg: 'from-red-100 to-orange-100',
  },
  {
    name: 'Rainbow Chicken',
    type: 'Animal',
    rarity: 'Rare',
    rarityColor: 'bg-purple-400 text-purple-900',
    emoji: '🐔',
    bg: 'from-pink-100 to-violet-100',
  },
]

export default function NFTShowcase() {
  return (
    <section id="nfts" className="py-24 bg-farm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="NFT Collection"
          title="Unique Collectibles"
          subtitle="Rare land, animals, and buildings as NFTs on Solana. Trade or collect."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft, i) => (
            <motion.div
              key={nft.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl overflow-hidden border border-farm-brown/5 hover:shadow-xl transition-all"
            >
              {/* Image area */}
              <div className={`h-48 bg-gradient-to-br ${nft.bg} flex items-center justify-center`}>
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {nft.emoji}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${nft.rarityColor}`}>
                    {nft.rarity}
                  </span>
                  <span className="text-xs text-farm-brown">{nft.type}</span>
                </div>
                <h3 className="font-display font-bold text-farm-soil">
                  {nft.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming soon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <span className="inline-block px-6 py-3 bg-white rounded-full text-sm font-medium text-farm-brown border border-farm-brown/10">
            🎨 More NFTs coming soon — stay tuned!
          </span>
        </motion.div>
      </div>
    </section>
  )
}

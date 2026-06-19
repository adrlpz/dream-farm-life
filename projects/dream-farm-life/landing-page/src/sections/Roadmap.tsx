import { motion } from 'framer-motion'
import { Check, Clock } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const roadmap = [
  {
    quarter: 'Q3 2026',
    title: 'MVP Launch',
    items: ['Core farming gameplay', 'Crop & animal system', 'Local save system', 'Beta launch'],
    active: true,
  },
  {
    quarter: 'Q4 2026',
    title: 'Solana Integration',
    items: ['Wallet connection', '$DREAM token launch', 'NFT minting', 'Batch settlement'],
    active: false,
  },
  {
    quarter: 'Q1 2027',
    title: 'Marketplace & Social',
    items: ['NFT marketplace', 'P2P trading', 'Visit friends farms', 'Leaderboard'],
    active: false,
  },
  {
    quarter: 'Q2 2027',
    title: 'Expansion',
    items: ['Mobile app', 'Seasons & weather', 'Crafting system', 'New crops & animals'],
    active: false,
  },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Roadmap"
          title="Our Journey"
          subtitle="From MVP to a full ecosystem — one step at a time."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-farm-green/15 sm:-translate-x-0.5" />

          <div className="space-y-12">
            {roadmap.map((item, i) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                  i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full border-4 border-white -translate-x-1/2 z-10 shadow-sm"
                  style={{
                    backgroundColor: item.active ? '#4CAF50' : '#D7CCC8',
                  }}
                />

                {/* Content card */}
                <div className={`ml-10 sm:ml-0 sm:w-[calc(50%-2rem)] p-6 rounded-2xl ${
                  item.active
                    ? 'bg-farm-green/5 border-2 border-farm-green/20'
                    : 'bg-farm-cream border border-farm-brown/5'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.active
                        ? 'bg-farm-green text-white'
                        : 'bg-farm-brown/10 text-farm-brown'
                    }`}>
                      {item.quarter}
                    </span>
                    {item.active && (
                      <span className="flex items-center gap-1 text-xs text-farm-green font-medium">
                        <Clock className="w-3 h-3" /> Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-farm-soil mb-3">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.items.map((task) => (
                      <li key={task} className="flex items-center gap-2 text-sm text-farm-brown">
                        <Check className={`w-4 h-4 shrink-0 ${
                          item.active ? 'text-farm-green' : 'text-farm-brown/30'
                        }`} />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

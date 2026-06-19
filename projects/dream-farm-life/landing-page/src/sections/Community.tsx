import { motion } from 'framer-motion'
import { Twitter, MessageCircle, Send, ArrowRight } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const socials = [
  {
    icon: Twitter,
    name: 'Twitter / X',
    handle: '@DFarmLife',
    href: 'https://x.com/DFarmLife',
    color: 'bg-black text-white',
  },
  {
    icon: MessageCircle,
    name: 'Discord',
    handle: 'Join Community',
    href: '#',
    color: 'bg-indigo-500 text-white',
  },
  {
    icon: Send,
    name: 'Telegram',
    handle: '@Dreamfarmlife',
    href: 'https://t.me/Dreamfarmlife',
    color: 'bg-blue-400 text-white',
  },
]

export default function Community() {
  return (
    <section id="community" className="py-24 bg-farm-cream relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-farm-green/3 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Community"
          title="Join the Community"
          subtitle="Thousands of farmers are waiting for you. Join now!"
        />

        {/* Social cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-farm-brown/5 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center`}>
                <social.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-farm-soil">{social.name}</div>
                <div className="text-sm text-farm-brown">{social.handle}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-farm-brown/40" />
            </motion.a>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto text-center"
        >
          <h3 className="font-display font-bold text-xl text-farm-soil mb-3">
            Get the Latest Updates
          </h3>
          <p className="text-sm text-farm-brown mb-6">
            Subscribe for launch news, events, and exclusive rewards.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="email@example.com"
              className="flex-1 px-5 py-3 rounded-full bg-white border border-farm-brown/15 text-farm-soil placeholder:text-farm-brown/40 focus:outline-none focus:ring-2 focus:ring-farm-green/30 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-farm-green text-white font-display font-semibold rounded-full hover:bg-farm-green-dark transition-colors text-sm"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

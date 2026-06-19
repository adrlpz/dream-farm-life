import { motion } from 'framer-motion'
import { ArrowRight, Sprout, Egg, Wheat } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-farm-sky/30 via-farm-cream to-farm-cream pt-16"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] animate-float">
          <span className="text-5xl">🌾</span>
        </div>
        <div className="absolute top-[25%] right-[12%] animate-float-delayed">
          <span className="text-4xl">🐄</span>
        </div>
        <div className="absolute bottom-[30%] left-[8%] animate-float-slow">
          <span className="text-4xl">🐔</span>
        </div>
        <div className="absolute top-[20%] right-[30%] animate-float">
          <span className="text-3xl">🌻</span>
        </div>
        <div className="absolute bottom-[25%] right-[15%] animate-float-delayed">
          <span className="text-4xl">🌽</span>
        </div>
        <div className="absolute bottom-[40%] left-[25%] animate-float-slow">
          <span className="text-3xl">🍅</span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-farm-green/10 border border-farm-green/20 rounded-full text-sm font-medium text-farm-green mb-8">
            <Sprout className="w-4 h-4" />
            Farming Game on Solana
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-farm-soil leading-tight mb-6"
        >
          Bangun Pertanian{' '}
          <span className="text-gradient-green">Impianmu</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-farm-brown max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tanam tanaman, beternak hewan, dan bangun pertanian impianmu.
          Santai, menyenangkan, dan dapatkan reward di blockchain Solana.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 bg-farm-green text-white font-display font-bold text-lg rounded-full hover:bg-farm-green-dark transition-all hover:scale-105 shadow-lg shadow-farm-green/25"
          >
            Mulai Bermain
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-farm-soil font-display font-semibold text-lg rounded-full hover:bg-farm-cream transition-all border border-farm-brown/15"
          >
            Pelajari Lagi
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-14"
        >
          {[
            { icon: Wheat, label: 'Crops', value: '6+' },
            { icon: Egg, label: 'Animals', value: '3+' },
            { icon: Sprout, label: 'NFTs', value: '15+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farm-green/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-farm-green" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-xl text-farm-soil">{value}</div>
                <div className="text-sm text-farm-brown">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 50C360 100 720 0 1080 50C1260 75 1380 62 1440 50V100H0V50Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  )
}

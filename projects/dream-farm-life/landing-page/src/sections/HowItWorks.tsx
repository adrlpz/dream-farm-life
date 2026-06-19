import { motion } from 'framer-motion'
import { Wallet, Gamepad2, TrendingUp } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Hubungkan Wallet',
    description: 'Gunakan Phantom, Solflare, atau Backpack. Atau main sebagai guest tanpa wallet.',
    color: 'bg-purple-500',
  },
  {
    number: '02',
    icon: Gamepad2,
    title: 'Mulai Bertani',
    description: 'Tanam benih, panen hasil, ternak hewan, dan bangun pertanian impianmu.',
    color: 'bg-farm-green',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Earn & Trade',
    description: 'Dapatkan $DREAM token dan NFT. Trade di marketplace atau koleksi.',
    color: 'bg-farm-gold',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-farm-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="How It Works"
          title="Mulai dalam 3 Langkah"
          subtitle="Dari wallet ke pertanian impian — cepat dan mudah."
        />

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-farm-green/20" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative text-center"
              >
                {/* Number circle */}
                <div className="relative z-10 mx-auto w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                  <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Step number */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-farm-green bg-farm-cream px-2 rounded-full">
                  {step.number}
                </div>

                <h3 className="font-display font-bold text-xl text-farm-soil mb-3">
                  {step.title}
                </h3>
                <p className="text-farm-brown text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

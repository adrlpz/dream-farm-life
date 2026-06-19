import { motion } from 'framer-motion'
import { Wallet, Gamepad2, TrendingUp } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useI18n } from '../i18n'

const stepsMeta = [
  { number: '01', icon: Wallet, color: 'bg-purple-500', titleKey: 'hiw_step1_title' as const, descKey: 'hiw_step1_desc' as const },
  { number: '02', icon: Gamepad2, color: 'bg-farm-green', titleKey: 'hiw_step2_title' as const, descKey: 'hiw_step2_desc' as const },
  { number: '03', icon: TrendingUp, color: 'bg-farm-gold', titleKey: 'hiw_step3_title' as const, descKey: 'hiw_step3_desc' as const },
]

export default function HowItWorks() {
  const { t } = useI18n()

  return (
    <section id="how-it-works" className="py-24 bg-farm-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('hiw_badge')}
          title={t('hiw_title')}
          subtitle={t('hiw_subtitle')}
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-farm-green/20" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stepsMeta.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                  <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-farm-green bg-farm-cream px-2 rounded-full">
                  {step.number}
                </div>
                <h3 className="font-display font-bold text-xl text-farm-soil mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-farm-brown text-sm leading-relaxed max-w-xs mx-auto">
                  {t(step.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

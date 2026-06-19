import { motion } from 'framer-motion'
import { Sprout, Beef, Building2, Coins, Image, Wifi } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useI18n } from '../i18n'

const featuresMeta = [
  { icon: Sprout, emoji: '🌱', color: 'bg-green-50 text-green-600', titleKey: 'features_crop_title' as const, descKey: 'features_crop_desc' as const },
  { icon: Beef, emoji: '🐄', color: 'bg-amber-50 text-amber-600', titleKey: 'features_animal_title' as const, descKey: 'features_animal_desc' as const },
  { icon: Building2, emoji: '🏡', color: 'bg-orange-50 text-orange-600', titleKey: 'features_build_title' as const, descKey: 'features_build_desc' as const },
  { icon: Coins, emoji: '💰', color: 'bg-yellow-50 text-yellow-600', titleKey: 'features_token_title' as const, descKey: 'features_token_desc' as const },
  { icon: Image, emoji: '🖼️', color: 'bg-purple-50 text-purple-600', titleKey: 'features_nft_title' as const, descKey: 'features_nft_desc' as const },
  { icon: Wifi, emoji: '📶', color: 'bg-blue-50 text-blue-600', titleKey: 'features_offline_title' as const, descKey: 'features_offline_desc' as const },
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
  const { t } = useI18n()

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('features_badge')}
          title={t('features_title')}
          subtitle={t('features_subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresMeta.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
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
                {t(feature.titleKey)}
              </h3>
              <p className="text-farm-brown text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

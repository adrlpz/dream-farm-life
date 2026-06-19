import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import { useI18n } from '../i18n'

const videos = [
  {
    src: '/assets/videos/farming-preview.mp4',
    poster: '/assets/videos/poster-farming.jpg',
    labelKey: 'preview_farm_label' as const,
    descKey: 'preview_farm_desc' as const,
  },
  {
    src: '/assets/videos/orders-preview.mp4',
    poster: '/assets/videos/poster-orders.jpg',
    labelKey: 'preview_orders_label' as const,
    descKey: 'preview_orders_desc' as const,
  },
]

export default function GamePreview() {
  const { t } = useI18n()

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('preview_badge')}
          title={t('preview_title')}
          subtitle={t('preview_subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, i) => (
            <motion.div
              key={video.labelKey}
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
                  {t(video.labelKey)}
                </span>
                <span className="text-white/70 text-sm">
                  {t(video.descKey)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Coins, Sprout, ShoppingBag, Trophy, Lock, Flame } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useI18n } from '../i18n'

const earnMeta = [
  { icon: Sprout, labelKey: 'token_earn1_label' as const, descKey: 'token_earn1_desc' as const },
  { icon: Trophy, labelKey: 'token_earn2_label' as const, descKey: 'token_earn2_desc' as const },
  { icon: Flame, labelKey: 'token_earn3_label' as const, descKey: 'token_earn3_desc' as const },
]

const spendMeta = [
  { icon: Lock, labelKey: 'token_spend1_label' as const, descKey: 'token_spend1_desc' as const },
  { icon: ShoppingBag, labelKey: 'token_spend2_label' as const, descKey: 'token_spend2_desc' as const },
  { icon: Coins, labelKey: 'token_spend3_label' as const, descKey: 'token_spend3_desc' as const },
]

export default function Token() {
  const { t } = useI18n()

  return (
    <section id="token" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-farm-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-farm-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('token_badge')}
          title={t('token_title')}
          subtitle={t('token_subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          {/* Earn */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-farm-green/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-farm-green" />
              </div>
              <h3 className="font-display font-bold text-2xl text-farm-soil">
                {t('token_earn_title')}
              </h3>
            </div>
            <div className="space-y-4">
              {earnMeta.map(({ icon: Icon, labelKey, descKey }) => (
                <div key={labelKey} className="flex items-start gap-4 p-4 bg-farm-cream rounded-xl border border-farm-brown/5">
                  <div className="w-10 h-10 rounded-lg bg-farm-green/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-farm-green" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-farm-soil">{t(labelKey)}</div>
                    <div className="text-sm text-farm-brown">{t(descKey)}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Spend */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-farm-gold/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-farm-gold" />
              </div>
              <h3 className="font-display font-bold text-2xl text-farm-soil">
                {t('token_spend_title')}
              </h3>
            </div>
            <div className="space-y-4">
              {spendMeta.map(({ icon: Icon, labelKey, descKey }) => (
                <div key={labelKey} className="flex items-start gap-4 p-4 bg-farm-cream rounded-xl border border-farm-brown/5">
                  <div className="w-10 h-10 rounded-lg bg-farm-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-farm-gold" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-farm-soil">{t(labelKey)}</div>
                    <div className="text-sm text-farm-brown">{t(descKey)}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Token info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-farm-green to-farm-green-dark rounded-2xl text-white text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div>
              <div className="text-sm opacity-80 mb-1">Token</div>
              <div className="font-display font-bold text-2xl">$DREAM</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Network</div>
              <div className="font-display font-bold text-2xl">Solana</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Standard</div>
              <div className="font-display font-bold text-2xl">SPL</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">NFT</div>
              <div className="font-display font-bold text-2xl">Metaplex Core</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

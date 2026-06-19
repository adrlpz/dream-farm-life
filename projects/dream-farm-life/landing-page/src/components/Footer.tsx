import { Sprout, Github, Twitter, MessageCircle } from 'lucide-react'
import { useI18n } from '../i18n'

const socialLinks = [
  { icon: Twitter, href: 'https://x.com/DFarmLife', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://t.me/Dreamfarmlife', label: 'Discord' },
  { icon: Github, href: 'https://github.com/adrlpz/dream-farm-life', label: 'GitHub' },
]

export default function Footer() {
  const { t } = useI18n()

  const footerLinks = [
    {
      title: t('footer_game'),
      links: [
        { label: t('footer_playNow'), href: 'https://play.google.com/store/apps/details?id=com.dreamfarm.farmlife' },
        { label: t('nav_features'), href: '#features' },
        { label: t('roadmap_title'), href: '#roadmap' },
      ],
    },
    {
      title: t('footer_learn'),
      links: [
        { label: t('footer_whitepaper'), href: '#' },
        { label: t('footer_documentation'), href: '#' },
        { label: '$DREAM Token', href: '#token' },
      ],
    },
    {
      title: t('footer_legal'),
      links: [
        { label: t('footer_terms'), href: '#' },
        { label: t('footer_privacy'), href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-farm-soil text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-6 h-6 text-farm-green" />
              <span className="font-display font-bold text-lg text-white">
                Dream Farm Life
              </span>
            </div>
            <p className="text-sm text-white/60 mb-6">
              {t('footer_brand')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-farm-green transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-farm-green transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {t('footer_rights')}
          </p>
          <p className="text-sm text-white/40">
            {t('footer_built')}
          </p>
        </div>
      </div>
    </footer>
  )
}

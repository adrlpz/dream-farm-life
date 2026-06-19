import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sprout, Globe } from 'lucide-react'
import { useI18n } from '../i18n'
import type { Lang } from '../i18n/translations'

const langLabels: Record<Lang, string> = { en: 'EN', vi: 'VI' }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()

  const navLinks = [
    { label: t('nav_features'), href: '#features' },
    { label: t('nav_howItWorks'), href: '#how-it-works' },
    { label: t('nav_token'), href: '#token' },
    { label: t('nav_nfts'), href: '#nfts' },
    { label: t('nav_roadmap'), href: '#roadmap' },
    { label: t('nav_community'), href: '#community' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-farm-cream/80 backdrop-blur-md border-b border-farm-brown/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Sprout className="w-7 h-7 text-farm-green" />
            <span className="font-display font-bold text-xl text-farm-soil">
              Dream Farm Life
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-farm-brown-dark hover:text-farm-green transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side: lang switcher + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-farm-brown-dark hover:bg-farm-brown/5 transition-colors border border-farm-brown/15"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              {langLabels[lang]}
            </button>
            <a
              href="https://play.google.com/store/apps/details?id=com.dreamfarm.farmlife"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 bg-farm-green text-white font-display font-semibold rounded-full hover:bg-farm-green-dark transition-colors text-sm"
            >
              {t('nav_playNow')}
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-farm-brown-dark"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-farm-cream border-t border-farm-brown/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-farm-brown-dark hover:text-farm-green transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setLang(lang === 'en' ? 'vi' : 'en'); setOpen(false) }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-farm-brown-dark border border-farm-brown/15 rounded-full"
              >
                <Globe className="w-3.5 h-3.5" />
                {langLabels[lang]}
              </button>
              <a
                href="https://play.google.com/store/apps/details?id=com.dreamfarm.farmlife"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-center px-5 py-2.5 bg-farm-green text-white font-display font-semibold rounded-full hover:bg-farm-green-dark transition-colors text-sm mt-2"
              >
                {t('nav_playNow')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

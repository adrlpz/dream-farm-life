import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Lang, TranslationKey } from './translations'

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

function detectLanguage(): Lang {
  const saved = localStorage.getItem('dfl-lang') as Lang | null
  if (saved && (saved === 'en' || saved === 'vi')) return saved
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('vi')) return 'vi'
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('dfl-lang', newLang)
  }

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

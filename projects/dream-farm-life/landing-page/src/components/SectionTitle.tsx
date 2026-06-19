import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionTitleProps {
  badge?: string
  title: string
  subtitle?: string
  children?: ReactNode
}

export default function SectionTitle({ badge, title, subtitle, children }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 bg-farm-green/10 text-farm-green text-sm font-semibold rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-farm-soil mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-farm-brown text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  )
}

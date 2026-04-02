'use client'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

const scrollToOnboarding = () => {
  const element = document.getElementById('onboarding-section')
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 ${scrolled ? 'border-b bg-background/90 backdrop-blur-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
        
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-[var(--color-caramel)]" />
          <span className="font-bold text-[var(--color-caramel)] text-xl">Auron</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 rounded-lg bg-[var(--color-caramel)] text-white"
        >
          Get started
        </motion.button>

      </div>
    </nav>
  )
}
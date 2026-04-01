'use client'

import { motion } from 'framer-motion'
import { Target, Map, TrendingUp, Calendar } from 'lucide-react'

const features = [
  { icon: Target, title: 'Know your gaps', desc: 'See what you lack' },
  { icon: Map, title: 'Semester roadmap', desc: 'Clear plan' },
  { icon: TrendingUp, title: 'Track progress', desc: 'Measure readiness' },
  { icon: Calendar, title: 'Stay on track', desc: 'No drifting' },
]

export default function FeatureCards() {
  return (
    <section className="py-24">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="p-6 border rounded-lg">
            <f.icon className="text-[var(--color-caramel)] mb-3" />
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
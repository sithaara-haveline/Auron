'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
      >
        <h1 className="text-6xl font-bold text-[var(--color-caramel)]">73%</h1>
        <p className="text-xl text-[var(--color-warm-greige)] mt-4">
          of students have no clear career roadmap
        </p>
      </motion.div>
    </section>
  )
}
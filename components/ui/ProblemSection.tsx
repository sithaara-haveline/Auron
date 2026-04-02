'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{
      padding: '80px 40px',
      background: '#fff',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      textAlign: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{
          fontSize: '14px',
          color: '#8B6A50',
          marginBottom: '16px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontWeight: 500
        }}>
          The problem
        </h2>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#3D1F00',
            marginBottom: '16px'
          }}>
          73%
        </motion.div>

        <p style={{
          fontSize: '24px',
          color: '#6B5040',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          of engineering students have <strong>no clear career roadmap</strong> beyond their current semester
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {[
            { stat: '84%', desc: 'Don\'t know what to learn' },
            { stat: '67%', desc: 'Miss opportunities due to poor planning' },
            { stat: '91%', desc: 'Waste semesters on wrong skills' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              style={{
                padding: '24px',
                background: '#F5F0E8',
                borderRadius: '12px'
              }}
            >
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#3D1F00',
                marginBottom: '12px'
              }}>
                {item.stat}
              </div>
              <p style={{
                fontSize: '14px',
                color: '#8B6A50',
                margin: 0
              }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
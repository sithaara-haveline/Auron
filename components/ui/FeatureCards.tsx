'use client'

import { motion, useInView } from 'framer-motion'
import { Target, Map, TrendingUp, Calendar, CheckCircle, Brain } from 'lucide-react'
import { useRef } from 'react'

const features = [
  { 
    icon: Target, 
    title: 'Match your profile',
    desc: 'AI analyzes what top companies actually look for — not generic advice'
  },
  { 
    icon: Map, 
    title: 'Get a semester roadmap', 
    desc: 'Specific milestones with exact resources and measurable goals'
  },
  { 
    icon: TrendingUp, 
    title: 'See your progress',
    desc: 'Weekly check-ins keep you accountable and on track'
  },
  { 
    icon: Calendar, 
    title: 'Plan realistically',
    desc: 'Roadmaps fit your actual schedule and skill level'
  },
  { 
    icon: Brain, 
    title: 'Learn the why',
    desc: 'Understand exactly why each skill matters for YOUR goals'
  },
  { 
    icon: CheckCircle, 
    title: 'Actually execute',
    desc: 'Move from planning to doing — with AI guidance every step'
  }
]

export default function FeatureCards() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{
      padding: '80px 40px',
      background: '#F5F0E8'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}
        >
          <h2 style={{
            fontSize: '14px',
            color: '#8B6A50',
            marginBottom: '16px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            How Auron works
          </h2>
          <h3 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#3D1F00',
            marginBottom: '16px'
          }}>
            Built for students like you
          </h3>
          <p style={{
            fontSize: '18px',
            color: '#6B5040',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Personalised career guidance that actually works
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{
                padding: '32px',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F5F0E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <feature.icon size={24} color='#3D1F00' strokeWidth={1.5} />
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#3D1F00',
                marginBottom: '8px'
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#8B6A50',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
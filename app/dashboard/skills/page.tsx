'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Award, Target, Loader2 } from 'lucide-react'
import type { UserSkill } from '@/lib/types'

export default function SkillsPage() {
  const { user, loading: authLoading } = useAuth()
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
      return
    }

    if (user) {
      loadSkills()
    }
  }, [user, authLoading])

  const loadSkills = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('skill_name')

      setSkills(data || [])
    } catch (error) {
      console.error('Error loading skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const confidenceLabels: Record<number, string> = {
    1: 'Heard of it',
    2: 'Basics only',
    3: 'Can use it',
    4: 'Comfortable',
    5: 'Can teach it'
  }

  const getConfidenceColor = (confidence: number): string => {
    if (confidence <= 2) return '#f59e0b'
    if (confidence <= 3) return '#3b82f6'
    if (confidence <= 4) return '#8b5cf6'
    return 'var(--color-sage-green)'
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-caramel)" />
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '280px', padding: '40px 48px', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <TrendingUp size={28} color="var(--color-caramel)" />
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-caramel)', margin: 0 }}>
            Your Skills
          </h1>
        </div>
        <p style={{ color: 'var(--color-warm-greige)', fontSize: '16px' }}>
          Track your technical and soft skills progress throughout your journey
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 className="animate-spin" size={32} color="var(--color-caramel)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-warm-greige)' }}>Loading your skills...</p>
        </div>
      ) : skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #ede9e3' }}>
          <BookOpen size={48} color="var(--color-warm-greige)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-warm-greige)', fontSize: '16px' }}>
            No skills recorded yet. Complete the onboarding to add your skills.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Skills by category */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-caramel)', marginBottom: '16px' }}>
              Technical Skills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {skills
                .filter(s => ['Python', 'Java', 'C/C++', 'JavaScript', 'SQL', 'React', 'Node.js', 'Cloud (AWS/GCP/Azure)', 'Machine Learning', 'Deep Learning', 'Data Structures & Algorithms', 'System Design', 'Computer Networks', 'Operating Systems', 'DBMS'].includes(s.skill_name))
                .map((skill, idx) => (
                  <motion.div
                    key={skill.skill_name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'white',
                      border: '1px solid #ede9e3',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-caramel)', margin: 0 }}>
                        {skill.skill_name}
                      </h3>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: getConfidenceColor(skill.confidence) + '20',
                        color: getConfidenceColor(skill.confidence)
                      }}>
                        {confidenceLabels[skill.confidence] || 'Unknown'}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: '#f0ede8',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.confidence / 5) * 100}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 + 0.2 }}
                        style={{
                          height: '100%',
                          background: getConfidenceColor(skill.confidence),
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Soft skills */}
          {skills.some(s => ['Communication', 'Leadership', 'Problem Solving', 'Research', 'Statistics & Math'].includes(s.skill_name)) && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-caramel)', marginBottom: '16px' }}>
                Soft Skills
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {skills
                  .filter(s => ['Communication', 'Leadership', 'Problem Solving', 'Research', 'Statistics & Math'].includes(s.skill_name))
                  .map((skill, idx) => (
                    <motion.div
                      key={skill.skill_name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'white',
                        border: '1px solid #ede9e3',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-caramel)', margin: 0 }}>
                          {skill.skill_name}
                        </h3>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: getConfidenceColor(skill.confidence) + '20',
                          color: getConfidenceColor(skill.confidence)
                        }}>
                          {confidenceLabels[skill.confidence] || 'Unknown'}
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        background: '#f0ede8',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(skill.confidence / 5) * 100}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 + 0.2 }}
                          style={{
                            height: '100%',
                            background: getConfidenceColor(skill.confidence),
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

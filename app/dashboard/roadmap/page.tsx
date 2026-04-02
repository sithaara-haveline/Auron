'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import RoadmapTimeline from "@/components/dashboard/RoadmapTimeline"
import { Loader2, Map } from 'lucide-react'
import type { Milestone } from '@/lib/types'

export default function RoadmapPage() {
  const { user, loading: authLoading } = useAuth()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
      return
    }

    if (user) {
      loadMilestones()
    }
  }, [user, authLoading])

  const loadMilestones = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('roadmap')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })

      setMilestones(data || [])
    } catch (error) {
      console.error('Error loading milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-caramel)" />
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '280px', padding: '40px 48px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Map size={28} color="var(--color-caramel)" />
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-caramel)', margin: 0 }}>
            Your Roadmap
          </h1>
        </div>
        <p style={{ color: 'var(--color-warm-greige)', fontSize: '16px', margin: 0 }}>
          {milestones.length} milestones · {milestones.filter(m => m.status === 'completed').length} completed
        </p>
      </div>

      {/* Timeline */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 className="animate-spin" size={32} color="var(--color-caramel)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-warm-greige)' }}>Loading your roadmap...</p>
        </div>
      ) : milestones.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #ede9e3'
        }}>
          <Map size={48} color="var(--color-warm-greige)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-warm-greige)', fontSize: '16px' }}>
            No milestones yet. Go back to onboarding to generate your personalized roadmap.
          </p>
        </div>
      ) : (
        <RoadmapTimeline milestones={milestones} />
      )}
    </div>
  )
}
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import type { Milestone, AuthUser } from '@/lib/types'

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeBubble, setActiveBubble] = useState<{type: 'chat'|'subtasks', id: string} | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatResponse, setChatResponse] = useState<string | null>(null)

  const handleMilestoneChatSubmit = async (milestoneTitle: string) => {
    if (!chatInput.trim() || !user) return

    setChatLoading(true)
    const userQuestion = chatInput
    setChatInput('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `I'm working on the milestone "${milestoneTitle}". ${userQuestion}`
            }
          ],
          context: `Milestone: ${milestoneTitle}`
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      setChatResponse(data.content)
    } catch (error: any) {
      console.error('Chat error:', error?.message || error)
      setChatResponse(`Error: ${error?.message || 'Unable to connect to Auron. Check your API key.'}`)
    } finally {
      setChatLoading(false)
    }
  }

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata
        })
      }

      if (authUser) {
        const { data } = await supabase
          .from('roadmap')
          .select('*')
          .eq('user_id', authUser.id)
          .order('due_date', { ascending: true })

        setMilestones(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const completed = milestones.filter(m => m.status === 'completed').length
  const score = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      technical: '#3b82f6',
      project: '#8b5cf6',
      career: 'var(--color-caramel)',
      soft: '#10b981',
      exam: '#f59e0b',
      application: 'var(--color-sage-green)'
    }
    return map[cat] || 'var(--color-warm-greige)'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #ede9e3', borderTop: '3px solid var(--color-caramel)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--color-warm-greige)' }}>Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-caramel)', marginBottom: 16 }}>Please sign in to view your dashboard.</p>
          <a href="/login" style={{ background: 'var(--color-caramel)', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '280px' }}>
      <main style={{ padding: '40px 48px', maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-caramel)', marginBottom: 8 }}>
            Your Roadmap
          </h1>
          <p style={{ color: 'var(--color-warm-greige)', fontSize: 15 }}>
            {milestones.length} milestones · {completed} completed · Progress {score}%
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ background: '#ede9e3', borderRadius: 8, height: 8, marginBottom: 40, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%', background: 'var(--color-caramel)', borderRadius: 8 }}
          />
        </div>

        {/* No milestones state */}
        {milestones.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--color-warm-greige)', fontSize: 16, marginBottom: 24 }}>
              Your roadmap is being generated. If it&apos;s been a while, try regenerating it.
            </p>
            <a href="/onboarding" style={{ background: 'var(--color-caramel)', color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
              Go back to onboarding →
            </a>
          </div>
        )}

        {/* Milestones timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
            >
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: m.status === 'completed' ? 'var(--color-sage-green)' : 'var(--color-caramel)',
                  border: '2px solid',
                  borderColor: m.status === 'completed' ? 'var(--color-sage-green)' : 'var(--color-caramel)',
                  flexShrink: 0
                }} />
                {i < milestones.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 40, background: '#ede9e3', marginTop: 4 }} />
                )}
              </div>

              {/* Card */}
              <div style={{ flex: 1, background: 'var(--color-card)', border: '1px solid var(--color-card-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                {/* Card header — clickable div with separate action buttons */}
                <div
                  onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                  style={{ width: '100%', padding: '20px 24px', textAlign: 'left', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                        padding: '2px 8px', borderRadius: 20,
                        background: `${getCategoryColor(m.category)}18`,
                        color: getCategoryColor(m.category)
                      }}>
                        {m.category}
                      </span>
                      {m.status === 'completed' && (
                        <span style={{ fontSize: 11, color: 'var(--color-sage-green)', fontWeight: 600 }}>✓ Completed</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-caramel)', margin: 0 }}>
                      {m.milestone_title}
                    </h3>
                    {m.due_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <Calendar size={13} color="var(--color-warm-greige)" />
                        <span style={{ fontSize: 12, color: 'var(--color-warm-greige)' }}>
                          Due: {new Date(m.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {expandedId === m.id
                      ? <ChevronUp size={18} color="var(--color-caramel)" />
                      : <ChevronDown size={18} color="var(--color-warm-greige)" />
                    }
                  </div>
                </div>
                
                {/* Action buttons — separate row */}
                <div style={{ display: 'flex', gap: 8, padding: '0 24px 12px', alignItems: 'center' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveBubble(activeBubble?.id === m.id && activeBubble.type === 'chat' ? null : { type: 'chat', id: m.id }) }}
                    title="Chat with Auron about this"
                    style={{
                      width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: activeBubble?.id === m.id && activeBubble.type === 'chat' ? 'var(--color-caramel)' : 'rgba(101,53,15,0.1)',
                      color: activeBubble?.id === m.id && activeBubble.type === 'chat' ? 'white' : 'var(--color-caramel)',
                      fontSize: 12, fontWeight: 600
                    }}>
                    Ask →
                  </button>
                </div>

                {/* Expanded description */}
                <AnimatePresence>
                  {expandedId === m.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderTop: '1px solid var(--color-card-border)', padding: '20px 24px' }}
                    >
                      <p style={{ fontSize: 14, color: 'var(--color-warm-greige)', lineHeight: 1.7, marginBottom: 16 }}>
                        {m.description}
                      </p>
                      {m.status !== 'completed' && (
                        <button
                          onClick={async () => {
                            await supabase.from('roadmap').update({ status: 'completed' }).eq('id', m.id)
                            setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status: 'completed' } : x))
                          }}
                          style={{
                            background: 'var(--color-sage-green)', color: 'white', border: 'none',
                            padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600
                          }}>
                          Mark as completed ✓
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat panel */}
                <AnimatePresence>
                  {activeBubble?.id === m.id && activeBubble.type === 'chat' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ borderTop: '1px solid var(--color-card-border)', padding: '16px 24px', background: '#faf9f7' }}
                    >
                      <p style={{ fontSize: 12, color: 'var(--color-caramel)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Ask Auron about this milestone
                      </p>
                      <div style={{ display: 'flex', gap: 8, marginBottom: chatResponse ? 12 : 0 }}>
                        <input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && handleMilestoneChatSubmit(m.milestone_title)}
                          placeholder={`Ask about "${m.milestone_title}"...`}
                          disabled={chatLoading}
                          style={{
                            flex: 1, padding: '10px 14px', border: '1px solid var(--color-card-border)',
                            borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none',
                            background: 'white', opacity: chatLoading ? 0.6 : 1
                          }}
                        />
                        <button
                          onClick={() => handleMilestoneChatSubmit(m.milestone_title)}
                          disabled={chatLoading}
                          style={{
                            background: chatLoading ? '#ccc' : 'var(--color-caramel)', 
                            color: 'white', border: 'none',
                            padding: '10px 16px', borderRadius: 8, cursor: chatLoading ? 'not-allowed' : 'pointer', fontSize: 13
                          }}>
                          {chatLoading ? '...' : 'Ask →'}
                        </button>
                      </div>
                      {chatResponse && (
                        <div style={{
                          padding: '12px', background: 'white', borderRadius: 8,
                          border: '1px solid var(--color-card-border)', fontSize: 13,
                          color: 'var(--color-foreground)', lineHeight: '1.6', marginBottom: 8
                        }}>
                          {chatResponse}
                        </div>
                      )}
                      <p style={{ fontSize: 11, color: 'var(--color-warm-greige)', margin: 0 }}>
                        💬 Full chat with Auron → Chat tab
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
'use client'
import { motion, AnimatePresence } from 'motion/react'
import { useState, MouseEvent, ReactNode } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, List, Calendar, History, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Milestone } from '@/lib/types'

interface RoadmapTimelineProps {
  milestones: Milestone[]
}

export default function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [activeBubble, setActiveBubble] = useState<string | null>(null)

  // Determine status based on due_date and current status field
  const getMilestoneStatus = (milestone: Milestone): 'completed' | 'current' | 'future' => {
    if (milestone.status === 'completed') return 'completed'
    const today = new Date()
    const due = new Date(milestone.due_date)
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    if (diff < 30) return 'current'
    return 'future'
  }

  const markComplete = async (milestoneId: string) => {
    await supabase
      .from('roadmap')
      .update({ status: 'completed' })
      .eq('id', milestoneId)
    window.location.reload()
  }

  const getNodeColor = (status: 'completed' | 'current' | 'future'): string => {
    if (status === 'completed') return 'var(--color-sage-green)'
    if (status === 'current') return 'var(--color-caramel)'
    return 'transparent'
  }

  const getNodeBorderColor = (status: 'completed' | 'current' | 'future'): string => {
    if (status === 'completed') return 'var(--color-sage-green)'
    if (status === 'current') return 'var(--color-caramel)'
    return 'var(--color-gingerbread)'
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => {
        const status = getMilestoneStatus(milestone)
        const isExpanded = expandedMilestone === milestone.id

        return (
          <div key={milestone.id}>
            <div className="flex items-start gap-6">

              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-5 h-5 rounded-full border-2 relative"
                  style={{
                    backgroundColor: getNodeColor(status),
                    borderColor: getNodeBorderColor(status),
                    flexShrink: 0
                  }}
                >
                  {status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'var(--color-caramel)' }}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                {index < milestones.length - 1 && (
                  <motion.div
                    className="w-0.5 mt-2"
                    style={{ backgroundColor: 'var(--color-card-border)', minHeight: '60px' }}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  />
                )}
              </div>

              {/* Milestone card */}
              <motion.div
                className="flex-1 pb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="p-5 rounded-xl border transition-all duration-200"
                  style={{
                    backgroundColor: status === 'completed' ? 'rgba(122,171,138,0.05)' : 'var(--color-card)',
                    borderColor: status === 'current' ? 'var(--color-caramel)' :
                                 status === 'completed' ? 'var(--color-sage-green)' : 'var(--color-card-border)',
                    borderWidth: status === 'current' ? '2px' : '1px'
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-caramel)',
                        marginBottom: '6px'
                      }}>
                        {milestone.milestone_title}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--color-warm-greige)',
                        lineHeight: 1.6,
                        marginBottom: '10px'
                      }}>
                        {milestone.description}
                      </p>
                      {milestone.due_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} style={{ color: 'var(--color-warm-greige)' }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-warm-greige)' }}>
                            Due: {new Date(milestone.due_date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action bubbles */}
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      {status === 'completed' ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-sage-green)' }}>
                          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <button
                          onClick={() => markComplete(milestone.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor: 'rgba(101,53,15,0.08)',
                            color: 'var(--color-caramel)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                          title="Mark complete"
                        >
                          ✓
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: isExpanded ? 'var(--color-caramel)' : 'rgba(101,53,15,0.08)',
                          color: isExpanded ? 'white' : 'var(--color-caramel)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        title="Expand"
                      >
                        <List size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Category tag */}
                  <div style={{ marginTop: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(101,53,15,0.08)',
                      color: 'var(--color-caramel)',
                      textTransform: 'capitalize'
                    }}>
                      {milestone.category}
                    </span>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: 'var(--color-card-border)' }}
                      >
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--color-warm-greige)',
                          lineHeight: 1.7
                        }}>
                          {milestone.description}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-warm-greige)',
                          marginTop: '12px',
                          fontStyle: 'italic'
                        }}>
                          Chat with Auron about this milestone to get subtasks and guidance.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
